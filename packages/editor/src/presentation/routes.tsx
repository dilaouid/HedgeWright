import { lazy, Suspense } from 'react';
import { useLocation } from '@/presentation/hooks/navigation/useLocation';

// Lazy-loaded pages
const HomePage = lazy(() => import('@ui/pages/home'));
const EditorPage = lazy(() => import('@ui/pages/editor'));
const SceneEditPage = lazy(() => import('@ui/pages/scenes/editor'));
const SettingsPage = lazy(() => import('@ui/pages/settings'));
const NotFoundPage = lazy(() => import('@ui/pages/404'));

// Routes mapping
const routes = {
  '/': HomePage,
  '/editor': EditorPage,
  '/editor/:projectId': EditorPage,
  '/scenes/editor': SceneEditPage,
  '/scenes/editor/:sceneId': SceneEditPage,
  '/settings': SettingsPage,
};

// Simple pattern matching for parameters
const matchRoute = (pattern: string, path: string) => {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      // Parameter pattern
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      // Static part doesn't match
      return null;
    }
  }

  return params;
};

export const Router = () => {
  const { pathname } = useLocation();

  // Find matching route
  for (const [pattern, Component] of Object.entries(routes)) {
    const params = matchRoute(pattern, pathname);
    if (params !== null) {
      return (
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Component params={params} />
        </Suspense>
      );
    }
  }

  // No route found
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <NotFoundPage />
    </Suspense>
  );
};
