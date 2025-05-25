import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/sidebar";
import DocumentViewer from "@/components/document-viewer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Home() {
  const [location] = useLocation();
  const [currentPolicy, setCurrentPolicy] = useState<string>("privacy-policy");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const pathMatch = location.match(/\/policy\/(.+)/);
    if (pathMatch) {
      setCurrentPolicy(pathMatch[1]);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex gradient-bg">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <Sidebar 
          currentPolicy={currentPolicy} 
          onPolicyChange={setCurrentPolicy}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden glass-effect border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gradient">Hushh Legal Center</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-accent"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </Button>
          </div>
        </header>

        <DocumentViewer policyType={currentPolicy} />
      </main>
    </div>
  );
}
