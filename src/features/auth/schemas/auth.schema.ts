import { z } from 'zod';
import { APP_CONFIG } from '@/constants/config';

/**
 * Login form validation schema.
 * Used with React Hook Form + Zod resolver.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Child registration form validation schema.
 */
export const childRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name is too long' }),
    age: z
      .string()
      .min(1, { message: 'Age is required' })
      .refine(
        (val) => {
          const num = parseInt(val, 10);
          return num >= APP_CONFIG.CHILD_AGE_MIN && num <= APP_CONFIG.CHILD_AGE_MAX;
        },
        { message: `Age must be between ${APP_CONFIG.CHILD_AGE_MIN} and ${APP_CONFIG.CHILD_AGE_MAX}` }
      ),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email address' }),
    gender: z.enum(['Male', 'Female'], {
      errorMap: () => ({ message: 'Select a gender' }),
    }),
    phone: z
      .string()
      .min(1, { message: 'Phone number is required' }),
    password: z
      .string()
      .min(APP_CONFIG.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${APP_CONFIG.PASSWORD_MIN_LENGTH} characters`,
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChildRegisterFormData = z.infer<typeof childRegisterSchema>;

/**
 * Parent registration form validation schema.
 */
export const parentRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name is too long' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email address' }),
    phone: z
      .string()
      .min(1, { message: 'Phone number is required' }),
    childId: z.string().optional(),
    password: z
      .string()
      .min(APP_CONFIG.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${APP_CONFIG.PASSWORD_MIN_LENGTH} characters`,
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ParentRegisterFormData = z.infer<typeof parentRegisterSchema>;

/**
 * Doctor registration form validation schema.
 */
export const doctorRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name is too long' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email address' }),
    phone: z
      .string()
      .min(1, { message: 'Phone number is required' }),
    specialty: z.string().optional(),
    password: z
      .string()
      .min(APP_CONFIG.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${APP_CONFIG.PASSWORD_MIN_LENGTH} characters`,
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type DoctorRegisterFormData = z.infer<typeof doctorRegisterSchema>;

// ──────────────────────────────────────────────────
// Password Strength Utility
// ──────────────────────────────────────────────────

/**
 * Calculates password strength score (0-5).
 * Used for the visual strength indicator in registration forms.
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}
