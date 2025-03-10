// packages\editor\src\presentation\pages\characters\index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProjectStore } from '../../../application/state/project/projectStore';
import { Button } from '../../components/ui/button';
import { CharactersList } from './components/CharactersList';
import { CharacterForm } from './components/CharacterForm';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../hooks/useToast';
import { v4 as uuidv4 } from 'uuid';

export function CharactersPage() {
  const { success } = useToast();
  const { currentProject, updateProject } = useProjectStore();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const characters = currentProject?.characters || [];
  const profiles = currentProject?.profiles || [];

  const selectedCharacter = selectedCharacterId 
    ? characters.find(char => char.id === selectedCharacterId) 
    : null;
  
  const handleAddCharacter = () => {
    setSelectedCharacterId(null);
    setIsCreating(true);
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(id);
    setIsCreating(false);
  };

  const handleSaveCharacter = (character: any) => {
    if (!currentProject) return;

    updateProject((draft) => {
      if (isCreating) {
        const newCharacter = {
          id: uuidv4(),
          ...character,
          states: character.states || []
        };
        draft.characters.push(newCharacter);
        setSelectedCharacterId(newCharacter.id);
        setIsCreating(false);
        success("Character created successfully");
      } else {
        const index = draft.characters.findIndex(c => c.id === selectedCharacterId);
        if (index !== -1) {
          draft.characters[index] = {
            ...draft.characters[index],
            ...character
          };
          success("Character updated successfully");
        }
      }
    });
  };

  const handleDeleteCharacter = (id: string) => {
    if (!currentProject) return;

    updateProject((draft) => {
      draft.characters = draft.characters.filter(c => c.id !== id);
      if (selectedCharacterId === id) {
        setSelectedCharacterId(null);
      }
      success("Character deleted successfully");
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Characters</h1>
          <Button 
            size="sm" 
            onClick={handleAddCharacter}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Character
          </Button>
        </div>
        
        {characters.length > 0 ? (
          <CharactersList 
            characters={characters} 
            selectedId={selectedCharacterId}
            onSelect={handleSelectCharacter}
            onDelete={handleDeleteCharacter}
          />
        ) : (
          <EmptyState
            title="No Characters Yet"
            description="Characters are the actors in your game. Create one to get started."
            icon="user"
            action={{
              label: "Create First Character",
              onClick: handleAddCharacter
            }}
          />
        )}
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {(selectedCharacter || isCreating) && (
          <CharacterForm
            character={isCreating ? null : selectedCharacter}
            profiles={profiles}
            onSave={handleSaveCharacter}
            onCancel={() => {
              setIsCreating(false);
              if (isCreating) setSelectedCharacterId(null);
            }}
          />
        )}
        
        {!selectedCharacter && !isCreating && (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              title="No Character Selected"
              description="Select a character from the list or create a new one."
              icon="user"
              size="lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}