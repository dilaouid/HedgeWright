import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useRecentProjects } from '@/application/hooks/project/useRecentProjects';
import { NewCaseModal } from '@/presentation/components/modal/NewCaseModal';
import { FeatureCard } from './components/FeatureCard';

export function HomePage() {
  const { projects, openProject } = useRecentProjects();
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      {/* Banner with logo animation */}
      <div className="relative h-64 overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-[url('/assets/images/ui/courtroom-bg.webp')] bg-cover bg-center opacity-20"></div>
        <div className="z-10 text-center">
          <div className="text-objection mb-4 animate-bounce-once">
            HedgeWright
          </div>
          <h2 className="text-xl font-light mb-8">
            Ace Attorney-Style Level Editor
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project actions */}
          <div className="bg-blue-800/50 border-2 border-blue-700 rounded-lg p-6 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-blue-600 pb-2">
              Create Your Case
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => setIsNewCaseModalOpen(true)}
                className="block w-full bg-red-600 hover:bg-red-700 text-center p-4 rounded font-bold transition-colors"
              >
                NEW CASE
              </button>

              <Link
                to="/"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-center p-4 rounded font-bold transition-colors"
              >
                OPEN CASE
              </Link>
            </div>
          </div>

          {/* Recent projects */}
          <div className="bg-blue-800/50 border-2 border-blue-700 rounded-lg p-6 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-blue-600 pb-2">
              Court Record
            </h2>

            {projects.length > 0 ? (
              <div className="space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => openProject(project.id)}
                    className="w-full text-left bg-blue-900/70 hover:bg-blue-800 p-3 rounded flex items-center border-l-4 border-yellow-500 transition-colors"
                  >
                    <div className="mr-3 bg-blue-700 p-2 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-100"
                      >
                        <path d="M2 7.5V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v2.5"></path>
                        <path d="M2 16.5V19c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-2.5"></path>
                        <rect width="20" height="9" x="2" y="7.5" rx="1"></rect>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">{project.name}</div>
                      <div className="text-blue-200 text-sm">
                        Last opened:{' '}
                        {new Date(project.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-blue-200 italic">
                No recent cases found.
              </div>
            )}
          </div>
        </div>

        {/* Features section */}
        <div className="mt-12 bg-blue-800/30 border border-blue-700/50 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Create Testimony"
              description="Design cross-examinations with contradictions and evidence presentation mechanics."
              icon="⚖️"
            />
            <FeatureCard
              title="Dramatic Effects"
              description="Add text animations, sound effects, and dramatic zoom-ins for maximum impact."
              icon="💥"
            />
            <FeatureCard
              title="Evidence Management"
              description="Organize profiles and evidence for the court record with detailed descriptions."
              icon="🔍"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-950 border-t border-blue-800 p-4 text-center text-blue-300 text-sm">
        <div className="max-w-5xl mx-auto">
          <p className="mb-2">
            HedgeWright Editor v1.0.0 • Not affiliated with Capcom or Ace
            Attorney
          </p>
          <p>
            © 2024 • Made with <span className="text-red-500">♥</span> for
            fans of the series
          </p>
        </div>
      </footer>

      {/* Modal de création de cas */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
      />
    </div>
  );
}
