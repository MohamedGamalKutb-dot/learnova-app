/**
 * Centralized error handling utilities.
 * 
 * Normalizes Firebase and network errors into user-friendly messages.
 * Supports both English and Arabic error messages.
 */

// ──────────────────────────────────────────────────
// Error Types
// ──────────────────────────────────────────────────

export interface AppError {
  code: string;
  message: string;
  messageAr: string;
  originalError?: unknown;
}

// ──────────────────────────────────────────────────
// Firebase Auth Error Map
// ──────────────────────────────────────────────────

const FIREBASE_AUTH_ERRORS: Record<string, { en: string; ar: string }> = {
  'auth/user-not-found': {
    en: 'No account found with this email',
    ar: 'لا يوجد حساب بهذا البريد الإلكتروني',
  },
  'auth/wrong-password': {
    en: 'Incorrect password',
    ar: 'كلمة المرور غير صحيحة',
  },
  'auth/invalid-credential': {
    en: 'Invalid email or password',
    ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },
  'auth/email-already-in-use': {
    en: 'This email is already registered',
    ar: 'هذا البريد الإلكتروني مسجل بالفعل',
  },
  'auth/weak-password': {
    en: 'Password must be at least 6 characters',
    ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
  },
  'auth/invalid-email': {
    en: 'Please enter a valid email address',
    ar: 'أدخل بريداً إلكترونياً صحيحاً',
  },
  'auth/too-many-requests': {
    en: 'Too many attempts. Please try again later',
    ar: 'محاولات كثيرة جداً. حاول مرة أخرى لاحقاً',
  },
  'auth/network-request-failed': {
    en: 'Network error. Check your internet connection',
    ar: 'خطأ في الشبكة. تحقق من اتصالك بالإنترنت',
  },
  'auth/popup-closed-by-user': {
    en: 'Sign-in cancelled',
    ar: 'تم إلغاء تسجيل الدخول',
  },
  'auth/account-exists-with-different-credential': {
    en: 'An account already exists with the same email but different sign-in method',
    ar: 'يوجد حساب بنفس البريد ولكن بطريقة تسجيل دخول مختلفة',
  },
};

// ──────────────────────────────────────────────────
// Firestore Error Map
// ──────────────────────────────────────────────────

const FIRESTORE_ERRORS: Record<string, { en: string; ar: string }> = {
  'permission-denied': {
    en: 'You don\'t have permission to perform this action',
    ar: 'ليس لديك صلاحية للقيام بهذا الإجراء',
  },
  'not-found': {
    en: 'The requested data was not found',
    ar: 'البيانات المطلوبة غير موجودة',
  },
  unavailable: {
    en: 'Service is temporarily unavailable. Please try again',
    ar: 'الخدمة غير متاحة مؤقتاً. حاول مرة أخرى',
  },
};

// ──────────────────────────────────────────────────
// Normalizer Functions
// ──────────────────────────────────────────────────

/**
 * Normalizes any error into a consistent AppError shape.
 * Handles Firebase Auth errors, Firestore errors, and generic JS errors.
 */
export function normalizeError(error: unknown): AppError {
  // Firebase error (has a `code` property)
  if (isFirebaseError(error)) {
    const authMapping = FIREBASE_AUTH_ERRORS[error.code];
    if (authMapping) {
      return {
        code: error.code,
        message: authMapping.en,
        messageAr: authMapping.ar,
        originalError: error,
      };
    }

    const firestoreMapping = FIRESTORE_ERRORS[error.code];
    if (firestoreMapping) {
      return {
        code: error.code,
        message: firestoreMapping.en,
        messageAr: firestoreMapping.ar,
        originalError: error,
      };
    }

    return {
      code: error.code,
      message: error.message || 'An unexpected error occurred',
      messageAr: 'حدث خطأ غير متوقع',
      originalError: error,
    };
  }

  // Standard JS Error
  if (error instanceof Error) {
    return {
      code: 'unknown',
      message: error.message,
      messageAr: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      originalError: error,
    };
  }

  // String error
  if (typeof error === 'string') {
    // Check if it matches a known auth string code
    if (error === 'email_exists') {
      return {
        code: error,
        message: 'This email is already registered',
        messageAr: 'هذا البريد الإلكتروني مسجل بالفعل',
        originalError: error,
      };
    }
    if (error === 'wrong_password') {
      return {
        code: error,
        message: 'Incorrect password',
        messageAr: 'كلمة المرور غير صحيحة',
        originalError: error,
      };
    }
    if (error === 'not_found') {
      return {
        code: error,
        message: 'No account found with this email',
        messageAr: 'لا يوجد حساب بهذا البريد الإلكتروني',
        originalError: error,
      };
    }
    
    return {
      code: 'unknown',
      message: 'An error occurred. Please try again.',
      messageAr: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      originalError: error,
    };
  }

  // Fallback
  return {
    code: 'unknown',
    message: 'An error occurred. Please try again.',
    messageAr: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    originalError: error,
  };
}

/**
 * Returns a user-facing error message based on current language.
 */
export function getErrorMessage(error: unknown, isArabic: boolean): string {
  const normalized = normalizeError(error);
  return isArabic ? normalized.messageAr : normalized.message;
}

// ──────────────────────────────────────────────────
// Type Guards
// ──────────────────────────────────────────────────

interface FirebaseError {
  code: string;
  message: string;
}

function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as FirebaseError).code === 'string'
  );
}
