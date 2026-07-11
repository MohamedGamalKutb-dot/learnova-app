import { readFileSync } from 'fs';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// 1. Read and parse .env
const envPath = resolve(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEq = trimmed.indexOf('=');
    if (firstEq === -1) return;
    const key = trimmed.slice(0, firstEq).trim();
    const val = trimmed.slice(firstEq + 1).trim();
    env[key] = val;
});

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Using Firebase Config for Project ID:', firebaseConfig.projectId);

// 2. Define data to write
const fallbackEnglishWords = {
    animals: [
        'lion', 'tiger', 'elephant', 'giraffe', 'monkey', 'horse', 'donkey', 'cow', 'sheep', 'goat',
        'camel', 'deer', 'bear', 'fox', 'wolf', 'rabbit', 'cat', 'dog', 'mouse', 'squirrel',
        'hyena', 'cheetah', 'rhino', 'crocodile', 'turtle', 'snake', 'frog', 'fish', 'whale', 'dolphin',
        'eagle', 'falcon', 'owl', 'parrot', 'pigeon', 'duck', 'chicken', 'rooster', 'bee', 'butterfly',
        'scorpion', 'spider', 'ant', 'worm', 'beetle', 'dove', 'swan', 'peacock', 'ostrich', 'chameleon',
    ],
    colors: [
        'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'white', 'black', 'gray',
        'brown', 'gold', 'silver', 'cyan', 'indigo', 'ivory', 'maroon', 'coral', 'teal', 'crimson',
        'navy', 'olive', 'beige', 'peach', 'lemon', 'copper', 'salmon', 'wine', 'sand', 'cream',
    ],
    fruits: [
        'apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'melon', 'mango', 'pineapple', 'kiwi',
        'peach', 'apricot', 'cherry', 'berry', 'pomegranate', 'fig', 'date', 'guava', 'lemon', 'tangerine',
        'pear', 'avocado', 'coconut', 'raisin', 'blueberry', 'papaya', 'lime', 'plum', 'nectarine', 'passion',
        'lychee', 'dragonfruit', 'mulberry', 'cranberry', 'blackberry', 'raspberry', 'grapefruit', 'persimmon', 'quince', 'olive',
    ],
    vegetables: [
        'tomato', 'cucumber', 'onion', 'garlic', 'carrot', 'potato', 'eggplant', 'pepper', 'zucchini', 'okra',
        'spinach', 'lettuce', 'parsley', 'mint', 'celery', 'cauliflower', 'broccoli', 'bean', 'pea', 'corn',
        'radish', 'beet', 'cabbage', 'turnip', 'pumpkin', 'ginger', 'turmeric', 'mushroom', 'asparagus', 'lentil',
        'chickpea', 'artichoke', 'kale', 'leek', 'chive', 'basil', 'thyme', 'oregano', 'sage', 'dill',
    ],
    school: [
        'school', 'class', 'board', 'chalk', 'book', 'notebook', 'pen', 'pencil', 'bag', 'desk',
        'chair', 'teacher', 'student', 'homework', 'exam', 'grade', 'certificate', 'library', 'playground', 'lab',
        'lesson', 'schedule', 'break', 'line', 'anthem', 'sport', 'art', 'music', 'science', 'math',
        'language', 'history', 'geography', 'computer', 'principal', 'guard', 'driver', 'worker', 'contest', 'prize',
        'medal', 'flag', 'map', 'ball', 'rope', 'whistle', 'yard', 'gate', 'uniform', 'ruler',
    ],
    home: [
        'house', 'door', 'window', 'wall', 'roof', 'floor', 'stairs', 'balcony', 'garden', 'kitchen',
        'room', 'hall', 'bathroom', 'bed', 'pillow', 'blanket', 'closet', 'desk', 'chair', 'sofa',
        'television', 'radio', 'curtain', 'carpet', 'painting', 'mirror', 'clock', 'vase', 'lamp', 'chandelier',
        'faucet', 'sink', 'basin', 'stove', 'oven', 'fridge', 'washer', 'broom', 'basket', 'shelf',
        'drawer', 'lock', 'key', 'bell', 'mail', 'fence', 'pillar', 'tile', 'marble', 'wood',
    ],
    nature: [
        'sun', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'thunder', 'lightning', 'rainbow',
        'tree', 'flower', 'grass', 'leaf', 'root', 'branch', 'fruit', 'seed', 'soil', 'rock',
        'mountain', 'hill', 'valley', 'river', 'lake', 'sea', 'ocean', 'beach', 'island', 'forest',
        'desert', 'oasis', 'spring', 'waterfall', 'cave', 'volcano', 'earthquake', 'storm', 'fog', 'dew',
        'air', 'wind', 'wave', 'current', 'tide', 'dawn', 'sunset', 'shadow', 'light', 'breeze',
    ],
    jobs: [
        'doctor', 'engineer', 'teacher', 'lawyer', 'journalist', 'pilot', 'police', 'firefighter', 'soldier', 'nurse',
        'pharmacist', 'baker', 'chef', 'carpenter', 'blacksmith', 'electrician', 'plumber', 'farmer', 'fisher', 'seller',
        'driver', 'sailor', 'painter', 'photographer', 'writer', 'translator', 'accountant', 'manager', 'scientist', 'inventor',
        'astronomer', 'surgeon', 'veterinarian', 'tailor', 'barber', 'architect', 'builder', 'mechanic', 'musician', 'actor',
        'singer', 'anchor', 'judge', 'diplomat', 'astronaut', 'diver', 'climber', 'athlete', 'dentist', 'librarian',
    ],
    bodyParts: [
        'head', 'eye', 'nose', 'mouth', 'ear', 'forehead', 'cheek', 'chin', 'neck', 'shoulder',
        'arm', 'elbow', 'wrist', 'hand', 'finger', 'nail', 'chest', 'stomach', 'back', 'waist',
        'thigh', 'knee', 'leg', 'ankle', 'foot', 'thumb', 'eyebrow', 'eyelash', 'lip', 'tongue',
        'tooth', 'gum', 'throat', 'heart', 'lung', 'liver', 'kidney', 'brain', 'bone', 'muscle',
        'tendon', 'artery', 'vein', 'skin', 'hair', 'beard', 'palm', 'heel', 'rib', 'spine',
    ],
    dailyObjects: [
        'hammer', 'screwdriver', 'saw', 'wrench', 'nail', 'screw', 'pliers', 'scissors', 'knife', 'spoon',
        'fork', 'plate', 'cup', 'pot', 'pan', 'brush', 'broom', 'bucket', 'hose', 'tape',
        'ruler', 'eraser', 'stapler', 'sharpener', 'glue', 'calculator', 'watch', 'phone', 'charger', 'headphone',
        'flashlight', 'candle', 'lighter', 'battery', 'fan', 'iron', 'umbrella', 'wallet', 'suitcase', 'backpack',
        'towel', 'soap', 'shampoo', 'toothbrush', 'toothpaste', 'comb', 'tissue', 'bottle', 'container', 'zipper',
    ],
};

