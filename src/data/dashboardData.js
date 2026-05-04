export const getDashboardData = (isArabic) => {
    const moduleNames = isArabic 
        ? { pecs: 'التواصل', emotions: 'المشاعر', routine: 'الروتين', calming: 'الهدوء', 'تهدئة': 'تهدئة', 'صور أعضاء الصدر': 'التواصل' } 
        : { pecs: 'PECS', emotions: 'Emotions', routine: 'Routine', calming: 'Calming', 'تهدئة': 'Calming', 'صور أعضاء الصدر': 'PECS' };
    
    const moduleEmojis = { 
        pecs: '/icons/pecs.png', 
        emotions: '/icons/emotions.png', 
        routine: '/icons/routine.png', 
        calming: '/icons/calming_icon.png', 
        'تهدئة': '/icons/calming_icon.png', 
        'صور أعضاء الصدر': '/icons/pecs.png' 
    };

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
    ];

    return { moduleNames, moduleEmojis, behaviorTypes, assessmentQuestions };
};
