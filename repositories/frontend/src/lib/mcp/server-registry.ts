import type { MCPServerConfig, MCPServersRegistry } from "./types";

// Load server configuration
const serversConfig: MCPServersRegistry = {
  servers: [
    {
      id: "mcp-core",
      name: "Core Server",
      description: "System health, metrics, and configuration tools",
      endpoint: "https://api.localhost/mcp",
      enabled: true,
      category: "core",
      port: 8000,
      tools: ["get_health", "get_metrics", "get_config"]
    },
    {
      id: "mcp-database",
      name: "Database Server",
      description: "Database operations: query, insert, schema",
      endpoint: "https://api.localhost:8001/mcp",
      enabled: true,
      category: "database",
      port: 8001,
      tools: ["query_database", "insert_record", "get_database_schema"]
    },
    {
      id: "mcp-files",
      name: "File System Server",
      description: "File operations: read, write, list, search",
      endpoint: "https://api.localhost:8002/mcp",
      enabled: false,
      category: "files",
      port: 8002,
      tools: ["example_tool"]
    }
  ]
};

/**
 * MCP Server Registry
 * Manages available MCP servers and their configurations
 */
export class ServerRegistry {
  private static instance: ServerRegistry;
  private servers: Map<string, MCPServerConfig> = new Map();

  private constructor() {
    this.loadServers();
  }

  static getInstance(): ServerRegistry {
    if (!ServerRegistry.instance) {
      ServerRegistry.instance = new ServerRegistry();
    }
    return ServerRegistry.instance;
  }

  /**
   * Load servers from configuration
   */
  private loadServers() {
    const config = serversConfig as MCPServersRegistry;
    config.servers.forEach((server) => {
      this.servers.set(server.id, server);
    });
  }

  /**
   * Get all servers
   */
  getAllServers(): MCPServerConfig[] {
    return Array.from(this.servers.values());
  }

  /**
   * Get enabled servers only
   */
  getEnabledServers(): MCPServerConfig[] {
    return this.getAllServers().filter((server) => server.enabled);
  }

  /**
   * Get server by ID
   */
  getServer(id: string): MCPServerConfig | undefined {
    return this.servers.get(id);
  }

  /**
   * Enable/disable a server
   */
  toggleServer(id: string, enabled: boolean): void {
    const server = this.servers.get(id);
    if (server) {
      server.enabled = enabled;
    }
  }

  /**
   * Get servers by category
   */
  getServersByCategory(category: string): MCPServerConfig[] {
    return this.getAllServers().filter((server) => server.category === category);
  }
}

export const serverRegistry = ServerRegistry.getInstance();
