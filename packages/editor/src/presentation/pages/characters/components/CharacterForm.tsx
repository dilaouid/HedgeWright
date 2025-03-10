// packages\editor\src\presentation\pages\characters\components\CharacterForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { CharacterStatesList } from './CharacterStatesList';
import { CharacterStateForm } from './CharacterStateForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface CharacterFormProps {
  character: any | null;
  profiles: any[];
  onSave: (character: any) => void;
  onCancel: () => void;
}

export function CharacterForm({ character, profiles, onSave, onCancel }: CharacterFormProps) {
  const [activeTab, setActiveTab] = React.useState('general');
  const [selectedStateId, setSelectedStateId] = React.useState<string | null>(null);
  const [isCreatingState, setIsCreatingState] = React.useState(false);

  const formSchema = z.object({
    customId: z.string().min(1, { message: "Custom ID is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    profileId: z.string().nullable(),
    metadata: z.record(z.any()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customId: character?.customId || '',
      name: character?.name || '',
      profileId: character?.profileId || null,
      metadata: character?.metadata || {},
    },
  });

  // Update form when character changes
  useEffect(() => {
    if (character) {
      form.reset({
        customId: character.customId || '',
        name: character.name || '',
        profileId: character.profileId || null,
        metadata: character.metadata || {},
      });
    } else {
      form.reset({
        customId: '',
        name: '',
        profileId: null,
        metadata: {},
      });
    }
  }, [character, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const characterData = {
      ...values,
      states: character?.states || []
    };
    onSave(characterData);
  };

  const handleAddState = () => {
    setSelectedStateId(null);
    setIsCreatingState(true);
    setActiveTab('states');
  };

  const handleSelectState = (id: string) => {
    setSelectedStateId(id);
    setIsCreatingState(false);
    setActiveTab('states');
  };

  const handleSaveState = (state: any) => {
    if (!character) return;

    const updatedStates = [...(character.states || [])];
    
    if (isCreatingState) {
      // Add new state
      const newState = {
        id: crypto.randomUUID(),
        characterId: character.id,
        ...state
      };
      updatedStates.push(newState);
      setSelectedStateId(newState.id);
      setIsCreatingState(false);
    } else if (selectedStateId) {
      // Update existing state
      const index = updatedStates.findIndex(s => s.id === selectedStateId);
      if (index !== -1) {
        updatedStates[index] = {
          ...updatedStates[index],
          ...state
        };
      }
    }

    const updatedCharacter = {
      ...character,
      states: updatedStates
    };
    
    onSave(updatedCharacter);
  };

  const handleDeleteState = (id: string) => {
    if (!character) return;

    const updatedStates = character.states.filter((s: any) => s.id !== id);
    
    const updatedCharacter = {
      ...character,
      states: updatedStates
    };
    
    if (selectedStateId === id) {
      setSelectedStateId(null);
    }
    
    onSave(updatedCharacter);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {character ? `Edit Character: ${character.name}` : "Create New Character"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger 
              value="states" 
              disabled={!character}
            >
              Character States
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Phoenix Wright" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. phoenix" {...field} />
                        </FormControl>
                        <FormDescription>
                          A unique identifier used in scripting.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="profileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated Profile</FormLabel>
                      <Select 
                        value={field.value || undefined} 
                        onValueChange={(value) => field.onChange(value || null)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a profile" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="null">No profile</SelectItem>
                          {profiles.map((profile) => (
                            <SelectItem key={profile.id} value={profile.id}>
                              {profile.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Optionally link this character to a profile in the court record.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {character ? "Save" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="states">
            {character && (
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 border-r pr-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">States</h3>
                    <Button 
                      size="sm" 
                      onClick={handleAddState}
                      variant="outline"
                    >
                      Add State
                    </Button>
                  </div>
                  
                  <CharacterStatesList
                    states={character.states || []}
                    selectedId={selectedStateId}
                    onSelect={handleSelectState}
                    onDelete={handleDeleteState}
                  />
                </div>
                
                <div className="col-span-2">
                  {(selectedStateId || isCreatingState) ? (
                    <CharacterStateForm
                      state={isCreatingState ? null : character.states?.find((s: any) => s.id === selectedStateId)}
                      onSave={handleSaveState}
                      onCancel={() => {
                        setIsCreatingState(false);
                        if (isCreatingState) setSelectedStateId(null);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-6">
                        <h3 className="text-lg font-medium mb-2">No State Selected</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          Select a state or create a new one
                        </p>
                        <Button onClick={handleAddState}>
                          Create First State
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}