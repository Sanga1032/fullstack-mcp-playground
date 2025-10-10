import Anthropic from "@anthropic-ai/sdk";
import type { MCPTool } from "../mcp/types";

/**
 * Claude API Client with MCP Tool Support
 */
export class ClaudeClient {
  private client: Anthropic;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  /**
   * Send a message to Claude with available MCP tools
   */
  async sendMessage(
    message: string,
    tools: MCPTool[],
    conversationHistory: Anthropic.MessageParam[] = []
  ) {
    try {
      // Convert MCP tools to Claude tool format
      const claudeTools = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      }));

      // Add user message to history
      const messages: Anthropic.MessageParam[] = [
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ];

      console.log(`Sending message to Claude with ${claudeTools.length} tools available`);

      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        tools: claudeTools,
        messages,
      });

      return response;
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  }

  /**
   * Stream a message from Claude
   */
  async *streamMessage(
    message: string,
    tools: MCPTool[],
    conversationHistory: Anthropic.MessageParam[] = []
  ): AsyncGenerator<Anthropic.Messages.RawMessageStreamEvent, void, unknown> {
    try {
      const claudeTools = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      }));

      const messages: Anthropic.MessageParam[] = [
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ];

      const stream = await this.client.messages.stream({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        tools: claudeTools,
        messages,
      });

      for await (const event of stream) {
        yield event;
      }
    } catch (error) {
      console.error("Error streaming from Claude API:", error);
      throw error;
    }
  }
}
