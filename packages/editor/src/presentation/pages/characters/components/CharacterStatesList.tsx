/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useDisclosure } from '../../../hooks/common/useDisclosure';

interface CharacterStatesListProps {
  states: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CharacterStatesList({ 
  states, 
  selectedId, 
  onSelect, 
  onDelete 
}: CharacterStatesListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stateToDelete, setStateToDelete] = React.useState<string | null>(null);

  if (states.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 dark:text-slate-400 italic">
        No states defined yet.
      </div>
    );
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStateToDelete(id);
    onOpen();
  };

  const confirmDelete = () => {
    if (stateToDelete) {
      onDelete(stateToDelete);
      onClose();
    }
  };

  return (
    <>
      <ScrollArea className="h-[400px] pr-3">
        <div className="space-y-2">
          {states.map((state) => (
            <div
              key={state.id}
              className={`
                flex items-center justify-between p-2 rounded-md cursor-pointer
                ${selectedId === state.id 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }
              `}
              onClick={() => onSelect(state.id)}
            >
              <span className="font-medium">{state.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500"
                onClick={(e) => handleDeleteClick(e, state.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <ConfirmDialog
        isOpen={isOpen}
        onCancel={onClose}
        onConfirm={confirmDelete}
        title="Delete Character State"
        message="Are you sure you want to delete this state? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
      />
    </>
  );
}