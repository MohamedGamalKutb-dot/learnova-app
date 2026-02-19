export const allEmotions = [
    // Level 1 - Basic (Easy)
    { id: 'happy', name: 'Happy', nameAr: 'سعيد', emoji: '😊', description: 'When you smile and feel good inside', descriptionAr: 'عندما تبتسم وتشعر بالسعادة من الداخل', difficultyLevel: 1 },
    { id: 'sad', name: 'Sad', nameAr: 'حزين', emoji: '😢', description: 'When you feel down and want to cry', descriptionAr: 'عندما تشعر بالإحباط وتريد البكاء', difficultyLevel: 1 },
    { id: 'angry', name: 'Angry', nameAr: 'غاضب', emoji: '😠', description: 'When something makes you upset', descriptionAr: 'عندما يزعجك شيء ما', difficultyLevel: 1 },
    { id: 'scared', name: 'Scared', nameAr: 'خائف', emoji: '😨', description: 'When something frightens you', descriptionAr: 'عندما يخيفك شيء ما', difficultyLevel: 1 },
    // Level 2 - Intermediate
    { id: 'surprised', name: 'Surprised', nameAr: 'متفاجئ', emoji: '😲', description: 'When something unexpected happens', descriptionAr: 'عندما يحدث شيء غير متوقع', difficultyLevel: 2 },
    { id: 'tired', name: 'Tired', nameAr: 'متعب', emoji: '😴', description: 'When your body needs rest', descriptionAr: 'عندما يحتاج جسمك للراحة', difficultyLevel: 2 },
    { id: 'excited', name: 'Excited', nameAr: 'متحمس', emoji: '🤩', description: 'When you feel full of energy and joy', descriptionAr: 'عندما تشعر بالطاقة والفرح', difficultyLevel: 2 },
    { id: 'love', name: 'Love', nameAr: 'حب', emoji: '🥰', description: 'When you care deeply about someone', descriptionAr: 'عندما تهتم بشخص ما كثيراً', difficultyLevel: 2 },
    { id: 'shy', name: 'Shy', nameAr: 'خجول', emoji: '😳', description: 'When you feel nervous around others', descriptionAr: 'عندما تشعر بالتوتر حول الآخرين', difficultyLevel: 2 },
    { id: 'sick', name: 'Sick', nameAr: 'مريض', emoji: '🤒', description: 'When your body does not feel well', descriptionAr: 'عندما لا يشعر جسمك بالراحة', difficultyLevel: 2 },
    // Level 3 - Advanced
    { id: 'confused', name: 'Confused', nameAr: 'محتار', emoji: '😕', description: 'When you do not understand something', descriptionAr: 'عندما لا تفهم شيئاً ما', difficultyLevel: 3 },
    { id: 'proud', name: 'Proud', nameAr: 'فخور', emoji: '😤', description: 'When you did something great', descriptionAr: 'عندما تنجز شيئاً رائعاً', difficultyLevel: 3 },
    { id: 'jealous', name: 'Jealous', nameAr: 'غيور', emoji: '😒', description: 'When you want what someone else has', descriptionAr: 'عندما تريد ما لدى شخص آخر', difficultyLevel: 3 },
    { id: 'grateful', name: 'Grateful', nameAr: 'ممتن', emoji: '🙏', description: 'When you feel thankful for something', descriptionAr: 'عندما تشعر بالامتنان لشيء ما', difficultyLevel: 3 },
    { id: 'lonely', name: 'Lonely', nameAr: 'وحيد', emoji: '🥺', description: 'When you feel alone and want company', descriptionAr: 'عندما تشعر بالوحدة وتريد رفقة', difficultyLevel: 3 },
    { id: 'calm', name: 'Calm', nameAr: 'هادئ', emoji: '😌', description: 'When you feel peaceful and relaxed', descriptionAr: 'عندما تشعر بالسلام والاسترخاء', difficultyLevel: 3 },
];

export function getByLevel(level) {
    return allEmotions.filter(e => e.difficultyLevel === level);
}

export function getUpToLevel(level) {
    return allEmotions.filter(e => e.difficultyLevel <= level);
}
