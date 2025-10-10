import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold">
                MCP Playground
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/chat"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Chat
                </Link>
                <Link
                  href="/servers"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Servers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