const fallbackEnglishCategoryLabels = {
    animals: 'Animals',
    colors: 'Colors',
    fruits: 'Fruits',
    vegetables: 'Vegetables',
    school: 'School',
    home: 'Home',
    nature: 'Nature',
    jobs: 'Jobs',
    bodyParts: 'Body Parts',
    dailyObjects: 'Daily Objects',
};

const fallbackArabicWords = {
    animals: [
        'أسد', 'نمر', 'فيل', 'زرافة', 'قرد', 'حصان', 'حمار', 'بقرة', 'خروف', 'ماعز',
        'جمل', 'غزال', 'دب', 'ثعلب', 'ذئب', 'أرنب', 'قط', 'كلب', 'فأر', 'سنجاب',
        'ضبع', 'فهد', 'وحيد', 'تمساح', 'سلحفاة', 'ثعبان', 'ضفدع', 'سمكة', 'حوت', 'دلفين',
        'نسر', 'صقر', 'بومة', 'ببغاء', 'حمامة', 'بطة', 'دجاجة', 'ديك', 'نحلة', 'فراشة',
        'عقرب', 'عنكبوت', 'نملة', 'دودة', 'خنفساء', 'يمامة', 'بجعة', 'طاووس', 'نعامة', 'حرباء',
    ],
    colors: [
        'أحمر', 'أزرق', 'أخضر', 'أصفر', 'برتقالي', 'بنفسجي', 'وردي', 'أبيض', 'أسود', 'رمادي',
        'بني', 'ذهبي', 'فضي', 'سماوي', 'نيلي', 'عاجي', 'كستنائي', 'زهري', 'فيروزي', 'قرمزي',
        'كحلي', 'زيتي', 'بيج', 'خوخي', 'ليموني', 'نحاسي', 'مرجاني', 'خمري', 'رملي', 'كريمي',
    ],
    fruits: [
        'تفاحة', 'موزة', 'برتقالة', 'عنب', 'فراولة', 'بطيخ', 'شمام', 'مانجو', 'أناناس', 'كيوي',
        'خوخ', 'مشمش', 'كرز', 'توت', 'رمان', 'تين', 'بلح', 'جوافة', 'ليمون', 'يوسفي',
        'كمثرى', 'أفوكادو', 'جوز هند', 'تمر', 'زبيب', 'عنبية', 'توتة', 'بابايا', 'كاكا', 'سفرجل',
        'نبق', 'عناب', 'دراق', 'جريب', 'كلمنتينا', 'ليتشي', 'تفاح', 'عنبر', 'زيتون', 'صبار',
    ],
    vegetables: [
        'طماطم', 'خيار', 'بصل', 'ثوم', 'جزر', 'بطاطس', 'باذنجان', 'فلفل', 'كوسة', 'بامية',
        'ملوخية', 'سبانخ', 'خس', 'جرجير', 'بقدونس', 'شبت', 'نعناع', 'كرفس', 'قرنبيط', 'بروكلي',
        'فاصوليا', 'بسلة', 'ذرة', 'لوبيا', 'فجل', 'شمندر', 'كرنب', 'ملفوف', 'لفت', 'قرع',
        'يقطين', 'بطاطا', 'زنجبيل', 'كركم', 'فطر', 'هليون', 'أرضي', 'حمص', 'عدس', 'فول',
    ],
    tools: [
        'مطرقة', 'مفك', 'منشار', 'مفتاح', 'مسمار', 'برغي', 'كماشة', 'مقص', 'سكين', 'ملعقة',
        'شوكة', 'صحن', 'كوب', 'إبريق', 'قدر', 'مقلاة', 'فرشاة', 'مكنسة', 'دلو', 'خرطوم',
        'مسطرة', 'قلم', 'ممحاة', 'دباسة', 'مبراة', 'لاصق', 'مغلفة', 'حاسبة', 'ساعة', 'مرآة',
        'مظلة', 'حقيبة', 'محفظة', 'هاتف', 'شاحن', 'سماعة', 'مصباح', 'شمعة', 'ولاعة', 'بطارية',
        'مروحة', 'مكواة', 'غسالة', 'ثلاجة', 'فرن', 'خلاط', 'محمصة', 'غلاية', 'مجفف', 'مكيف',
    ],
    jobs: [
        'طبيب', 'مهندس', 'معلم', 'محامي', 'صحفي', 'طيار', 'شرطي', 'إطفائي', 'جندي', 'ممرض',
        'صيدلي', 'خباز', 'طباخ', 'نجار', 'حداد', 'كهربائي', 'سباك', 'مزارع', 'صياد', 'بائع',
        'سائق', 'بحار', 'رسام', 'مصور', 'كاتب', 'مترجم', 'محاسب', 'مدير', 'عالم', 'مخترع',
        'فلكي', 'جراح', 'بيطري', 'خياط', 'حلاق', 'ساعاتي', 'بناء', 'دهان', 'لحام', 'ميكانيكي',
        'موسيقي', 'ممثل', 'مغني', 'مذيع', 'قاضي', 'دبلوماسي', 'رائد', 'غواص', 'متسلق', 'عداء',
    ],
    body: [
        'رأس', 'عين', 'أنف', 'فم', 'أذن', 'جبهة', 'خد', 'ذقن', 'رقبة', 'كتف',
        'ذراع', 'كوع', 'معصم', 'يد', 'إصبع', 'ظفر', 'صدر', 'بطن', 'ظهر', 'خصر',
        'فخذ', 'ركبة', 'ساق', 'كاحل', 'قدم', 'إبهام', 'حاجب', 'رمش', 'شفة', 'لسان',
        'سن', 'ضرس', 'لثة', 'حنجرة', 'قلب', 'رئة', 'كبد', 'كلية', 'معدة', 'دماغ',
        'عظم', 'عضلة', 'وتر', 'شريان', 'وريد', 'جلد', 'شعر', 'لحية', 'شارب', 'حنك',
    ],
    school: [
        'مدرسة', 'فصل', 'سبورة', 'طباشير', 'كتاب', 'دفتر', 'قلم', 'حقيبة', 'مقعد', 'طاولة',
        'معلم', 'تلميذ', 'واجب', 'امتحان', 'درجة', 'شهادة', 'مكتبة', 'ملعب', 'حديقة', 'مختبر',
        'حصة', 'جدول', 'فسحة', 'طابور', 'نشيد', 'رياضة', 'رسم', 'موسيقى', 'علوم', 'رياضيات',
        'لغة', 'تاريخ', 'جغرافيا', 'حاسوب', 'مدير', 'ناظر', 'وكيل', 'حارس', 'سائق', 'عامل',
        'مسابقة', 'جائزة', 'ميدالية', 'علم', 'خريطة', 'كرة', 'حبل', 'صافرة', 'ساحة', 'بوابة',
    ],
    home: [
        'منزل', 'باب', 'نافذة', 'جدار', 'سقف', 'أرضية', 'سلم', 'شرفة', 'حديقة', 'مطبخ',
        'غرفة', 'صالة', 'حمام', 'سرير', 'وسادة', 'غطاء', 'خزانة', 'مكتب', 'كرسي', 'أريكة',
        'تلفاز', 'راديو', 'ستارة', 'سجادة', 'لوحة', 'مرآة', 'ساعة', 'مزهرية', 'مصباح', 'ثريا',
        'صنبور', 'حوض', 'مغسلة', 'موقد', 'فرن', 'ثلاجة', 'غسالة', 'مكنسة', 'سلة', 'رف',
        'درج', 'قفل', 'مفتاح', 'جرس', 'بريد', 'سياج', 'عمود', 'بلاط', 'رخام', 'خشب',
    ],
    nature: [
        'شمس', 'قمر', 'نجمة', 'سماء', 'سحابة', 'مطر', 'ثلج', 'رعد', 'برق', 'قوس',
        'شجرة', 'زهرة', 'عشب', 'ورقة', 'جذر', 'غصن', 'ثمرة', 'بذرة', 'تراب', 'صخرة',
        'جبل', 'تل', 'وادي', 'نهر', 'بحيرة', 'بحر', 'محيط', 'شاطئ', 'جزيرة', 'غابة',
        'صحراء', 'واحة', 'ينبوع', 'شلال', 'كهف', 'بركان', 'زلزال', 'عاصفة', 'ضباب', 'ندى',
        'هواء', 'رياح', 'موجة', 'تيار', 'مد', 'جزر', 'فجر', 'غروب', 'ظل', 'ضوء',
    ],
};

