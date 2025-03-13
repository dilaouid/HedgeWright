/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjectStore } from '../../../../application/state/project/projectStore';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';

interface CharacterStateFormProps {
  state: any | null;
  onSave: (state: any) => void;
  onCancel: () => void;
}

export function CharacterStateForm({
  state,
  onSave,
  onCancel,
}: CharacterStateFormProps) {
  const { currentProject } = useProjectStore();

  const animationPaths = (currentProject?.folders?.img.characters || []).filter(
    (path) => {
      const metadata = currentProject?.assetMetadata?.[path] || {};
      return (
        metadata.spriteType === 'idle' ||
        metadata.spriteType === 'talking' ||
        metadata.spriteType === 'special'
      );
    }
  );

  const soundPaths = currentProject?.folders?.audio.sfx || [];

  const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    idleAnimationId: z.string().nullable(),
    talkingAnimationId: z.string().nullable(),
    specialAnimationId: z.string().nullable(),
    specialSoundId: z.string().nullable(),
    specialSoundDelay: z.number().min(0).default(0),
    metadata: z.record(z.any()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: state?.name || '',
      idleAnimationId: state?.idleAnimationId || null,
      talkingAnimationId: state?.talkingAnimationId || null,
      specialAnimationId: state?.specialAnimationId || null,
      specialSoundId: state?.specialSoundId || null,
      specialSoundDelay: state?.specialSoundDelay || 0,
      metadata: state?.metadata || {},
    },
  });

  // Update form when state changes
  useEffect(() => {
    if (state) {
      form.reset({
        name: state.name || '',
        idleAnimationId: state.idleAnimationId || null,
        talkingAnimationId: state.talkingAnimationId || null,
        specialAnimationId: state.specialAnimationId || null,
        specialSoundId: state.specialSoundId || null,
        specialSoundDelay: state.specialSoundDelay || 0,
        metadata: state.metadata || {},
      });
    } else {
      form.reset({
        name: '',
        idleAnimationId: null,
        talkingAnimationId: null,
        specialAnimationId: null,
        specialSoundId: null,
        specialSoundDelay: 0,
        metadata: {},
      });
    }
  }, [state, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {state ? `Edit State: ${state.name}` : 'Create New State'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Normal, Surprised, Angry"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this character state or expression.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="idleAnimationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idle Animation</FormLabel>
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) =>
                        field.onChange(value === 'null' ? null : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select animation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">No animation</SelectItem>
                        {animationPaths.map((path) => {
                          const metadata =
                            currentProject?.assetMetadata?.[path] || {};
                          const name =
                            metadata.displayName ||
                            path.split('/').pop() ||
                            path;
                          return (
                            <SelectItem key={path} value={path}>
                              {name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="talkingAnimationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Talking Animation</FormLabel>
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) =>
                        field.onChange(value === 'null' ? null : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select animation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">No animation</SelectItem>
                        {animationPaths.map((path) => {
                          const metadata =
                            currentProject?.assetMetadata?.[path] || {};
                          const name =
                            metadata.displayName ||
                            path.split('/').pop() ||
                            path;
                          return (
                            <SelectItem key={path} value={path}>
                              {name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="specialAnimationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Animation</FormLabel>
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) =>
                        field.onChange(value === 'null' ? null : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select animation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">No animation</SelectItem>
                        {animationPaths.map((path) => {
                          const metadata =
                            currentProject?.assetMetadata?.[path] || {};
                          const name =
                            metadata.displayName ||
                            path.split('/').pop() ||
                            path;
                          return (
                            <SelectItem key={path} value={path}>
                              {name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Animation played for special moments (breakdown,
                      introduction, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialSoundId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Sound Effect</FormLabel>
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) =>
                        field.onChange(value === 'null' ? null : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sound effect" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">No sound</SelectItem>
                        {soundPaths.map((path) => {
                          const metadata =
                            currentProject?.assetMetadata?.[path] || {};
                          const name =
                            metadata.displayName ||
                            path.split('/').pop() ||
                            path;
                          return (
                            <SelectItem key={path} value={path}>
                              {name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Sound played with special animation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch('specialSoundId') &&
              form.watch('specialSoundId') !== 'null' && (
                <FormField
                  control={form.control}
                  name="specialSoundDelay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sound Delay (ms)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Delay in milliseconds before playing the sound after
                        animation starts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {state ? 'Save Changes' : 'Create State'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
