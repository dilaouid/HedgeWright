import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useProjectStore } from '@/application/state/project/projectStore';
import {
  useSwitchesStore,
  Switch,
} from '@/application/state/project/switchesStore';
import { useToast } from '@/presentation/hooks/useToast';
import { SwitchesHeader } from './components/SwitchesHeader';
import { SwitchesFilter } from './components/SwitchesFilter';
import { SwitchesList } from './components/SwitchesList';
import { InfoCard } from './components/InfoCard';
import { NewSwitchForm } from './components/NewSwitchForm';
import { ConfirmDialog } from './components/ConfirmDialog';

export function SwitchesPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const { getSwitches, addSwitch, updateSwitch, deleteSwitch } =
    useSwitchesStore();
  const toast = useToast();

  // Local state for the switches list and filters
  const [switches, setSwitches] = useState<Switch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyTrue, setShowOnlyTrue] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [switchToDelete, setSwitchToDelete] = useState<string | null>(null);

  const [showOnlyFalse, setShowOnlyFalse] = useState(false);

  // Form state for adding new switch
  const [newSwitchName, setNewSwitchName] = useState('');
  const [newSwitchDescription, setNewSwitchDescription] = useState('');
  const [newSwitchValue, setNewSwitchValue] = useState(false);

  useEffect(() => {
    if (!currentProject) {
      navigate({ to: '/' });
      return;
    }

    // Load switches
    refreshSwitches();
  }, [currentProject]);

  const refreshSwitches = () => {
    const loadedSwitches = getSwitches();
    setSwitches(loadedSwitches);
  };

  const getFilteredSwitches = () => {
    return switches.filter((s) => {
      // Apply search filter
      const matchesSearch = searchQuery
        ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Apply value filters
      const matchesValue =
        (showOnlyTrue && s.initialValue) ||
        (showOnlyFalse && !s.initialValue) ||
        (!showOnlyTrue && !showOnlyFalse);

      return matchesSearch && matchesValue;
    });
  };

  const handleConfirmDelete = (id: string) => {
    setSwitchToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (switchToDelete) {
      try {
        deleteSwitch(switchToDelete);
        refreshSwitches();
        toast.success('Switch deleted successfully');
      } catch (error) {
        toast.error(
          `Failed to delete switch: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
    setConfirmDialogOpen(false);
    setSwitchToDelete(null);
  };

  const handleAddSwitch = () => {
    if (!newSwitchName.trim()) {
      toast.error('Switch name cannot be empty');
      return;
    }

    try {
      addSwitch(
        newSwitchName.trim(),
        newSwitchDescription.trim(),
        newSwitchValue
      );

      // Reset form
      setNewSwitchName('');
      setNewSwitchDescription('');
      setNewSwitchValue(false);

      // Refresh the list
      refreshSwitches();

      toast.success('Switch added successfully');
    } catch (error) {
      toast.error(
        `Failed to add switch: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleUpdateSwitch = (
    id: string,
    data: { name: string; description: string; initialValue: boolean }
  ) => {
    try {
      updateSwitch(id, data);

      // Refresh the list
      refreshSwitches();

      toast.success('Switch updated successfully');
    } catch (error) {
      toast.error(
        `Failed to update switch: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleDeleteSwitch = (id: string) => {
    // Éviter d'utiliser window.confirm qui peut causer des problèmes de focus
    try {
      // Créer un élément temporaire pour conserver le focus
      const tempInput = document.createElement('input');
      document.body.appendChild(tempInput);
      tempInput.focus();

      // Supprimer l'élément et rafraîchir
      deleteSwitch(id);
      refreshSwitches();

      // Nettoyer l'élément temporaire
      document.body.removeChild(tempInput);

      toast.success('Switch deleted successfully');
    } catch (error) {
      toast.error(
        `Failed to delete switch: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleToggleValue = (id: string, currentValue: boolean) => {
    try {
      updateSwitch(id, { initialValue: !currentValue });
      refreshSwitches();
    } catch (error) {
      toast.error(
        `Failed to toggle switch value: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const filteredSwitches = getFilteredSwitches();

  return (
    <div id="switches-content" className="p-4 md:p-6 pb-12 scrollbar-ace">
      <div className="container-ace space-y-6">
        <SwitchesHeader />

        <SwitchesFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showOnlyTrue={showOnlyTrue}
          setShowOnlyTrue={setShowOnlyTrue}
          showOnlyFalse={showOnlyFalse}
          setShowOnlyFalse={setShowOnlyFalse}
        />

        <NewSwitchForm
          newSwitchName={newSwitchName}
          setNewSwitchName={setNewSwitchName}
          newSwitchDescription={newSwitchDescription}
          setNewSwitchDescription={setNewSwitchDescription}
          newSwitchValue={newSwitchValue}
          setNewSwitchValue={setNewSwitchValue}
          onAddSwitch={handleAddSwitch}
        />

        <SwitchesList
          switches={filteredSwitches}
          totalSwitches={switches.length}
          onUpdate={handleUpdateSwitch}
          onDelete={handleConfirmDelete}
          onToggleValue={handleToggleValue}
        />

        <InfoCard />
      </div>
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        message="Are you sure you want to delete this switch? This action cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </div>
  );
}
