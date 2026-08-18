/**
 * Application-wide configuration constants.
 * Environment variables, limits, and static config.
 */
export const APP_CONFIG = {
  APP_NAME: 'LearnNeur',
  APP_NAME_AR: 'ليرنوفا',

  // Firebase collection paths
  COLLECTIONS: {
    USERS: 'users',
    SYSTEM: 'system',
    APP_DATA: 'appData',
    CHILD_PROGRESS: 'child_progress',
    CONVERSATIONS: 'conversations',
  },

  // Age limits for child registration
  CHILD_AGE_MIN: 2,
  CHILD_AGE_MAX: 18,

  // Password requirements
  PASSWORD_MIN_LENGTH: 6,

  // Toast durations (ms)
  TOAST_DURATION: 4000,
  TOAST_LONG_DURATION: 10000,

  // TanStack Query defaults
  QUERY_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  QUERY_CACHE_TIME: 30 * 60 * 1000, // 30 minutes

  // User roles
  ROLES: {
    CHILD: 'child',
    PARENT: 'parent',
    DOCTOR: 'doctor',
  } as const,

  // Local storage keys
  STORAGE_KEYS: {
    DARK_MODE: 'learnova_dark',
    LANGUAGE: 'learnova_arabic',
  },
} as const;

export type UserRole = typeof APP_CONFIG.ROLES[keyof typeof APP_CONFIG.ROLES];
