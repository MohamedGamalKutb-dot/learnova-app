export const getProfileData = (isArabic) => {
    const sensoryOptions = [
        { key: 'light_sensitive', label: isArabic ? 'حساسية للضوء' : 'Light Sensitive', emoji: '/icons/pecs_cloth_hat.png' },
        { key: 'sound_sensitive', label: isArabic ? 'حساسية للصوت' : 'Sound Sensitive', emoji: '/icons/pecs_act_music.png' },
        { key: 'touch_sensitive', label: isArabic ? 'حساسية للمس' : 'Touch Sensitive', emoji: '/icons/pecs_body_hug.png' },
        { key: 'visual_stimming', label: isArabic ? 'تحفيز بصري' : 'Visual Stimming', emoji: '/icons/emotion_emo_excited.png' },
        { key: 'movement_seeking', label: isArabic ? 'يحب الحركة' : 'Movement Seeking', emoji: '/icons/pecs_act_play.png' },
        { key: 'calm_environment', label: isArabic ? 'يحب الهدوء' : 'Prefers Calm', emoji: '/icons/emotion_emo_calm.png' },
    ];

    const avatarOptions = ['👦', '👧', '🧒', '👶', '🐱', '🐻', '🦊', '🐰', '🦁', '🐸', '🦄', '🐼'];

    return { sensoryOptions, avatarOptions };
};
