import { useApp } from '@/shared/context/AppContext';
import { useGlobalData } from '@/shared/context/GlobalDataContext';

import ChoiceNavbar from './components/ChoiceNavbar';
import ChoiceHeader from './components/ChoiceHeader';
import ChoiceCards from './components/ChoiceCards';

export default function Choice() {
    const { isDark, isArabic } = useApp();
    const { appData } = useGlobalData();

    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    if (!appData) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

    const { T, cards } = appData[isArabic ? 'ar' : 'en'].choiceData;

    return (
        <div className={`font-jakarta min-h-screen flex flex-col ${darkBg} ${darkTxt} transition-colors duration-300`} dir={isArabic ? 'rtl' : 'ltr'}>
            <ChoiceNavbar isDark={isDark} isArabic={isArabic} />

            <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(59,130,246,.07)_0%,transparent_70%)]" />
                
                <ChoiceHeader T={T} tagBg={tagBg} darkTxt={darkTxt} darkTxt2={darkTxt2} />
                
                <ChoiceCards cards={cards} darkSurf={darkSurf} darkTxt={darkTxt} darkTxt2={darkTxt2} isArabic={isArabic} />
            </main>
        </div>
    );
}
