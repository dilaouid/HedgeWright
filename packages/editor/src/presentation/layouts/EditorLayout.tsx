import React from 'react';
import { cn } from "@lib/utils";
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';

interface EditorLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Toolbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className={cn("flex-1 overflow-auto p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
} 