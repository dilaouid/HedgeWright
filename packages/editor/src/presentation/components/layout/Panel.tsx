import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Panel component
 * Reusable container with title and optional actions
 * Used throughout the editor for consistent section styling
 */
export function Panel({
  title,
  children,
  actions,
  className = '',
}: PanelProps) {
  return (
    <div className={`border rounded-lg overflow-hidden bg-card ${className}`}>
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <h2 className="font-medium">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
