/**
 * TanStack Query key factories for consistent cache management.
 * 
 * Each feature has a key factory that produces hierarchical keys.
 * This ensures safe invalidation and prevents key collisions.
 * 
 * Usage:
 *   queryKey: queryKeys.auth.currentUser()
 *   queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // App-wide global data (Firebase system/appData)
  globalData: {
    all: ['globalData'] as const,
    appData: () => [...queryKeys.globalData.all, 'appData'] as const,
  },

  // Child progress & data
  childData: {
    all: ['childData'] as const,
    progress: (childId: string) => [...queryKeys.childData.all, 'progress', childId] as const,
    routine: (childId: string) => [...queryKeys.childData.all, 'routine', childId] as const,
    emotions: (childId: string) => [...queryKeys.childData.all, 'emotions', childId] as const,
    notes: (childId: string) => [...queryKeys.childData.all, 'notes', childId] as const,
  },

  // Games
  games: {
    all: ['games'] as const,
    config: () => [...queryKeys.games.all, 'config'] as const,
    stats: (childId: string) => [...queryKeys.games.all, 'stats', childId] as const,
    words: () => [...queryKeys.games.all, 'words'] as const,
    puzzles: () => [...queryKeys.games.all, 'puzzles'] as const,
  },

  // Parent dashboard
  parent: {
    all: ['parent'] as const,
    children: (parentId: string) => [...queryKeys.parent.all, 'children', parentId] as const,
    childProgress: (childId: string) => [...queryKeys.parent.all, 'childProgress', childId] as const,
  },

  // Doctor dashboard
  doctor: {
    all: ['doctor'] as const,
    patients: (doctorId: string) => [...queryKeys.doctor.all, 'patients', doctorId] as const,
    patientDetail: (patientId: string) => [...queryKeys.doctor.all, 'patient', patientId] as const,
  },

  // AI conversations
  conversations: {
    all: ['conversations'] as const,
    list: (userId: string) => [...queryKeys.conversations.all, 'list', userId] as const,
    detail: (conversationId: string) => [...queryKeys.conversations.all, 'detail', conversationId] as const,
  },
} as const;
