import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/shared/context/AppContext';
import { useAuth } from '@/shared/context/AuthContext';
import MainNavbar from '@/shared/components/MainNavbar';
import { getGameStats } from '@/shared/services/gamesService';
import { Button, Spinner } from '@heroui/react';

import GamesHubHeader from './components/GamesHubHeader';
import GamesHubGrid from './components/GamesHubGrid';
import GamesHubStatsRow from './components/GamesHubStatsRow';

import { useGlobalData } from '@/shared/context/GlobalDataContext';

export default function GamesHub() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const { appData } = useGlobalData();

    useEffect(() => {
        if (currentChild?.childId) {
            setStats(getGameStats(currentChild.childId));
        }
    }, [currentChild]);

    if (!appData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    const { games, labels, descriptions } = appData.gamesHubData;

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0C0D17]' : 'bg-[#F0F4FF]'}`}>
                <div className={`w-full max-w-[400px] p-8 rounded-[40px] border text-center space-y-6 shadow-2xl backdrop-blur-3xl transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-7xl animate-pulse">🎮</div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'سجل دخولك أولاً' : 'Please Log In First'}</h2>
                    <Button radius="full" size="lg" className="w-full bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-500/20" onPress={() => navigate('/child-login')}>
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>

            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-violet-600/10' : 'bg-violet-400/20'}`} />
                <div className={`absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-emerald-600/10' : 'bg-emerald-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-pink-600/10' : 'bg-pink-400/20'}`} />
            </div>

            <MainNavbar userType="child" />

            <main className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-20">
                <GamesHubHeader 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    stats={stats} 
                />

                <GamesHubGrid 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    games={games} 
                    labels={labels} 
                    descriptions={descriptions} 
                />

                <GamesHubStatsRow 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    stats={stats} 
                />
            </main>
        </div>
    );
}
