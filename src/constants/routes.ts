/**
 * Centralized route constants.
 * Use these instead of hardcoded path strings throughout the app.
 */
export const ROUTES = {
  // Public
  HOME: '/',
  CHOICE: '/choice',

  // Child Auth
  CHILD_LOGIN: '/child-login',
  CHILD_SIGNUP: '/child-signup',

  // Parent Auth
  PARENT_LOGIN: '/parent-login',
  PARENT_SIGNUP: '/parent-signup',

  // Doctor Auth
  DOCTOR_LOGIN: '/doctor-login',
  DOCTOR_SIGNUP: '/doctor-signup',

  // Child Pages
  CHILD_HOME: '/child-home',
  PECS: '/pecs',
  EMOTIONS: '/emotions',
  ROUTINE: '/routine',

  PROFILE: '/profile',

  // Games
  GAMES: '/games',
  GAMES_PUZZLE: '/games/puzzle',
  GAMES_WORDS: '/games/words',
  GAMES_DRAWING: '/games/drawing',
  GAMES_PIANO: '/games/piano',

  // Parent
  PARENT_DASHBOARD: '/parent-dashboard',
  PARENT_PROFILE: '/parent-dashboard/profile',

  // Doctor
  DOCTOR_DASHBOARD: '/doctor-dashboard',
  DOCTOR_PROFILE: '/doctor-dashboard/profile',

  // Misc
  SETTINGS: '/settings',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
