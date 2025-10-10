"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mcpOrchestrator } from "@/lib/mcp/orchestrator";
import { useChat } from "@/hooks/useChat";
import { Message } from "@/components/chat/message";
import { ChatInput } from "@/components/chat/chat-input";
import type { MCPTool } from "@/lib/mcp/types";
import { Trash2, Loader2 } from "lucide-react";

export default function ChatPage() {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  useEffect(() => {
    const init = async () => {
      await mcpOrchestrator.initialize();
      setTools(mcpOrchestrator.getAllTools());
      setInitialized(true);
    };

    init();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="text-muted-foreground mt-2">
            Chat with Claude powered by MCP tools
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearMessages}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        )}
      </div>

      {!initialized ? (
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p>Initializing MCP servers...</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <Card className="lg:col-span-2 p-6">
            <div className="h-[600px] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <div className="text-lg font-semibold mb-2">
                      Start a conversation with Claude
                    </div>
                    <div className="text-sm">
                      {tools.length} tool{tools.length !== 1 ? "s" : ""}{" "}
                      available from enabled MCP servers
                    </div>
                    {tools.length === 0 && (
                      <div className="mt-4 text-xs text-yellow-600 dark:text-yellow-500">
                        ⚠️ No tools available. Enable MCP servers in the{" "}
                        <a href="/servers" className="underline">
                          Servers
                        </a>{" "}
                        page.
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <Message key={message.id} message={message} />
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">
                            Thinking...
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Input Area */}
              <ChatInput onSend={sendMessage} disabled={isLoading || !initialized} />
            </div>
          </Card>

          {/* Tools Panel */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
            <div className="text-sm text-muted-foreground mb-4">
              These tools are available to Claude from enabled MCP servers.
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {tools.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  <div className="text-4xl mb-2">🔧</div>
                  No tools available.
                  <br />
                  <a href="/servers" className="text-primary underline mt-2 inline-block">
                    Enable MCP servers
                  </a>
                </div>
              ) : (
                tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="p-3 border rounded-md text-sm hover:bg-accent transition-colors"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-lg">🔧</span>
                      {tool.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {tool.description}
                    </div>
                    <div className="text-xs text-primary mt-1 font-mono">
                      {tool.serverId}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
