/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useDisclosure } from '../../../hooks/common/useDisclosure';

interface CharactersListProps {
  characters: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CharactersList({ 
  characters, 
  selectedId, 
  onSelect, 
  onDelete 
}: CharactersListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [characterToDelete, setCharacterToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCharacterToDelete(id);
    onOpen();
  };

  const confirmDelete = () => {
    if (characterToDelete) {
      onDelete(characterToDelete);
      onClose();
    }
  };

  return (
    <>
      <div className="space-y-2">
        {characters.map((character) => (
          <Card
            key={character.id}
            className={`p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              selectedId === character.id ? 'bg-slate-100 dark:bg-slate-800 border-primary' : ''
            }`}
            onClick={() => onSelect(character.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">{character.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{character.customId}</span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(character.id);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500"
                  onClick={(e) => handleDeleteClick(e, character.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        onCancel={onClose}
        onConfirm={confirmDelete}
        title="Delete Character"
        message="Are you sure you want to delete this character? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
      />
    </>
  );
}