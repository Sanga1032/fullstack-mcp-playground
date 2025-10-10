import type { MCPTool, MCPServerConfig } from "./types";
import { serverRegistry } from "./server-registry";

/**
 * MCP Host Orchestrator
 * Manages connections to multiple MCP servers and aggregates their tools
 */
export class MCPOrchestrator {
  private static instance: MCPOrchestrator;
  private tools: Map<string, MCPTool> = new Map();
  private connections: Map<string, EventSource> = new Map();

  private constructor() {}

  static getInstance(): MCPOrchestrator {
    if (!MCPOrchestrator.instance) {
      MCPOrchestrator.instance = new MCPOrchestrator();
    }
    return MCPOrchestrator.instance;
  }

  /**
   * Initialize connections to all enabled servers
   */
  async initialize() {
    const enabledServers = serverRegistry.getEnabledServers();

    console.log(`Initializing MCP Orchestrator with ${enabledServers.length} servers`);

    for (const server of enabledServers) {
      await this.connectToServer(server);
    }
  }

  /**
   * Connect to an MCP server via SSE
   */
  private async connectToServer(server: MCPServerConfig) {
    try {
      console.log(`Connecting to MCP server: ${server.name} (${server.endpoint})`);

      // For now, we'll use mock tools based on the configuration
      // In a real implementation, you would connect via SSE and discover tools
      server.tools.forEach((toolName) => {
        const tool: MCPTool = {
          name: toolName,
          description: `Tool from ${server.name}`,
          inputSchema: {
            type: "object",
            properties: {},
          },
          serverId: server.id,
        };

        // Namespace the tool with server ID
        const namespacedName = `${server.id}/${toolName}`;
        this.tools.set(namespacedName, tool);
      });

      console.log(`Connected to ${server.name}, discovered ${server.tools.length} tools`);
    } catch (error) {
      console.error(`Failed to connect to ${server.name}:`, error);
    }
  }

  /**
   * Get all available tools from all connected servers
   */
  getAllTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tools by server ID
   */
  getToolsByServer(serverId: string): MCPTool[] {
    return this.getAllTools().filter((tool) => tool.serverId === serverId);
  }

  /**
   * Call a tool by name
   */
  async callTool(toolName: string, _args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.get(toolName);

    if (!tool) {
      throw new Error(`Tool '${toolName}' not found`);
    }

    const server = serverRegistry.getServer(tool.serverId);

    if (!server) {
      throw new Error(`Server '${tool.serverId}' not found`);
    }

    console.log(`Calling tool ${toolName} on server ${server.name}`);

    // In a real implementation, you would call the MCP server's endpoint
    // For now, we'll return a mock response
    return {
      success: true,
      tool: toolName,
      server: server.name,
      result: `Mock result for ${toolName}`,
    };
  }

  /**
   * Disconnect from all servers
   */
  disconnect() {
    this.connections.forEach((connection) => {
      connection.close();
    });
    this.connections.clear();
    this.tools.clear();
  }
}

export const mcpOrchestrator = MCPOrchestrator.getInstance();