const fallbackArabicCategoryLabels = {
    animals: 'حيوانات',
    colors: 'ألوان',
    fruits: 'فواكه',
    vegetables: 'خضروات',
    tools: 'أدوات',
    jobs: 'مهن',
    body: 'أعضاء الجسم',
    school: 'المدرسة',
    home: 'المنزل',
    nature: 'الطبيعة',
};

const pianoConfig = {
    notes: [
        { note: 'C', key: 'a', type: 'white', freq: 261.63 },
        { note: 'C#', key: 'w', type: 'black', freq: 277.18 },
        { note: 'D', key: 's', type: 'white', freq: 293.66 },
        { note: 'D#', key: 'e', type: 'black', freq: 311.13 },
        { note: 'E', key: 'd', type: 'white', freq: 329.63 },
        { note: 'F', key: 'f', type: 'white', freq: 349.23 },
        { note: 'F#', key: 't', type: 'black', freq: 369.99 },
        { note: 'G', key: 'g', type: 'white', freq: 392.00 },
        { note: 'G#', key: 'y', type: 'black', freq: 415.30 },
        { note: 'A', key: 'h', type: 'white', freq: 440.00 },
        { note: 'A#', key: 'u', type: 'black', freq: 466.16 },
        { note: 'B', key: 'j', type: 'white', freq: 493.88 },
        { note: 'C5', key: 'k', type: 'white', freq: 523.25 },
        { note: 'C#5', key: 'o', type: 'black', freq: 554.37 },
        { note: 'D5', key: 'l', type: 'white', freq: 587.33 },
        { note: 'E5', key: 'z', type: 'white', freq: 659.25 },
        { note: 'F5', key: 'x', type: 'white', freq: 698.46 },
        { note: 'G5', key: 'c', type: 'white', freq: 783.99 },
        { note: 'A5', key: 'v', type: 'white', freq: 880.00 }
    ],
    keyColors: {
        'C': '#EF4444', 'C#': '#F97316', 'D': '#F59E0B', 'D#': '#EAB308',
        'E': '#84CC16', 'F': '#22C55E', 'F#': '#10B981', 'G': '#06B6D4',
        'G#': '#3B82F6', 'A': '#6366F1', 'A#': '#8B5CF6', 'B': '#A855F7',
        'C5': '#EC4899', 'C#5': '#F43F5E', 'D5': '#EF4444',
        'E5': '#EAB308', 'F5': '#22C55E', 'G5': '#06B6D4', 'A5': '#6366F1',
    },
    keyToCode: {
        'a': 'KeyA', 's': 'KeyS', 'd': 'KeyD', 'f': 'KeyF', 'g': 'KeyG', 'h': 'KeyH', 'j': 'KeyJ',
        'k': 'KeyK', 'l': 'KeyL', 'z': 'KeyZ', 'x': 'KeyX', 'c': 'KeyC', 'v': 'KeyV',
        'w': 'KeyW', 'e': 'KeyE', 't': 'KeyT', 'y': 'KeyY', 'u': 'KeyU', 'o': 'KeyO'
    }
};

