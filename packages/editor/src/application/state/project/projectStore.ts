import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface ProjectSettings {
    gameTitle: string;
    author: string;
    version: string;
    startingScene?: string;
    defaultMusicId?: string;
    resolution?: { width: number; height: number };
}

export enum TimelineNodeType {
    SCENE = 'scene',
    INVESTIGATION = 'investigation',
    DIALOGUE = 'dialogue',
    CROSS_EXAMINATION = 'cross_examination',
    MESSAGE = 'message',
    EVENT = 'event'
}

export interface TimelineNode {
    id: string;
    type: TimelineNodeType;
    refId: string; // References the actual item ID
    position: { x: number; y: number };
    size?: { width: number; height: number };
    metadata?: Record<string, any>; // For any type-specific data
}

export interface TimelineConnection {
    id: string;
    sourceId: string; // Source node ID
    targetId: string; // Target node ID
    condition?: string; // Optional condition based on variable state
    priority?: number; // Order of evaluation for multiple connections
}

export interface TimelineData {
    nodes: TimelineNode[];
    connections: TimelineConnection[];
    groups?: { // Optional grouping of related nodes
        id: string;
        name: string;
        nodeIds: string[];
        color?: string;
    }[];
}

export interface ProjectVariable {
    id: string;
    name: string;
    defaultValue: boolean;
    description?: string;
}

export interface ProjectData {
    id: string;
    name: string;
    createdAt: string;
    lastModified: string;
    scenes: string[]; // Array of scene IDs
    investigations: string[]; // Array of investigation IDs
    dialogues: string[]; // Array of dialogue IDs 
    crossExaminations: string[]; // Array of cross-examination IDs
    messages: string[]; // Array of message IDs
    events: string[]; // Array of event IDs
    evidence: string[]; // Array of evidence IDs
    profiles: string[]; // Array of profile IDs
    variables: ProjectVariable[];
    timeline: TimelineData;
    settings: ProjectSettings;
}

interface ProjectState {
    currentProject: ProjectData | null;
    isDirty: boolean; // Whether there are unsaved changes
    isLoading: boolean;
    error: Error | null;

    // Actions
    setProject: (project: ProjectData) => void;
    updateProject: (updater: (draft: ProjectData) => void) => void;
    clearProject: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
    markDirty: (isDirty: boolean) => void;
}

export const useProjectStore = create<ProjectState>()(
    immer((set) => ({
        currentProject: null,
        isDirty: false,
        isLoading: false,
        error: null,

        setProject: (project) => set({
            currentProject: project,
            isDirty: false,
            error: null
        }),

        updateProject: (updater) => set((state) => {
            if (!state.currentProject) {
                state.error = new Error('No project is currently open');
                return state;
            }

            // Use immer to create an immutable update
            updater(state.currentProject);
            state.isDirty = true;
            return state;
        }),

        clearProject: () => set({
            currentProject: null,
            isDirty: false,
            error: null
        }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        markDirty: (isDirty) => set({ isDirty })
    }))
);