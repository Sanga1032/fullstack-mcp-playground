import { ServerSelector } from "@/components/mcp/server-selector";

export default function ServersPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MCP Servers</h1>
        <p className="text-muted-foreground mt-2">
          Manage your Model Context Protocol servers. Enable or disable servers to control which tools are available to the AI agent.
        </p>
      </div>

      <ServerSelector />
    </div>
  );
}