const drawingConfig = {
    COLORS: [
        '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6',
        '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
        '#F43F5E', '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#FFFFFF', '#92400E',
    ],
    BRUSH_SIZES: [2, 4, 6, 10, 16, 24],
    TOOLS: {
        pen: { icon: '✏️' },
        eraser: { icon: '🧹' },
        fill: { icon: '🪣' },
    },
    SHAPES: {
        square: { label: { en: 'Square', ar: 'مربع' }, icon: '⬛', path: 'M10,10 L90,10 L90,90 L10,90 Z' },
        rectangle: { label: { en: 'Rectangle', ar: 'مستطيل' }, icon: '▬', path: 'M5,25 L95,25 L95,75 L5,75 Z' },
        circle: { label: { en: 'Circle', ar: 'دائرة' }, icon: '⚫', path: null, isCircle: true },
        triangle: { label: { en: 'Triangle', ar: 'مثلث' }, icon: '🔺', path: 'M50,10 L90,90 L10,90 Z' },
        star: { label: { en: 'Star', ar: 'نجمة' }, icon: '⭐', path: 'M50,5 L61,35 L95,35 L68,55 L79,90 L50,70 L21,90 L32,55 L5,35 L39,35 Z' },
        heart: { label: { en: 'Heart', ar: 'قلب' }, icon: '❤️', path: 'M50,85 C25,65 5,50 5,30 C5,15 15,5 30,5 C38,5 45,10 50,18 C55,10 62,5 70,5 C85,5 95,15 95,30 C95,50 75,65 50,85 Z' },
        arrow: { label: { en: 'Arrow', ar: 'سهم' }, icon: '➡️', path: 'M10,40 L60,40 L60,20 L90,50 L60,80 L60,60 L10,60 Z' },
        pentagon: { label: { en: 'Pentagon', ar: 'خماسي' }, icon: '⬠', path: 'M50,5 L95,38 L77,90 L23,90 L5,38 Z' },
        hexagon: { label: { en: 'Hexagon', ar: 'سداسي' }, icon: '⬡', path: 'M50,5 L90,25 L90,70 L50,90 L10,70 L10,25 Z' },
        oval: { label: { en: 'Oval', ar: 'بيضاوي' }, icon: '🥚', path: null, isOval: true },
        cloud: { label: { en: 'Cloud', ar: 'سحابة' }, icon: '☁️', path: 'M25,60 A20,20,0,0,1,25,25 A20,15,0,0,1,50,15 A20,15,0,0,1,75,25 A20,20,0,0,1,75,60 Z' },
        tree: { label: { en: 'Tree', ar: 'شجرة' }, icon: '🌳', path: 'M50,10 L75,45 L65,45 L80,70 L20,70 L35,45 L25,45 Z M45,70 L45,92 L55,92 L55,70 Z' },
        house: { label: { en: 'House', ar: 'منزل' }, icon: '🏠', path: 'M50,10 L90,45 L90,90 L10,90 L10,45 Z M40,60 L60,60 L60,90 L40,90 Z' },
        car: { label: { en: 'Car', ar: 'سيارة' }, icon: '🚗', path: 'M15,55 L25,35 L65,35 L80,55 L90,55 L90,72 L80,72 L80,72 A8,8,0,1,1,64,72 L36,72 A8,8,0,1,1,20,72 L10,72 L10,55 Z' },
        flower: { label: { en: 'Flower', ar: 'زهرة' }, icon: '🌸', path: 'M50,30 A12,12,0,1,1,50,31 M35,40 A12,12,0,1,1,35,41 M65,40 A12,12,0,1,1,65,41 M40,55 A12,12,0,1,1,40,56 M60,55 A12,12,0,1,1,60,56 M46,65 L46,92 L54,92 L54,65 Z' },
    }
};

