import { Project } from "@/application/state/project/recentProjectsStore";

export interface RecentProjectsProps {
    projects: Project[];
    isLoading: boolean;
    onSelectProject: (id: string) => void;
}