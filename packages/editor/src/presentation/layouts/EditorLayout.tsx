import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';

interface EditorLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-blue-950 to-indigo-950">
      <Toolbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar collapsed={sidebarCollapsed} toggleCollapsed={toggleSidebar} />
        <main 
          className={cn(
            "flex-1 overflow-auto p-4 transition-all duration-300",
            className
          )}
          style={{
            backgroundImage: "url('/assets/images/ui/courtroom-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="backdrop-blur-sm backdrop-brightness-[0.2] backdrop-contrast-125 min-h-full rounded-xl overflow-hidden p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}