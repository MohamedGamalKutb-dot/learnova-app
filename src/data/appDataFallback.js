import { getLandingData } from './landingData';
import { getAuthData } from './authData';
import { getChoiceData } from './choiceData';
import { getDashboardData } from './dashboardData';
import { getDoctorData } from './doctorData';

const childHomeData = {
    modules: [
        { key: 'pecs', icon: '/icons/pecs.png', color: '#4ECDC4', gradient: 'from-teal-500/20 to-emerald-500/10', path: '/pecs' },
        { key: 'routine', icon: '/icons/routine.png', color: '#FFD166', gradient: 'from-amber-500/20 to-yellow-500/10', path: '/routine' },
        { key: 'emotions', icon: '/icons/emotions.png', color: '#6C63FF', gradient: 'from-indigo-500/20 to-purple-500/10', path: '/emotions' },
        { key: 'calming', icon: '/icons/calming_icon.png', color: '#118AB2', gradient: 'from-sky-500/20 to-blue-500/10', path: '/calming' },
        { key: 'bot', icon: '/icons/bot.png', color: '#FF6584', gradient: 'from-pink-500/20 to-rose-500/10', path: 'modal' },
        { key: 'games', icon: '/icons/games.png', color: '#A78BFA', gradient: 'from-purple-500/20 to-violet-500/10', path: '/games' }
    ],
    labels: {
        pecs: { en: 'PECS Communication', ar: 'التواصل بالصور' },
        routine: { en: 'Daily Routine', ar: 'الروتين اليومي' },
        emotions: { en: 'Emotions', ar: 'المشاعر' },
        calming: { en: 'Calming Zone', ar: 'منطقة الهدوء' },
        bot: { en: 'My Robot Friend', ar: 'صديقي الروبوت' },
        profile: { en: 'Profile', ar: 'الملف الشخصي' },
        games: { en: 'Games Hub', ar: 'مركز الألعاب' }
    }
};

const gamesHubData = {
    games: [
        { key: 'puzzle', emoji: '🧩', color: '#3B82F6', gradient: 'from-blue-500/20 to-indigo-500/10', path: '/games/puzzle' },
        { key: 'words', emoji: '🦁', color: '#10B981', gradient: 'from-emerald-500/20 to-teal-500/10', path: '/games/words' },
        { key: 'drawing', emoji: '🎨', color: '#F59E0B', gradient: 'from-amber-500/20 to-yellow-500/10', path: '/games/drawing' },
        { key: 'piano', emoji: '🎹', color: '#EC4899', gradient: 'from-pink-500/20 to-rose-500/10', path: '/games/piano' }
    ],
    labels: {
        puzzle: { en: 'Puzzle Arena', ar: 'ساحة الألغاز' },
        words: { en: 'Word Safari', ar: 'سفاري الكلمات' },
        drawing: { en: 'Art Studio', ar: 'استوديو الرسم' },
        piano: { en: 'Melody Piano', ar: 'بيانو الألحان' }
    },
    descriptions: {
        puzzle: { en: 'Match pieces & solve shapes', ar: 'طابق القطع وحل الأشكال' },
        words: { en: 'Discover new words & spelling', ar: 'اكتشف كلمات جديدة وطريقة الهجاء' },
        drawing: { en: 'Express yourself with colors', ar: 'عبر عن نفسك بالألوان' },
        piano: { en: 'Play music & learn notes', ar: 'اعزف الموسيقى وتعرف على النغمات' }
    }
};

const notFoundData = {
    colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F43F5E', '#F59E0B'],
    sugLinks: [
        { path: '/', label: { en: 'Home', ar: 'الرئيسية' }, emoji: '🏠', bg: '#3B82F6' },
        { path: '/choice', label: { en: 'Register', ar: 'إنشاء حساب' }, emoji: '✨', bg: '#8B5CF6' },
        { path: '/login', label: { en: 'Parent Login', ar: 'دخول ولي الأمر' }, emoji: '👨‍👩‍👧', bg: '#10B981' }
    ]
};

export const appDataFallback = {
    en: {
        landingData: getLandingData(false, () => {}),
        choiceData: getChoiceData(false, () => {}),
        dashboardData: getDashboardData(false),
        doctorData: getDoctorData(false)
    },
    ar: {
        landingData: getLandingData(true, () => {}),
        choiceData: getChoiceData(true, () => {}),
        dashboardData: getDashboardData(true),
        doctorData: getDoctorData(true)
    },
    authData: getAuthData(true),
    childHomeData,
    gamesHubData,
    notFoundData
};
