import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button } from '@heroui/react';
import { auth, googleProvider } from '@/shared/firebase/config';
import { signInWithPopup } from 'firebase/auth';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

interface GoogleAuthButtonProps {
    role: 'child' | 'parent' | 'doctor';
    mode: 'login' | 'signup';
    onSuccess?: (res: any) => void;
    text?: string;
}

export default function GoogleAuthButton({ role, mode, onSuccess, text }: GoogleAuthButtonProps) {
    const { isArabic, isDark } = useApp();
    const { loginChild, loginParent, loginDoctor, registerChild, registerParent, registerDoctor } = useAuth();
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const email = user.email!;
            const name = user.displayName || email.split('@')[0];
            const uid = user.uid;

            if (mode === 'login') {
                let res: any;
                if (role === 'child') res = await loginChild(email, uid, true);
                else if (role === 'parent') res = await loginParent(email, uid, true);
                else if (role === 'doctor') res = await loginDoctor(email, uid, true);

                if (res?.success) {
                    if (onSuccess) onSuccess(res);
                } else {
                    setError(isArabic ? 'الحساب غير موجود! حاول إنشاء حساب جديد.' : 'Account not found! Try signing up.');
                }
            } else if (mode === 'signup') {
                let res: any;
                if (role === 'child') {
                    res = await registerChild({ name, age: 8, email, password: uid, gender: 'Male', avatar: '👦' });
                } else if (role === 'parent') {
                    res = await registerParent({ name, email, password: uid, phone: '' });
                } else if (role === 'doctor') {
                    res = await registerDoctor({ name, email, password: uid, phone: '', age: '', gender: 'Male' });
                }
                
                if (res?.success) {
                    if (onSuccess) onSuccess(res);
                } else {
                    setError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(isArabic ? 'فشل تسجيل الدخول عبر جوجل' : 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const btnText = text || (isArabic ? 'الدخول بجوجل' : 'Sign in with Google');

    return (
        <>
            <Button 
                fullWidth 
                variant="bordered" 
                startContent={!loading && <GoogleIcon />} 
                onPress={handleGoogleSignIn} 
                isLoading={loading}
                className={`h-[46px] font-bold ${isDark ? 'border-border-dark text-text-dark bg-transparent hover:bg-white/[0.05]' : 'border-border text-text bg-white hover:bg-gray-50'}`}
            >
                {btnText}
            </Button>
            {error && <p className="text-red-500 text-xs mt-3 text-center">⚠️ {error}</p>}
        </>
    );
}
