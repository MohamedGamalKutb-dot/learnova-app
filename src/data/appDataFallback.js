import { getLandingData } from './landingData';
import { getAuthData } from './authData';
import { getChoiceData } from './choiceData';
import { getDashboardData } from './dashboardData';
import { getDoctorData } from './doctorData';

const childHomeData = {
    modules: [
        { key: 'pecs', emoji: '🖼️', color: '#4ECDC4', gradient: ['#4ECDC4', '#A8E6CF'], path: '/pecs' },
        { key: 'routine', emoji: '⏰', color: '#FFD166', gradient: ['#FFD166', '#FFDF91'], path: '/routine' },
        { key: 'emotions', emoji: '😊', color: '#6C63FF', gradient: ['#6C63FF', '#8B85FF'], path: '/emotions' },
        { key: 'calming', emoji: '🌟', color: '#118AB2', gradient: ['#118AB2', '#5DBBE6'], path: '/calming' },
        { key: 'bot', emoji: '🤖', color: '#FF6584', gradient: ['#FF6584', '#FF8FA3'], path: 'modal' },
        { key: 'profile', emoji: '👤', color: '#F5C7A9', gradient: ['#F5C7A9', '#F9DCC4'], path: '/profile' },
        { key: 'games', emoji: '🎮', color: '#A78BFA', gradient: ['#A78BFA', '#C4B5FD'], path: '/games-hub' }
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
        { id: 'math-adventure', emoji: '🔢', color: '#3B82F6', gradient: ['#3B82F6', '#60A5FA'], path: '/games/math' },
        { id: 'word-safari', emoji: '🦁', color: '#10B981', gradient: ['#10B981', '#34D399'], path: '/games/words' },
        { id: 'shape-match', emoji: '🟦', color: '#F59E0B', gradient: ['#F59E0B', '#FBBF24'], path: '/games/shapes' }
    ],
    labels: {
        'math-adventure': { en: 'Math Adventure', ar: 'مغامرة الرياضيات' },
        'word-safari': { en: 'Word Safari', ar: 'سفاري الكلمات' },
        'shape-match': { en: 'Shape Match', ar: 'تطابق الأشكال' }
    },
    descriptions: {
        'math-adventure': { en: 'Learn numbers & basic math with fun', ar: 'تعلم الأرقام والرياضيات الأساسية بمرح' },
        'word-safari': { en: 'Discover new words and animals', ar: 'اكتشف كلمات وحيوانات جديدة' },
        'shape-match': { en: 'Match colors and basic shapes', ar: 'طابق الألوان والأشكال الأساسية' }
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
