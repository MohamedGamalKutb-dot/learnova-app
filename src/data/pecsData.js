export const categories = ['food', 'emotions', 'places', 'activities', 'body', 'clothes'];

export const categoryEmojis = {
    food: '🍎', emotions: '😊', places: '🏠',
    activities: '🎨', body: '🖐️', clothes: '👕',
};

export const categoryLabels = {
    food: 'Food & Drinks', emotions: 'Emotions', places: 'Places',
    activities: 'Activities', body: 'Body & Needs', clothes: 'Clothes',
};

export const categoryLabelsAr = {
    food: 'الطعام والشراب', emotions: 'المشاعر', places: 'الأماكن',
    activities: 'الأنشطة', body: 'الجسم والاحتياجات', clothes: 'الملابس',
};

export const allItems = [
    // Food & Drinks
    { id: 'food_water', label: 'I want water', labelAr: 'أريد ماء', emoji: '💧', category: 'food' },
    { id: 'food_milk', label: 'I want milk', labelAr: 'أريد حليب', emoji: '🥛', category: 'food' },
    { id: 'food_juice', label: 'I want juice', labelAr: 'أريد عصير', emoji: '🧃', category: 'food' },
    { id: 'food_bread', label: 'I want bread', labelAr: 'أريد خبز', emoji: '🍞', category: 'food' },
    { id: 'food_rice', label: 'I want rice', labelAr: 'أريد أرز', emoji: '🍚', category: 'food' },
    { id: 'food_chicken', label: 'I want chicken', labelAr: 'أريد دجاج', emoji: '🍗', category: 'food' },
    { id: 'food_apple', label: 'I want apple', labelAr: 'أريد تفاحة', emoji: '🍎', category: 'food' },
    { id: 'food_banana', label: 'I want banana', labelAr: 'أريد موزة', emoji: '🍌', category: 'food' },
    { id: 'food_cookie', label: 'I want a cookie', labelAr: 'أريد بسكويت', emoji: '🍪', category: 'food' },
    { id: 'food_cake', label: 'I want cake', labelAr: 'أريد كعكة', emoji: '🎂', category: 'food' },
    { id: 'food_egg', label: 'I want egg', labelAr: 'أريد بيضة', emoji: '🥚', category: 'food' },
    { id: 'food_sandwich', label: 'I want sandwich', labelAr: 'أريد ساندويتش', emoji: '🥪', category: 'food' },
    // Emotions
    { id: 'emo_happy', label: 'I feel happy', labelAr: 'أشعر بالسعادة', emoji: '😊', category: 'emotions' },
    { id: 'emo_sad', label: 'I feel sad', labelAr: 'أشعر بالحزن', emoji: '😢', category: 'emotions' },
    { id: 'emo_angry', label: 'I feel angry', labelAr: 'أشعر بالغضب', emoji: '😠', category: 'emotions' },
    { id: 'emo_scared', label: 'I feel scared', labelAr: 'أشعر بالخوف', emoji: '😨', category: 'emotions' },
    { id: 'emo_tired', label: 'I feel tired', labelAr: 'أشعر بالتعب', emoji: '😴', category: 'emotions' },
    { id: 'emo_love', label: 'I feel love', labelAr: 'أشعر بالحب', emoji: '🥰', category: 'emotions' },
    { id: 'emo_sick', label: 'I feel sick', labelAr: 'أشعر بالمرض', emoji: '🤒', category: 'emotions' },
    { id: 'emo_confused', label: 'I feel confused', labelAr: 'أشعر بالحيرة', emoji: '😕', category: 'emotions' },
    { id: 'emo_excited', label: 'I feel excited', labelAr: 'أشعر بالحماس', emoji: '🤩', category: 'emotions' },
    { id: 'emo_calm', label: 'I feel calm', labelAr: 'أشعر بالهدوء', emoji: '😌', category: 'emotions' },
    // Places
    { id: 'place_home', label: 'I want to go home', labelAr: 'أريد الذهاب للبيت', emoji: '🏠', category: 'places' },
    { id: 'place_school', label: 'I want to go to school', labelAr: 'أريد الذهاب للمدرسة', emoji: '🏫', category: 'places' },
    { id: 'place_park', label: 'I want to go to the park', labelAr: 'أريد الذهاب للحديقة', emoji: '🌳', category: 'places' },
    { id: 'place_bathroom', label: 'I want to go to bathroom', labelAr: 'أريد الذهاب للحمام', emoji: '🚻', category: 'places' },
    { id: 'place_store', label: 'I want to go to the store', labelAr: 'أريد الذهاب للمتجر', emoji: '🏪', category: 'places' },
    { id: 'place_hospital', label: 'I want to go to hospital', labelAr: 'أريد الذهاب للمستشفى', emoji: '🏥', category: 'places' },
    { id: 'place_outside', label: 'I want to go outside', labelAr: 'أريد الخروج', emoji: '🌤️', category: 'places' },
    { id: 'place_car', label: 'I want to go by car', labelAr: 'أريد الذهاب بالسيارة', emoji: '🚗', category: 'places' },
    // Activities
    { id: 'act_play', label: 'I want to play', labelAr: 'أريد اللعب', emoji: '🎮', category: 'activities' },
    { id: 'act_draw', label: 'I want to draw', labelAr: 'أريد الرسم', emoji: '🎨', category: 'activities' },
    { id: 'act_read', label: 'I want to read', labelAr: 'أريد القراءة', emoji: '📖', category: 'activities' },
    { id: 'act_watch', label: 'I want to watch TV', labelAr: 'أريد مشاهدة التلفاز', emoji: '📺', category: 'activities' },
    { id: 'act_music', label: 'I want music', labelAr: 'أريد موسيقى', emoji: '🎵', category: 'activities' },
    { id: 'act_swim', label: 'I want to swim', labelAr: 'أريد السباحة', emoji: '🏊', category: 'activities' },
    { id: 'act_walk', label: 'I want to walk', labelAr: 'أريد المشي', emoji: '🚶', category: 'activities' },
    { id: 'act_sleep', label: 'I want to sleep', labelAr: 'أريد النوم', emoji: '😴', category: 'activities' },
    // Body & Needs
    { id: 'body_hungry', label: 'I am hungry', labelAr: 'أنا جوعان', emoji: '🤤', category: 'body' },
    { id: 'body_thirsty', label: 'I am thirsty', labelAr: 'أنا عطشان', emoji: '💧', category: 'body' },
    { id: 'body_hurt', label: 'I am hurt', labelAr: 'أنا أتألم', emoji: '🤕', category: 'body' },
    { id: 'body_cold', label: 'I am cold', labelAr: 'أشعر بالبرد', emoji: '🥶', category: 'body' },
    { id: 'body_hot', label: 'I am hot', labelAr: 'أشعر بالحر', emoji: '🥵', category: 'body' },
    { id: 'body_hug', label: 'I want a hug', labelAr: 'أريد حضن', emoji: '🤗', category: 'body' },
    { id: 'body_help', label: 'I need help', labelAr: 'أحتاج مساعدة', emoji: '🆘', category: 'body' },
    { id: 'body_toilet', label: 'I need the toilet', labelAr: 'أحتاج الحمام', emoji: '🚽', category: 'body' },
    // Clothes
    { id: 'cloth_shirt', label: 'I want my shirt', labelAr: 'أريد قميصي', emoji: '👕', category: 'clothes' },
    { id: 'cloth_pants', label: 'I want my pants', labelAr: 'أريد بنطالي', emoji: '👖', category: 'clothes' },
    { id: 'cloth_shoes', label: 'I want my shoes', labelAr: 'أريد حذائي', emoji: '👟', category: 'clothes' },
    { id: 'cloth_jacket', label: 'I want my jacket', labelAr: 'أريد جاكيتي', emoji: '🧥', category: 'clothes' },
    { id: 'cloth_hat', label: 'I want my hat', labelAr: 'أريد قبعتي', emoji: '🎩', category: 'clothes' },
    { id: 'cloth_socks', label: 'I want my socks', labelAr: 'أريد جواربي', emoji: '🧦', category: 'clothes' },
];

export function getItemsByCategory(category) {
    return allItems.filter(item => item.category === category);
}
