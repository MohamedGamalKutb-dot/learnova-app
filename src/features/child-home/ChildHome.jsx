import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/context/AppContext';
import { useAuth } from '../../shared/context/AuthContext';
import { useData } from '../../shared/context/DataContext';
import MainNavbar from '../../shared/components/MainNavbar';
import { Button, useDisclosure } from '@heroui/react';

import ChildHomeGreeting from './components/ChildHomeGreeting';
import ChildHomeZenBanner from './components/ChildHomeZenBanner';
import ChildHomeModulesGrid from './components/ChildHomeModulesGrid';
import ChildHomeBotModal from './components/ChildHomeBotModal';



import { useGlobalData } from '../../shared/context/GlobalDataContext';
import { Spinner } from '@heroui/react';

export default function ChildHome() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();
    const { routineCompletion } = useData();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { appData } = useGlobalData();

    if (!appData) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" color="primary" /></div>;

    const { modules: rawModules, labels } = appData.childHomeData;
    const modules = rawModules.filter(mod => mod.key !== 'profile');

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0C0D17]' : 'bg-[#F0F4FF]'}`}>
                <div className={`w-full max-w-[400px] p-8 rounded-[40px] border text-center space-y-6 shadow-2xl backdrop-blur-3xl transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-7xl animate-pulse">🌌</div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'سجل دخولك يا بطل' : 'Welcome Back, Hero'}</h2>
                    <Button radius="full" size="lg" className="w-full bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-500/20" onPress={() => navigate('/child-login')}>
                        {isArabic ? 'دخول الطفل' : 'Log In'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'}`} />
            </div>

            <MainNavbar userType="child" />

            <main className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-20">
                <ChildHomeGreeting 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    currentChild={currentChild} 
                    routineCompletion={routineCompletion} 
                />

                <ChildHomeZenBanner 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    currentChild={currentChild} 
                />

                <ChildHomeModulesGrid 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    modules={modules} 
                    labels={labels} 
                    onOpen={onOpen} 
                />
            </main>

            <ChildHomeBotModal 
                isOpen={isOpen} 
                onClose={onClose} 
                isDark={isDark} 
            />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(2deg); } }
                .animate-float { animation: float 7s ease-in-out infinite; }
                
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: ${isDark ? '#0C0D17' : '#F5F8FF'}; }
                ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}; }
            `}</style>
        </div>
    );
}
