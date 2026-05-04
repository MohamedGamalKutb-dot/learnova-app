export const getDoctorData = (isArabic) => {
    const features = [
        { icon: '/icons/people_cat.png', text: isArabic ? 'إدارة المرضى' : 'Patient Management' },
        { icon: '/icons/quiz_stats.png', text: isArabic ? 'تقييمات شاملة' : 'Comprehensive Assessments' },
        { icon: '/icons/emotion_mastery.png', text: isArabic ? 'تتبع السلوك' : 'Behavior Tracking' },
        { icon: '/icons/resource_library.png', text: isArabic ? 'تقارير مفصلة' : 'Detailed Reports' },
    ];

    const strengthColors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];

    const behaviorTypes = [
        { key: 'meltdown', label: 'Meltdown', labelAr: 'نوبة انفعالية', emoji: '/icons/emotion_emo_angry.png', color: '#FF6584' },
        { key: 'stimming', label: 'Stimming', labelAr: 'حركات تحفيزية', emoji: '/icons/behavior_stimming.png', color: '#F59E0B' },
        { key: 'aggression', label: 'Aggression', labelAr: 'عدوانية', emoji: '/icons/behavior_aggression.png', color: '#E57373' },
        { key: 'withdrawal', label: 'Withdrawal', labelAr: 'انسحاب', emoji: '/icons/emotion_emo_sad.png', color: '#B8A9E8' },
        { key: 'sensory_overload', label: 'Sensory Overload', labelAr: 'حمل حسي زائد', emoji: '/icons/emotion_emo_scared.png', color: '#7EB6D8' },
        { key: 'positive', label: 'Positive Behavior', labelAr: 'سلوك إيجابي', emoji: '/icons/emotion_emo_happy.png', color: '#10B981' },
        { key: 'communication', label: 'Communication Attempt', labelAr: 'محاولة تواصل', emoji: '/icons/pecs_body_help.png', color: '#4ECDC4' },
        { key: 'social', label: 'Social Interaction', labelAr: 'تفاعل اجتماعي', emoji: '/icons/people_cat.png', color: '#6C63FF' },
    ];

    const assessmentQuestions = [
        { id: 1, q: 'Does the child respond to their name?', qAr: 'هل يستجيب الطفل عند مناداته باسمه؟' },
        { id: 2, q: 'Does the child make eye contact?', qAr: 'هل يقوم الطفل بالتواصل البصري؟' },
        { id: 3, q: 'Does the child point to objects?', qAr: 'هل يشير الطفل إلى الأشياء؟' },
        { id: 4, q: 'Does the child use gestures?', qAr: 'هل يستخدم الطفل الإيماءات؟' },
        { id: 5, q: 'Does the child engage in pretend play?', qAr: 'هل يشارك الطفل في اللعب التخيلي؟' },
        { id: 6, q: 'Does the child follow simple instructions?', qAr: 'هل يتبع الطفل التعليمات البسيطة؟' },
        { id: 7, q: 'Does the child show interest in other children?', qAr: 'هل يظهر الطفل اهتماماً بالأطفال الآخرين؟' },
        { id: 8, q: 'Does the child have repetitive behaviors?', qAr: 'هل لدى الطفل سلوكيات متكررة؟' },
        { id: 9, q: 'Is the child sensitive to sounds?', qAr: 'هل الطفل حساس للأصوات؟' },
        { id: 10, q: 'Does the child have difficulty with transitions?', qAr: 'هل يواجه الطفل صعوبة في الانتقال بين الأنشطة؟' },
    ];

    const tabsList = [
        { key: 'patients', label: 'Patients', labelAr: 'المرضى', emoji: '/icons/people_cat.png' },
        { key: 'assessment', label: 'Assessment', labelAr: 'التقييم', emoji: '/icons/quiz_stats.png' },
        { key: 'behavior', label: 'Behavior', labelAr: 'السلوك', emoji: '/icons/emotion_mastery.png' },
        { key: 'reports', label: 'Reports', labelAr: 'التقارير', emoji: '/icons/resource_library.png' },
    ];

    return { features, strengthColors, behaviorTypes, assessmentQuestions, tabsList };
};
