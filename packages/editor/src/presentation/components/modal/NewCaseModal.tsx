// packages\editor\src\presentation\components\modal\NewCaseModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

import { useCreateLevel } from '@/application/useCases/level/useCreateLevel';

// Validation schema
const newCaseSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(50, 'Le titre ne peut pas dépasser 50 caractères'),
  author: z
    .string()
    .min(2, 'Veuillez indiquer un auteur')
    .max(30, "Le nom d'auteur ne peut pas dépasser 30 caractères"),
  description: z
    .string()
    .max(200, 'La description ne peut pas dépasser 200 caractères')
    .optional(),
});

type NewCaseFormData = z.infer<typeof newCaseSchema>;

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewCaseModal({ isOpen, onClose }: NewCaseModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utiliser le hook personnalisé
  const { createNewCase } = useCreateLevel();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCaseFormData>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      title: '',
      author: '',
      description: '',
    },
  });

  const onSubmit = async (data: NewCaseFormData) => {
    try {
      setIsCreating(true);
      setError(null);

      // Utiliser createNewCase du hook
      await createNewCase({
        title: data.title,
        author: data.author,
        description: data.description || '',
      });

      // Fermer la modale après succès
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while creating the case'
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="w-full max-w-md bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-blue-700 rounded-lg shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 p-4 flex justify-between items-center border-b-2 border-blue-700">
          <h2 className="text-xl font-bold text-white">NEW CASE</h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-blue-200 font-bold mb-2">
              Case Title
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-4 py-2 bg-blue-950 border-2 border-blue-700 rounded text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="ex: Turnabout Sisters"
            />
            {errors.title && (
              <p className="mt-1 text-red-400 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Auteur */}
          <div>
            <label className="block text-blue-200 font-bold mb-2">Author</label>
            <input
              {...register('author')}
              type="text"
              className="w-full px-4 py-2 bg-blue-950 border-2 border-blue-700 rounded text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Votre nom"
            />
            {errors.author && (
              <p className="mt-1 text-red-400 text-sm">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-blue-200 font-bold mb-2">
              Description (optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2 bg-blue-950 border-2 border-blue-700 rounded text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Description courte du cas..."
            />
            {errors.description && (
              <p className="mt-1 text-red-400 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-3 bg-red-900/60 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold transition-colors"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-bold transition-colors flex items-center"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating case...
                </>
              ) : (
                'Create Case'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
