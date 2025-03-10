import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import { useProjectStore } from './projectStore';

export interface Switch {
    id: string;
    name: string;
    numericId: number;
    description: string;
    initialValue: boolean;
}

interface SwitchesState {
    switches: Switch[];
    isLoading: boolean;
    error: string | null;

    // Actions
    getSwitches: () => Switch[];
    addSwitch: (name: string, description?: string, initialValue?: boolean) => Switch;
    updateSwitch: (id: string, updates: Partial<Omit<Switch, 'id' | 'numericId'>>) => void;
    deleteSwitch: (id: string) => void;
    getNextNumericId: () => number;
}

export const useSwitchesStore = create<SwitchesState>()(
    immer((set, get) => ({
        switches: [],
        isLoading: false,
        error: null,

        getSwitches: () => {
            const { currentProject } = useProjectStore.getState();
            if (!currentProject) return [];
            return currentProject.variables.map(variable => ({
                ...variable,
                description: variable.description || '',
            }));
        },

        addSwitch: (name, description = '', initialValue = false) => {
            const { currentProject, updateProject } = useProjectStore.getState();
            if (!currentProject) {
                set(state => {
                    state.error = 'No project is currently open';
                    return state;
                });
                throw new Error('No project is currently open');
            }

            const nextNumericId = get().getNextNumericId();

            const newSwitch: Switch = {
                id: nanoid(),
                name,
                numericId: nextNumericId,
                description: description || '',
                initialValue,
            };

            updateProject(draft => {
                draft.variables.push(newSwitch);
            });

            return newSwitch;
        },

        updateSwitch: (id, updates) => {
            const { currentProject, updateProject } = useProjectStore.getState();

            if (!currentProject) {
                set(state => {
                    state.error = 'No project is currently open';
                    return state;
                });
                return;
            }

            updateProject(draft => {
                const switchIndex = draft.variables.findIndex(s => s.id === id);
                if (switchIndex !== -1) {
                    draft.variables[switchIndex] = {
                        ...draft.variables[switchIndex],
                        ...updates,
                    };
                }
            });
        },

        deleteSwitch: (id) => {
            const { currentProject, updateProject } = useProjectStore.getState();

            if (!currentProject) {
                set(state => {
                    state.error = 'No project is currently open';
                    return state;
                });
                return;
            }

            updateProject(draft => {
                draft.variables = draft.variables.filter(s => s.id !== id);
            });
        },

        getNextNumericId: () => {
            const { currentProject } = useProjectStore.getState();
            if (!currentProject || !currentProject.variables.length) return 0;

            // Find the maximum numericId and add 1
            const maxId = Math.max(...currentProject.variables.map(v => v.numericId));
            return maxId + 1;
        }
    }))
);