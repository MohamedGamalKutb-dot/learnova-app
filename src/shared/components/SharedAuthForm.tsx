import { useState } from 'react';
import { Input, Button } from '@heroui/react';
import { useApp } from '../context/AppContext';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface SharedAuthFormProps {
    isLogin: boolean;
    role: 'child' | 'parent' | 'doctor';
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue?: UseFormSetValue<any>;
    watch?: UseFormWatch<any>;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    buttonText: string;
    buttonColorClass: string;
    strengthColors?: string[];
    getPasswordStrength?: (password: string) => number;
}

export default function SharedAuthForm({
    isLogin,
    role,
    register,
    errors,
    setValue,
    watch,
    onSubmit,
    loading,
    buttonText,
    buttonColorClass,
    strengthColors,
    getPasswordStrength
}: SharedAuthFormProps) {
    const { isDark, isArabic } = useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const inputWrapperCls = `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`;

    const passwordValue = watch ? watch('password') : '';
    const genderValue = watch ? watch('gender') : '';

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3.5" noValidate>
            {!isLogin && (
                <>
                    <Input 
                        label={`${isArabic ? 'الاسم الكامل' : 'Full Name'} *`} 
                        {...register('name')} 
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message as string}
                        variant="bordered" radius="lg"
                        placeholder={isArabic ? 'أدخل الاسم' : 'Enter name'} 
                        classNames={{ inputWrapper: inputWrapperCls }} 
                    />

                    <div className="flex gap-2.5">
                        <Input 
                            label={`${isArabic ? 'رقم الهاتف' : 'Phone Number'} *`} 
                            type="tel" 
                            {...register('phone')} 
                            isInvalid={!!errors.phone}
                            errorMessage={errors.phone?.message as string}
                            variant="bordered" radius="lg"
                            placeholder="01x xxxx xxxx" 
                            className="flex-[2]" classNames={{ inputWrapper: inputWrapperCls }} 
                        />
                        
                        {role === 'child' && (
                            <Input 
                                label={isArabic ? 'العمر' : 'Age'} 
                                type="number" 
                                {...register('age')} 
                                isInvalid={!!errors.age}
                                errorMessage={errors.age?.message as string}
                                variant="bordered" radius="lg"
                                className="flex-[1]"
                                classNames={{ inputWrapper: inputWrapperCls }} 
                            />
                        )}
                    </div>

                    {role === 'child' && setValue && (
                        <div>
                            <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'الجنس' : 'Gender'}</label>
                            <div className="flex gap-2.5">
                                {[{ val: 'Male', label: isArabic ? 'ذكر' : 'Male', emoji: '👨' }, { val: 'Female', label: isArabic ? 'أنثى' : 'Female', emoji: '👩' }].map(g => (
                                    <Button key={g.val} type="button" variant={genderValue === g.val ? 'solid' : 'bordered'} radius="lg"
                                        className={`flex-1 font-semibold text-[13px] ${genderValue === g.val ? 'bg-accent/[0.06] border-accent text-accent border-[1.5px]' : `${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`}`}
                                        onPress={() => setValue('gender', g.val, { shouldValidate: true })}>
                                        <span>{g.emoji}</span> {g.label}
                                    </Button>
                                ))}
                            </div>
                            {errors.gender && <span className="text-danger text-xs mt-1">{errors.gender.message as string}</span>}
                        </div>
                    )}

                    {role === 'doctor' && (
                        <Input 
                            label={`${isArabic ? 'التخصص (اختياري)' : 'Specialty (Optional)'}`} 
                            {...register('specialty')} 
                            isInvalid={!!errors.specialty}
                            errorMessage={errors.specialty?.message as string}
                            variant="bordered" radius="lg"
                            placeholder={isArabic ? 'مثال: أخصائي تخاطب' : 'e.g. Speech Therapist'} 
                            classNames={{ inputWrapper: inputWrapperCls }} 
                        />
                    )}
                </>
            )}

            <Input 
                label={`${isArabic ? 'البريد الإلكتروني' : 'Email Address'} *`} 
                type="email" 
                {...register('email')} 
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message as string}
                variant="bordered" radius="lg"
                placeholder="example@email.com" 
                classNames={{ inputWrapper: inputWrapperCls }} 
            />

            <Input 
                label={`${isArabic ? 'كلمة المرور' : 'Password'} *`} 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')} 
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message as string}
                variant="bordered" radius="lg"
                placeholder="••••••••" 
                classNames={{ inputWrapper: inputWrapperCls }}
                endContent={<button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none cursor-pointer text-lg">{showPassword ? '🙈' : '👁️'}</button>} 
            />
            
            {!isLogin && passwordValue && strengthColors && getPasswordStrength && (
                <div className="flex gap-1 mt-[-8px]">{[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-sm transition-all duration-300"
                        style={{ background: i < getPasswordStrength(passwordValue) ? strengthColors[getPasswordStrength(passwordValue) - 1] : (isDark ? '#21262D' : '#E5E7EB') }} />
                ))}</div>
            )}

            {!isLogin && (
                <Input 
                    label={`${isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} *`} 
                    type={showConfirm ? 'text' : 'password'} 
                    {...register('confirmPassword')} 
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message as string}
                    variant="bordered" radius="lg"
                    placeholder="••••••••" 
                    classNames={{ inputWrapper: inputWrapperCls }}
                    endContent={<button type="button" onClick={() => setShowConfirm(!showConfirm)} className="bg-transparent border-none cursor-pointer text-lg">{showConfirm ? '🙈' : '👁️'}</button>}
                />
            )}

            <Button type="submit" fullWidth radius="lg" isLoading={loading}
                className={`${buttonColorClass} text-white font-bold text-base mt-2 hover:-translate-y-0.5`}>
                {loading ? (isArabic ? '⏳ جاري التحميل...' : '⏳ Loading...') : buttonText}
            </Button>
        </form>
    );
}
