// packages/editor/src/presentation/components/layout/Sidebar.tsx
import { Link, useRouter } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Layers,
  MessageSquare,
  FileBadge,
  Shield,
  GitPullRequest,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export function Sidebar({ collapsed, toggleCollapsed }: SidebarProps) {
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/editor',
    },
    {
      name: 'Scenes',
      icon: <Layers size={20} />,
      path: '/scenes',
    },
    {
      name: 'Dialogue',
      icon: <MessageSquare size={20} />,
      path: '/dialogue',
    },
    {
      name: 'Cross-Examination',
      icon: <Shield size={20} />,
      path: '/cross-examination',
    },
    {
      name: 'Evidence',
      icon: <FileBadge size={20} />,
      path: '/evidence',
    },
    {
      name: 'Timeline',
      icon: <GitPullRequest size={20} />,
      path: '/timeline',
    },
    {
      name: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
    },
  ];

  return (
    <aside
      className={cn(
        'h-full bg-card border-r border-border/30 transition-all duration-300 flex flex-col',
        collapsed ? 'w-[60px]' : 'w-[230px]'
      )}
    >
      <div className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = router.state.location.pathname.startsWith(
              item.path
            );

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Toggle collapse button */}
      <div className="p-3 border-t border-border/30">
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center p-2 rounded-md bg-accent/5 hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
