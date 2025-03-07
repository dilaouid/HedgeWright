import React from 'react';
import { FileText, FolderPlus, Import, ChevronRight, Sparkles } from 'lucide-react';
import { useProjectActions } from '@/application/hooks/project/useProjectActions';

interface WelcomeSectionProps {
  onCreateProject: () => void;
}

export function WelcomeSection({ onCreateProject }: WelcomeSectionProps) {
  const { importProject } = useProjectActions();

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl -z-10" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />

      {/* Content */}
      <div className="p-8 md:p-12 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Hero image/icon */}
          <div className="relative flex-shrink-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-card/50 backdrop-blur-sm" />
            <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-primary/80" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Welcome text */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome to HedgeWright Editor
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Create, edit and manage your Ace Attorney-style game levels with this powerful editor. 
              Start by creating a new project or importing an existing one.
            </p>
            
            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={onCreateProject}
                className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors"
              >
                <FileText className="mr-2 h-5 w-5" />
                New Project
              </button>
              
              <button
                onClick={importProject}
                className="inline-flex items-center px-5 py-2.5 bg-secondary text-secondary-foreground rounded-md shadow-sm hover:bg-secondary/90 transition-colors"
              >
                <Import className="mr-2 h-5 w-5" />
                Import Project
              </button>
              
              <button
                className="inline-flex items-center px-5 py-2.5 bg-accent/10 hover:bg-accent/20 text-foreground rounded-md transition-colors"
              >
                <FolderPlus className="mr-2 h-5 w-5" />
                Browse Templates
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick links */}
        <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <QuickLinkCard 
            title="Documentation" 
            description="Learn how to use HedgeWright and all its features"
            icon={<FileText className="h-5 w-5" />}
          />
          <QuickLinkCard 
            title="Video Tutorials" 
            description="Watch step-by-step tutorials for quick start"
            icon={<FileText className="h-5 w-5" />}
          />
          <QuickLinkCard 
            title="Community" 
            description="Join the HedgeWright community and get help"
            icon={<FileText className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/5 transition-colors cursor-pointer">
      <div className="flex items-start">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-medium group-hover:text-primary transition-colors">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}