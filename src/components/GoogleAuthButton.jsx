import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, Input, useDisclosure } from '@heroui/react';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

export default function GoogleAuthButton({ role, mode, onSuccess, text }) {
    const { isArabic, isDark } = useApp();
    const { loginChild, loginParent, loginDoctor, registerChild, registerParent, registerDoctor, getChildById } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [childId, setChildId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        setError(''); setEmail(''); setPassword(''); setChildId(''); setStep(1); onOpen();
    };

    const handleClose = () => {
        setStep(0); onClose();
    };

    const handleSubmit = () => {
        setError('');
        setLoading(true);

        setTimeout(() => {
            if (step === 1) {
                if (!email.trim() || !email.includes('@')) {
                    setError(isArabic ? 'أدخل إيميل جوجل صحيح' : 'Enter a valid Google email');
                    setLoading(false);
                    return;
                }
                setStep(2);
                setLoading(false);
                return;
            }

            if (step === 2) {
                if (!password || password.length < 6) {
                    setError(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                
                if (mode === 'login') {
                    let result;
                    if (role === 'child') result = loginChild(email.trim(), password);
                    else if (role === 'parent') result = loginParent(email.trim(), password);
                    else if (role === 'doctor') result = loginDoctor(email.trim(), password);

                    if (result?.success) {
                        handleClose();
                        if (onSuccess) onSuccess(result);
                    } else {
                        setError(isArabic ? 'بيانات الدخول غير صحيحة أو الحساب غير موجود' : 'Invalid credentials or account not found');
                    }
                    setLoading(false);
                    return;
                }

                // Signup mode
                let result;
                if (role === 'child') {
                    result = registerChild({ name: nameFromEmail, age: 8, email: email.trim(), password: password, gender: 'Male', avatar: '👦' });
                } else if (role === 'parent') {
                    if (!childId.trim()) {
                        setError(isArabic ? 'أدخل كود الطفل (LN-XXXXXX)' : 'Enter child code (LN-XXXXXX)');
                        setLoading(false);
                        return;
                    }
                    const childObj = getChildById(childId.trim());
                    if (!childObj) {
                        setError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found');
                        setLoading(false);
                        return;
                    }
                    result = registerParent({ name: nameFromEmail, email: email.trim(), password: password, phone: '', childId: childId.trim() });
                } else if (role === 'doctor') {
                    result = registerDoctor({ name: nameFromEmail, email: email.trim(), password: password, phone: '', age: '', gender: 'Male' });
                }

                if (result?.success) {
                    handleClose();
                    if (onSuccess) onSuccess(result);
                } else {
                    setError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
                }
                setLoading(false);
            }
        }, 800);
    };

    const btnText = text || (isArabic ? 'الدخول بجوجل' : 'Sign in with Google');

    return (
        <>
            <Button 
                fullWidth 
                variant="bordered" 
                startContent={<GoogleIcon />} 
                onPress={handleOpen} 
                className={`h-[46px] font-bold ${isDark ? 'border-border-dark text-text-dark bg-transparent hover:bg-white/[0.05]' : 'border-border text-text bg-white hover:bg-gray-50'}`}
            >
                {btnText}
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} size="sm" placement="center" backdrop="blur">
                <ModalContent className={`${isDark ? 'bg-bg-dark border border-border-dark text-text-dark' : 'bg-white text-text'}`}>
                    <ModalHeader className={`border-b ${isDark ? 'border-border-dark' : 'border-gray-200'} flex flex-col items-center py-8`}>
                        <GoogleIcon />
                        <h2 className="mt-4 text-xl font-bold">
                            {step === 1 ? (isArabic ? 'جوجل' : 'Google') : (isArabic ? 'مرحباً' : 'Welcome')}
                        </h2>
                    </ModalHeader>
                    <ModalBody className="p-8">
                        {step === 1 ? (
                            <Input 
                                autoFocus 
                                label={isArabic ? "البريد الإلكتروني" : "Email"} 
                                variant="bordered" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                                classNames={{ inputWrapper: isDark ? 'border-border-dark' : 'border-border' }}
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className={`p-3 rounded-lg flex items-center gap-3 text-left ${isDark ? 'bg-card-dark' : 'bg-gray-50'}`} dir="ltr">
                                    <GoogleIcon />
                                    <div>
                                        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{email.split('@')[0]}</p>
                                        <p className="text-xs text-gray-500">{email}</p>
                                    </div>
                                </div>
                                <Input 
                                    autoFocus 
                                    label={isArabic ? "كلمة المرور" : "Password"} 
                                    type="password" 
                                    variant="bordered" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                                    classNames={{ inputWrapper: isDark ? 'border-border-dark' : 'border-border' }}
                                />
                                {mode === 'signup' && role === 'parent' && (
                                    <Input 
                                        label={isArabic ? "كود الطفل (LN-XXXXXX)" : "Child Code (LN-XXXXXX)"} 
                                        variant="bordered" 
                                        value={childId} 
                                        onChange={e => setChildId(e.target.value.toUpperCase())} 
                                        classNames={{ inputWrapper: isDark ? 'border-border-dark' : 'border-border' }}
                                    />
                                )}
                            </div>
                        )}
                        {error && <p className="text-red-500 text-xs mt-3">⚠️ {error}</p>}
                        <Button fullWidth isLoading={loading} className="mt-6 bg-[#4285F4] text-white font-bold h-12" onPress={handleSubmit}>
                            {step === 1 ? (isArabic ? 'التالي' : 'Next') : (isArabic ? 'تسجيل الدخول' : 'Sign In')}
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
