// packages/editor/src/presentation/pages/editor/index.tsx
import { useNavigate } from '@tanstack/react-router';
import {
  Layers,
  MessageSquare,
  Shield,
  GitPullRequest,
  FileBadge,
  Play,
} from 'lucide-react';
import { useProjectStore } from '@/application/state/project/projectStore';
import { StatCard } from './components/StatCard';
import { ModuleCard } from './components/ModuleCard';

export function EditorPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();

  if (!currentProject) {
    // Redirect to home if no project is open
    navigate({ to: '/' });
    return null;
  }

  const projectModules = [
    {
      name: 'Scenes',
      icon: <Layers className="h-10 w-10" />,
      description: 'Create and manage interactive scenes',
      path: '/scenes',
      count: currentProject.scenes.length,
    },
    {
      name: 'Dialogue',
      icon: <MessageSquare className="h-10 w-10" />,
      description: 'Write dialogue with rich text effects',
      path: '/dialogue',
      count: 0, // This would be replaced with actual dialogue count
    },
    {
      name: 'Cross-Examinations',
      icon: <Shield className="h-10 w-10" />,
      description: 'Create witness testimonies and contradictions',
      path: '/cross-examination',
      count: 0, // This would be replaced with actual examination count
    },
    {
      name: 'Evidence',
      icon: <FileBadge className="h-10 w-10" />,
      description: 'Manage evidence and character profiles',
      path: '/evidence',
      count: currentProject.evidence.length + currentProject.profiles.length,
    },
    {
      name: 'Timeline',
      icon: <GitPullRequest className="h-10 w-10" />,
      description: 'Organize your level flow and connections',
      path: '/timeline',
      count: currentProject.timeline.nodes.length,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Project header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{currentProject.name}</h1>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center">
            <Play className="h-4 w-4 mr-2" />
            Preview Level
          </button>
        </div>
        <div className="flex items-center text-sm mt-2 text-muted-foreground">
          <span>
            Last modified:{' '}
            {new Date(currentProject.lastModified).toLocaleString()}
          </span>
          <span className="mx-2">•</span>
          <span>
            Created: {new Date(currentProject.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Project stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Scenes"
          value={currentProject.scenes.length.toString()}
          trend="+2 this week"
          trendType="positive"
        />
        <StatCard
          title="Evidence Items"
          value={currentProject.evidence.length.toString()}
          trend="No change"
          trendType="neutral"
        />
        <StatCard
          title="Timeline Connections"
          value={currentProject.timeline.connections.length.toString()}
          trend="+5 this week"
          trendType="positive"
        />
      </div>

      {/* Module cards */}
      <h2 className="text-xl font-semibold mb-4">Project Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectModules.map((module) => (
          <ModuleCard
            key={module.name}
            name={module.name}
            icon={module.icon}
            description={module.description}
            path={module.path}
            count={module.count}
          />
        ))}
      </div>
    </div>
  );
}