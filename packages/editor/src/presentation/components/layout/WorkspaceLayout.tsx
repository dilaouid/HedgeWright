import React from 'react';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

/**
 * Workspace layout component
 * Provides consistent padding and styling for the main content area
 */
export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}