export const getAuthData = (isArabic) => {
    const passwordLevels = [
        { label: isArabic ? 'ضعيفة جداً' : 'Very Weak', color: '#EF4444' },
        { label: isArabic ? 'ضعيفة' : 'Weak', color: '#EF4444' },
        { label: isArabic ? 'متوسطة' : 'Fair', color: '#F59E0B' },
        { label: isArabic ? 'جيدة' : 'Good', color: '#10B981' },
        { label: isArabic ? 'قوية' : 'Strong', color: '#059669' },
    ];

    const parentStepLabels = isArabic ? ['كود الطفل', 'الاسم', 'البريد', 'كلمة المرور', 'الهاتف', 'مراجعة'] : ['Child Code', 'Name', 'Email', 'Password', 'Phone', 'Review'];
    const parentStepIcons = ['/icons/pecs_module.png', '/icons/profile.png', '/icons/assistant_aura.png', '/icons/pecs_place_home.png', '/icons/doctor_consultation.png', '/icons/quiz_excellent.png'];

    const childAvatars = ['👦', '👧', '🧒', '👶', '🐱', '🐻', '🦊', '🐰'];

    return { passwordLevels, parentStepLabels, parentStepIcons, childAvatars };
};
