import { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { HeaderBar } from './HeaderBar';
import { Toaster } from 'sonner';
import { useProjectStore } from '@/application/state/project/projectStore';

export function AppLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentProject = useProjectStore(state => state.currentProject);
  const isProjectOpen = !!currentProject;

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <HeaderBar 
        toggleSidebar={toggleSidebar} 
        isSidebarCollapsed={isSidebarCollapsed}
        projectName={currentProject?.name}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only visible when a project is open */}
        {isProjectOpen && (
          <Sidebar collapsed={isSidebarCollapsed} toggleCollapsed={toggleSidebar} />
        )}

        {/* Main content */}
        <main 
          className={`flex-1 overflow-auto p-0 transition-all ${
            isProjectOpen ? 'border-l border-border/30' : ''
          }`}
        >
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'border border-border bg-card text-foreground',
          style: {
            borderRadius: '0.5rem',
          }
        }}
      />
    </div>
  );
}