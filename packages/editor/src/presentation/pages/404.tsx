import React from 'react';
import { useNavigate } from '@tanstack/react-router';

/**
 * NotFoundPage component for 404 errors
 * Displays a custom 404 page with Ace Attorney-style theming
 */
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col items-center max-w-2xl text-center">
        <h1 className="text-6xl font-bold mb-4 text-red-500">OBJECTION!</h1>
        
        <div className="mb-6">
          <h2 className="text-4xl font-semibold mb-2">Error 404</h2>
          <p className="text-xl">The evidence you're looking for is nowhere to be found!</p>
        </div>
        
        <div className="mb-8 p-6 bg-gray-800 rounded-lg border-2 border-blue-500">
          <p className="mb-4">
            The court record shows no evidence of the page you're trying to access.
            The defense must have made an error in their investigation.
          </p>
          <p>
            Perhaps you'd like to return to the editor and continue your investigation?
          </p>
        </div>
        
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Editor
        </button>
      </div>
    </div>
  );
};