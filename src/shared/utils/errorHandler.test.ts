import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './errorHandler';

describe('errorHandler', () => {
    it('returns the correct Arabic message for Firebase auth/invalid-credential', () => {
        const error = { code: 'auth/invalid-credential' };
        const message = getErrorMessage(error, true);
        expect(message).toBe('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    });

    it('returns the correct English message for Firebase auth/invalid-credential', () => {
        const error = { code: 'auth/invalid-credential' };
        const message = getErrorMessage(error, false);
        expect(message).toBe('Invalid email or password');
    });

    it('returns the correct Arabic message for email_exists string error', () => {
        const error = 'email_exists';
        const message = getErrorMessage(error, true);
        expect(message).toBe('هذا البريد الإلكتروني مسجل بالفعل');
    });

    it('returns generic error message when error is unknown (English)', () => {
        const error = 'some_random_error';
        const message = getErrorMessage(error, false);
        expect(message).toBe('An error occurred. Please try again.');
    });

    it('returns generic error message when error is unknown (Arabic)', () => {
        const error = new Error('Unknown stuff');
        const message = getErrorMessage(error, true);
        expect(message).toBe('حدث خطأ. يرجى المحاولة مرة أخرى.');
    });
});
