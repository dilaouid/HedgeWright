// packages\editor\src\application\state\project\projectStore.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scene } from '@/domain/models/investigations/Scene';
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
    numericId: number;
    initialValue: boolean;
    description?: string;
}

export interface Character {
    id: string;
    name: string;
    profileId?: string;
    states?: CharacterState[];
    metadata?: Record<string, any>;
}

export interface CharacterState {
    id: string;
    name: string;
    imageId?: string;
    animations?: {
        idle?: string;
        talking?: string;
        special?: string;
    };
    metadata?: Record<string, any>;
}

export interface Music {
    name: string;
    path: string;
    relativePath?: string; // Path relative to project folder
    type: string; // bgm, sfx, voice, etc.
    loop?: boolean;
    metadata?: Record<string, any>;
}

export interface FolderStructure {
    audio: {
        bgm: string[];
        sfx: string[];
        voices: string[];
    };
    img: {
        backgrounds: string[];
        characters: string[];
        profiles: string[];
        evidences: string[];
        ui: string[];
        effects: string[];
    };
    documents: string[];
    data: string[];
}

export interface ProjectData {
    id: string;
    name: string;
    createdAt: string;
    lastModified: string;
    projectFolderPath: string; // Required - path to the project folder
    folders?: FolderStructure; // Optional structure to track folder contents
    scenes: Scene[]; // Array of scene IDs
    investigations: string[]; // Array of investigation IDs
    dialogues: string[]; // Array of dialogue IDs 
    crossExaminations: string[]; // Array of cross-examination IDs
    messages: string[]; // Array of message IDs
    events: string[]; // Array of event IDs
    evidence: string[]; // Array of evidence IDs
    profiles: string[]; // Array of profile IDs
    characters: Character[]; // Array of characters
    backgrounds: string[]; // Array of background IDs
    variables: ProjectVariable[];
    timeline: TimelineData;
    settings: ProjectSettings;
    assetMetadata?: Record<string, {
        displayName?: string;
        category?: string;
        [key: string]: any;
    }>;

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

// Create default folder structure
const createDefaultFolderStructure = (): FolderStructure => ({
    audio: {
        bgm: [],
        sfx: [],
        voices: []
    },
    img: {
        backgrounds: [],
        characters: [],
        profiles: [],
        evidences: [],
        ui: [],
        effects: []
    },
    documents: [],
    data: []
});

// Create normalized structure for missing fields
const normalizeProject = (project: Partial<ProjectData>): ProjectData => {
    return {
        ...project,
        projectFolderPath: project.projectFolderPath || '',
        folders: project.folders || createDefaultFolderStructure(),
        characters: project.characters || [],
        backgrounds: project.backgrounds || [],
        // Ensure all required arrays exist
        scenes: project.scenes || [],
        investigations: project.investigations || [],
        dialogues: project.dialogues || [],
        crossExaminations: project.crossExaminations || [],
        messages: project.messages || [],
        events: project.events || [],
        evidence: project.evidence || [],
        profiles: project.profiles || [],
        variables: project.variables || [],
        timeline: project.timeline || { nodes: [], connections: [] },
        settings: project.settings || {
            gameTitle: project.name || 'New Project',
            author: '',
            version: '1.0.0',
            resolution: { width: 1280, height: 720 }
        },
        assetMetadata: project.assetMetadata || {}
    } as ProjectData;
};

export const useProjectStore = create<ProjectState>()(
    immer((set) => ({
        currentProject: null,
        isDirty: false,
        isLoading: false,
        error: null,

        setProject: (project) => set({
            currentProject: normalizeProject(project),
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