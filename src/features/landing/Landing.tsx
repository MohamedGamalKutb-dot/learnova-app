import { useNavigate } from 'react-router-dom';
import { useApp } from '@/shared/context/AppContext';
import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { useGlobalData } from '@/shared/context/GlobalDataContext';

import LandingNavbar from './components/LandingNavbar';
import LandingHero from './components/LandingHero';
import LandingLoginSection from './components/LandingLoginSection';
import LandingAboutSection from './components/LandingAboutSection';
import LandingTipsSection from './components/LandingTipsSection';
import LandingToolsSection from './components/LandingToolsSection';
import LandingFooter from './components/LandingFooter';

export default function Landing() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const [menuOpen, setMenuOpen] = useState(false);
    const { appData } = useGlobalData();

    if (!appData) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" color="primary" /></div>;

    const { T, navIds, loginCards, heroCards } = appData[isArabic ? 'ar' : 'en'].landingData;

    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    return (
        <div className={`font-jakarta ${darkBg} ${darkTxt} overflow-x-hidden transition-colors duration-300 min-h-screen`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            <LandingNavbar 
                isDark={isDark} 
                isArabic={isArabic} 
                T={T} 
                navIds={navIds} 
                navigate={navigate} 
                scrollTo={scrollTo} 
                menuOpen={menuOpen} 
                setMenuOpen={setMenuOpen} 
            />

            <LandingHero 
                isDark={isDark} 
                isArabic={isArabic} 
                T={T} 
                heroCards={heroCards} 
                scrollTo={scrollTo} 
            />

            <LandingLoginSection 
                isDark={isDark} 
                T={T} 
                loginCards={loginCards} 
                navigate={navigate} 
            />

            <LandingAboutSection 
                isDark={isDark} 
                T={T} 
            />

            <LandingTipsSection 
                isDark={isDark} 
                T={T} 
            />

            <LandingToolsSection 
                isDark={isDark} 
                T={T} 
            />

            {/* CTA BANNER */}
            <div className="bg-gradient-to-br from-p600 via-p700 to-[#1e3a8a] py-16 md:py-20 px-5 md:px-14 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(255,255,255,.05)_0%,transparent_70%)]" />
                <h2 className="text-[clamp(24px,3vw,40px)] font-extrabold text-white mb-3 relative">{T.ctah2}</h2>
                <p className="text-white/75 text-base mb-8 relative">{T.ctap}</p>
                <Button radius="lg" className="relative bg-white text-p700 py-3.5 px-[30px] text-[15px] font-bold font-jakarta shadow-[0_6px_24px_rgba(0,0,0,.18)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,0,0,.24)]"
                    onPress={() => navigate('/choice')}>{T.ctabtn}</Button>
            </div>

            <LandingFooter 
                T={T} 
                navigate={navigate} 
            />
            
        </div>
    );
}
