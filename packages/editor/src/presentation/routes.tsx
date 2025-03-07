import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';

import { HomePage } from './pages/home';
import { EditorPage } from './pages/editor';
/* import { ScenePage } from './pages/scenes';
import { DialoguePage } from './pages/dialogue';
import { CrossExaminationPage } from './pages/crossExamination';
import { EvidencePage } from './pages/evidence';
import { TimelinePage } from './pages/timeline';
import { SettingsPage } from './pages/settings';
import { PreviewPage } from './pages/preview'; */
import { NotFoundPage } from './pages/404';

import { AppLayout } from './components/layout/AppLayout';

// Root route with layout wrapper
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Home page route
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Editor main route
const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor',
  component: EditorPage,
});

// Scene editor route
/* const sceneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scenes',
  component: ScenePage,
});

// Scene editor detail route
const sceneDetailRoute = createRoute({
  getParentRoute: () => sceneRoute,
  path: '$sceneId',
  component: ScenePage,
});

// Dialogue editor route
const dialogueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dialogue',
  component: DialoguePage,
});

// Dialogue detail route
const dialogueDetailRoute = createRoute({
  getParentRoute: () => dialogueRoute,
  path: '$dialogueId',
  component: DialoguePage,
});

// Cross examination editor route
const crossExaminationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cross-examination',
  component: CrossExaminationPage,
});

// Cross examination detail route
const crossExaminationDetailRoute = createRoute({
  getParentRoute: () => crossExaminationRoute,
  path: '$crossExaminationId',
  component: CrossExaminationPage,
});

// Evidence editor route
const evidenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/evidence',
  component: EvidencePage,
});

// Timeline editor route
const timelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timeline',
  component: TimelinePage,
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

// Preview route
const previewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/preview',
  component: PreviewPage,
}); */

// Catch-all 404 route
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

// Create and export the router with all routes
export const router = createRouter({
  routeTree: rootRoute.addChildren([
    homeRoute,
    editorRoute,
    /* sceneRoute.addChildren([sceneDetailRoute]),
    dialogueRoute.addChildren([dialogueDetailRoute]),
    crossExaminationRoute.addChildren([crossExaminationDetailRoute]),
    evidenceRoute,
    timelineRoute,
    settingsRoute,
    previewRoute, */
    notFoundRoute,
  ]),
});

// Type declarations for type safety across the app
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
