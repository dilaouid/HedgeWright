import React from 'react';

interface SceneEditPageProps {
  params?: Record<string, string>;
}

const SceneEditPage: React.FC<SceneEditPageProps> = ({ params }) => {
  const sceneId = params?.sceneId || 'nouvelle scène';

  return (
    <div className="min-h-screen bg-[#1F1E36] p-4">
      <h1 className="text-2xl font-bold text-[#F0B27A] mb-4">Éditeur de Scène</h1>
      <p className="text-white">Édition de la scène: {sceneId}</p>
    </div>
  );
};

export default SceneEditPage;