const puzzleConfig = {
    PUZZLE_IMAGES: [
        '/icons/pecs_food_apple.png', '/icons/pecs_food_banana.png', '/icons/pecs_food_cake.png',
        '/icons/pecs_act_play.png', '/icons/pecs_act_read.png', '/icons/pecs_act_swim.png',
        '/icons/pecs_act_music.png', '/icons/pecs_place_park.png', '/icons/pecs_place_school.png',
        '/icons/pecs_place_home.png', '/icons/pecs_food_chicken.png', '/icons/pecs_food_sandwich.png',
        '/icons/emotion_emo_happy.png', '/icons/emotion_emo_love.png', '/icons/emotion_emo_excited.png',
        '/icons/pecs_cloth_shirt.png', '/icons/pecs_cloth_shoes.png', '/icons/pecs_act_walk.png',
    ],
    encouragements: {
        ar: ['أحسنت! 🌟', 'ممتاز! 🎉', 'رائع! ⭐', 'عبقري! 🧠', 'بطل! 🏆'],
        en: ['Great job! 🌟', 'Excellent! 🎉', 'Amazing! ⭐', 'Genius! 🧠', 'Champion! 🏆'],
    }
};

const wordGameConfig = {
    DIFFICULTY: {
        easy: { min: 3, max: 4 },
        medium: { min: 5, max: 7 },
        hard: { min: 8, max: 50 },
    },
    encouragements: {
        ar: ['أحسنت! 🌟', 'ممتاز! 🎉', 'رائع! ⭐', 'عبقري! 🧠', 'بطل! 🏆', 'مذهل! 💎'],
        en: ['Great job! 🌟', 'Excellent! 🎉', 'Amazing! ⭐', 'Genius! 🧠', 'Champion! 🏆', 'Brilliant! 💎'],
    }
};

// 3. Perform seeding
async function run() {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('Seeding words_en...');
    await setDoc(doc(db, 'game_config', 'words_en'), {
        words: fallbackEnglishWords,
        labels: fallbackEnglishCategoryLabels
    });

    console.log('Seeding words_ar...');
    await setDoc(doc(db, 'game_config', 'words_ar'), {
        words: fallbackArabicWords,
        labels: fallbackArabicCategoryLabels
    });

    console.log('Seeding piano config...');
    await setDoc(doc(db, 'game_config', 'piano'), pianoConfig);

    console.log('Seeding drawing config...');
    await setDoc(doc(db, 'game_config', 'drawing'), drawingConfig);

    console.log('Seeding puzzle config...');
    await setDoc(doc(db, 'game_config', 'puzzle'), puzzleConfig);

    console.log('Seeding word_game config...');
    await setDoc(doc(db, 'game_config', 'word_game'), wordGameConfig);

    console.log('DB Seed completed successfully!');
    process.exit(0);
}

run().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
