/**
 * Shared application types.
 * Types used across multiple features live here.
 * Feature-specific types should live in their own feature/types/ folder.
 */

// ──────────────────────────────────────────────────
// User Types
// ──────────────────────────────────────────────────

export type UserRole = 'child' | 'parent' | 'doctor';

export interface BaseUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
}

export interface ChildUser extends BaseUser {
  role: 'child';
  age: number;
  gender: string;
  phone: string;
  childId: string; // Unique linkable ID for parents
  routineHistory?: Record<string, boolean[]>;
  emotionHistory?: Record<string, string>;
}

export interface ParentUser extends BaseUser {
  role: 'parent';
  phone: string;
  childId?: string; // Primary linked child
  childIds?: string[]; // Multiple linked children
}

export interface DoctorUser extends BaseUser {
  role: 'doctor';
  phone: string;
  specialty?: string;
  clinicName?: string;
}

export type AppUser = ChildUser | ParentUser | DoctorUser;

// ──────────────────────────────────────────────────
// API / Firebase Response Types
// ──────────────────────────────────────────────────

export interface ApiResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResult {
  success: boolean;
  error?: 'not_found' | 'wrong_password' | 'email_exists' | 'role_mismatch' | 'unknown';
  childId?: string;
  childName?: string;
}

// ──────────────────────────────────────────────────
// UI State Types
// ──────────────────────────────────────────────────

/** Represents the possible states of an async operation in the UI */
export type AsyncState = 'idle' | 'loading' | 'error' | 'empty' | 'success';

/** Props for components that need to handle all async states */
export interface AsyncStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

// ──────────────────────────────────────────────────
// App Context Types
// ──────────────────────────────────────────────────

export interface AppContextValue {
  isDark: boolean;
  isArabic: boolean;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

// ──────────────────────────────────────────────────
// Emotion & Routine Types
// ──────────────────────────────────────────────────

export interface EmotionEntry {
  emoji: string;
  label: string;
  timestamp: string;
}

export interface RoutineTask {
  id: string;
  label: string;
  labelAr?: string;
  icon?: string;
  completed: boolean;
}

// ──────────────────────────────────────────────────
// Game Types
// ──────────────────────────────────────────────────

export interface GameConfig {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  route: string;
  color: string;
}

export interface GameStats {
  totalPlayed: number;
  totalWins: number;
  lastPlayed?: string;
}
