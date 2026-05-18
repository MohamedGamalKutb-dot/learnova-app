import { useState } from 'react';
import { Input, Button } from '@heroui/react';
import { useApp } from '../../context/AppContext';

export default function SharedAuthForm({
    isLogin,
    formData,
    handleChange,
    setFormData,
    handleSubmit,
    loading,
    buttonText,
    buttonColorClass,
    strengthColors,
    getPasswordStrength
}) {
    const { isDark, isArabic } = useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const inputWrapperCls = `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {!isLogin && (
                <>
                    <Input label={`${isArabic ? 'الاسم الكامل' : 'Full Name'} *`} name="name" variant="bordered" radius="lg"
                        value={formData.name || ''} onChange={handleChange} placeholder={isArabic ? 'أدخل الاسم' : 'Enter name'} isRequired
                        classNames={{ inputWrapper: inputWrapperCls }} />

                    <div className="flex gap-2.5">
                        <Input label={`${isArabic ? 'رقم الهاتف' : 'Phone Number'} *`} name="phone" type="tel" variant="bordered" radius="lg"
                            value={formData.phone || ''} onChange={handleChange} placeholder="01x xxxx xxxx" isRequired
                            className="flex-[2]" classNames={{ inputWrapper: inputWrapperCls }} />
                        
                        {formData.age !== undefined && (
                            <Input label={isArabic ? 'العمر' : 'Age'} name="age" type="number" variant="bordered" radius="lg"
                                value={formData.age || ''} onChange={handleChange} className="flex-[1]"
                                classNames={{ inputWrapper: inputWrapperCls }} />
                        )}
                    </div>

                    <div>
                        <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'الجنس' : 'Gender'}</label>
                        <div className="flex gap-2.5">
                            {[{ val: 'Male', label: isArabic ? 'ذكر' : 'Male', emoji: '👨' }, { val: 'Female', label: isArabic ? 'أنثى' : 'Female', emoji: '👩' }].map(g => (
                                <Button key={g.val} type="button" variant={formData.gender === g.val ? 'solid' : 'bordered'} radius="lg"
                                    className={`flex-1 font-semibold text-[13px] ${formData.gender === g.val ? 'bg-accent/[0.06] border-accent text-accent border-[1.5px]' : `${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`}`}
                                    onPress={() => setFormData({ ...formData, gender: g.val })}>
                                    <span>{g.emoji}</span> {g.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Input label={`${isArabic ? 'البريد الإلكتروني' : 'Email Address'} *`} name="email" type="email" variant="bordered" radius="lg"
                value={formData.email || ''} onChange={handleChange} placeholder="example@email.com" isRequired
                classNames={{ inputWrapper: inputWrapperCls }} />

            <Input label={`${isArabic ? 'كلمة المرور' : 'Password'} *`} name="password" type={showPassword ? 'text' : 'password'} variant="bordered" radius="lg"
                value={formData.password || ''} onChange={handleChange} placeholder="••••••••" isRequired
                classNames={{ inputWrapper: inputWrapperCls }}
                endContent={<button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none cursor-pointer text-lg">{showPassword ? '🙈' : '👁️'}</button>} />
            
            {!isLogin && formData.password && strengthColors && getPasswordStrength && (
                <div className="flex gap-1 mt-[-8px]">{[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-sm transition-all duration-300"
                        style={{ background: i < getPasswordStrength() ? strengthColors[getPasswordStrength() - 1] : (isDark ? '#21262D' : '#E5E7EB') }} />
                ))}</div>
            )}

            {!isLogin && (
                <Input label={`${isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} *`} name="confirmPassword" type={showConfirm ? 'text' : 'password'} variant="bordered" radius="lg"
                    value={formData.confirmPassword || ''} onChange={handleChange} placeholder="••••••••" isRequired
                    classNames={{ inputWrapper: inputWrapperCls }}
                    endContent={<button type="button" onClick={() => setShowConfirm(!showConfirm)} className="bg-transparent border-none cursor-pointer text-lg">{showConfirm ? '🙈' : '👁️'}</button>}
                    isInvalid={formData.confirmPassword && formData.confirmPassword !== formData.password}
                    errorMessage={formData.confirmPassword && formData.confirmPassword !== formData.password ? (isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match') : ''} />
            )}

            <Button type="submit" fullWidth radius="lg" isLoading={loading}
                className={`${buttonColorClass} text-white font-bold text-base mt-2 hover:-translate-y-0.5`}>
                {loading ? (isArabic ? '⏳ جاري التحميل...' : '⏳ Loading...') : buttonText}
            </Button>
        </form>
    );
}

