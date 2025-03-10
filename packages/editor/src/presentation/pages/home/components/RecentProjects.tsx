/* eslint-disable react/react-in-jsx-scope */
// packages/editor/src/presentation/pages/home/components/RecentProjects.tsx
import { format } from 'date-fns';
import { useProjectActions } from '@/application/hooks/project/useProjectActions';
import { Trash2, FolderOpen, MoreHorizontal } from 'lucide-react';
import { RecentProjectsProps } from '../types/RecentProjectsType';

export function RecentProjects({
  projects,
  isLoading,
  onSelectProject,
}: RecentProjectsProps) {
  const { removeProject } = useProjectActions();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-muted rounded-lg p-6 text-center">
        <p className="text-muted-foreground">No recent projects found</p>
        <p className="text-sm mt-2 text-muted-foreground">
          Create a new project or import an existing one to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-card hover:bg-accent/10 rounded-lg border border-border overflow-hidden transition-colors"
        >
          {/* Thumbnail or placeholder */}
          <div
            className="h-32 bg-accent/5 flex items-center justify-center cursor-pointer"
            onClick={() => onSelectProject(project.id)}
          >
            {project.thumbnailPath ? (
              <img
                src={project.thumbnailPath}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-2xl font-bold text-accent/40">
                {project.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Project info */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className="font-semibold truncate cursor-pointer hover:text-primary"
                  onClick={() => onSelectProject(project.id)}
                >
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Last modified: {format(new Date(project.lastModified), 'PPp')}
                </p>
              </div>

              <div className="flex">
                <button
                  className="p-1 rounded-full hover:bg-accent/10"
                  onClick={() => onSelectProject(project.id)}
                  title="Open project"
                >
                  <FolderOpen className="h-4 w-4" />
                </button>

                <button
                  className="p-1 rounded-full hover:bg-accent/10 ml-1"
                  onClick={() => removeProject(project.id)}
                  title="Remove from recent projects"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  className="p-1 rounded-full hover:bg-accent/10 ml-1"
                  title="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Project path (truncated) */}
            <p
              className="text-xs text-muted-foreground mt-2 truncate"
              title={project.path}
            >
              {project.path}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
