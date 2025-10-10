/**
 * MCP Server Configuration
 */
export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  enabled: boolean;
  category: "core" | "database" | "files" | "custom";
  port: number;
  tools: string[];
}

/**
 * MCP Tool Definition
 */
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
    required?: string[];
  };
  serverId: string;
}

/**
 * MCP Servers Registry
 */
export interface MCPServersRegistry {
  servers: MCPServerConfig[];
}

/**
 * Chat Message
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

/**
 * Tool Call
 */
export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
}
