export const defaultRoutine = [
    { id: 'wake_up', title: 'Wake Up', titleAr: 'الاستيقاظ', emoji: '🛌', timeOfDay: 'morning', startTime: '07:00' },
    { id: 'brush_teeth_morning', title: 'Brush Teeth', titleAr: 'تنظيف الأسنان', emoji: '🪥', timeOfDay: 'morning', startTime: '07:15' },
    { id: 'breakfast', title: 'Breakfast', titleAr: 'الفطور', emoji: '🍳', timeOfDay: 'morning', startTime: '07:30' },
    { id: 'get_dressed', title: 'Get Dressed', titleAr: 'ارتداء الملابس', emoji: '👕', timeOfDay: 'morning', startTime: '08:00' },
    { id: 'school', title: 'School', titleAr: 'المدرسة', emoji: '🏫', timeOfDay: 'morning', startTime: '08:30' },
    { id: 'lunch', title: 'Lunch', titleAr: 'الغداء', emoji: '🍽️', timeOfDay: 'afternoon', startTime: '12:30' },
    { id: 'rest_time', title: 'Rest Time', titleAr: 'وقت الراحة', emoji: '😴', timeOfDay: 'afternoon', startTime: '13:30' },
    { id: 'play_time', title: 'Play Time', titleAr: 'وقت اللعب', emoji: '🎨', timeOfDay: 'afternoon', startTime: '15:00' },
    { id: 'snack', title: 'Snack', titleAr: 'وجبة خفيفة', emoji: '🍪', timeOfDay: 'afternoon', startTime: '16:00' },
    { id: 'outdoor', title: 'Outdoor Activity', titleAr: 'نشاط خارجي', emoji: '🌳', timeOfDay: 'evening', startTime: '17:00' },
    { id: 'dinner', title: 'Dinner', titleAr: 'العشاء', emoji: '🍲', timeOfDay: 'evening', startTime: '18:30' },
    { id: 'bath_time', title: 'Bath Time', titleAr: 'وقت الاستحمام', emoji: '🛁', timeOfDay: 'evening', startTime: '19:30' },
    { id: 'story_time', title: 'Story Time', titleAr: 'وقت القصة', emoji: '📖', timeOfDay: 'night', startTime: '20:00' },
    { id: 'brush_teeth_night', title: 'Brush Teeth', titleAr: 'تنظيف الأسنان', emoji: '🪥', timeOfDay: 'night', startTime: '20:15' },
    { id: 'sleep', title: 'Sleep', titleAr: 'النوم', emoji: '😴', timeOfDay: 'night', startTime: '20:30' },
];

export const timeOfDayLabels = {
    morning: '🌅 Morning', afternoon: '☀️ Afternoon',
    evening: '🌆 Evening', night: '🌙 Night',
};

export const timeOfDayLabelsAr = {
    morning: '🌅 الصباح', afternoon: '☀️ الظهر',
    evening: '🌆 المساء', night: '🌙 الليل',
};

export const availableEmojis = [
    '🛌', '🪥', '🍳', '👕', '🏫', '🍽️', '😴', '🎨', '🍪', '🌳',
    '🍲', '🛁', '📖', '🎮', '📺', '🎵', '🧹', '🏃', '🧘', '📝',
    '🎯', '🤸', '🚶', '🏊', '🫧', '💊', '🥤', '🧸', '🎸', '🖍️',
];
