"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MCPServerConfig } from "@/lib/mcp/types";
import { serverRegistry } from "@/lib/mcp/server-registry";

export function ServerSelector() {
  const [servers, setServers] = useState<MCPServerConfig[]>([]);

  useEffect(() => {
    setServers(serverRegistry.getAllServers());
  }, []);

  const handleToggle = (id: string) => {
    const server = servers.find((s) => s.id === id);
    if (server) {
      serverRegistry.toggleServer(id, !server.enabled);
      setServers(serverRegistry.getAllServers());
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <Card key={server.id} className={server.enabled ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {server.name}
              <span
                className={`text-xs px-2 py-1 rounded ${
                  server.enabled ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"
                }`}
              >
                {server.enabled ? "Active" : "Inactive"}
              </span>
            </CardTitle>
            <CardDescription>{server.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Category:</strong> {server.category}
              </div>
              <div className="text-sm">
                <strong>Tools:</strong> {server.tools.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {server.tools.join(", ")}
              </div>
              <Button
                variant={server.enabled ? "outline" : "default"}
                size="sm"
                className="w-full mt-2"
                onClick={() => handleToggle(server.id)}
              >
                {server.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
