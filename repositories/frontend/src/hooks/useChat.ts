import { useState, useCallback } from "react";
import { ClaudeClient } from "@/lib/claude/client";
import { mcpOrchestrator } from "@/lib/mcp/orchestrator";
import type { ChatMessage } from "@/lib/mcp/types";
import Anthropic from "@anthropic-ai/sdk";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Check if API key is configured
      const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        throw new Error("Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env file.");
      }

      // Get available tools from enabled MCP servers
      const tools = mcpOrchestrator.getAllTools();

      console.log(`Sending message with ${tools.length} tools available`);

      // Initialize Claude client
      const claudeClient = new ClaudeClient(apiKey);

      // Convert chat history to Anthropic format
      const anthropicMessages: Anthropic.MessageParam[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send message to Claude
      const response = await claudeClient.sendMessage(
        userMessage,
        tools,
        anthropicMessages
      );

      console.log("Claude response:", response);

      // Handle the response
      let assistantContent = "";
      const toolCalls: Array<{ id: string; name: string; input: Record<string, unknown>; output?: unknown }> = [];

      // Process content blocks
      for (const block of response.content) {
        if (block.type === "text") {
          assistantContent += block.text;
        } else if (block.type === "tool_use") {
          console.log("Claude wants to use tool:", block.name, block.input);

          // Execute the tool via MCP orchestrator
          try {
            const toolResult = await mcpOrchestrator.callTool(
              block.name,
              block.input as Record<string, unknown>
            );

            toolCalls.push({
              id: block.id,
              name: block.name,
              input: block.input as Record<string, unknown>,
              output: toolResult,
            });

            console.log("Tool result:", toolResult);

            // If there are tool calls, we need to send the results back to Claude
            // and get the final response
            const toolResultMessages: Anthropic.MessageParam[] = [
              ...anthropicMessages,
              { role: "user", content: userMessage },
              { role: "assistant", content: response.content },
              {
                role: "user",
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: block.id,
                    content: JSON.stringify(toolResult),
                  },
                ],
              },
            ];

            // Get final response from Claude
            const finalResponse = await claudeClient.sendMessage(
              "", // Empty message as we're sending tool results
              tools,
              toolResultMessages
            );

            // Extract text from final response
            for (const finalBlock of finalResponse.content) {
              if (finalBlock.type === "text") {
                assistantContent += finalBlock.text;
              }
            }
          } catch (toolError) {
            console.error("Error executing tool:", toolError);
            assistantContent += `\n\n[Error executing tool ${block.name}: ${toolError}]`;
          }
        }
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent || "I couldn't generate a response.",
        timestamp: new Date(),
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);

      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
