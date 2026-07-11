import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

export default function CalmingNavbar({ isDark, isArabic, currentChild }) {
    const navigate = useNavigate();

    return (
        <nav className={`fixed top-0 inset-x-0 h-20 z-50 px-8 flex items-center justify-between backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'bg-[#05060D]/40 border-white/5' : 'bg-white/40 border-indigo-100'}`}>
            <div className="flex items-center gap-4">
                <Button isIconOnly variant="bordered" radius="full" size="sm" className={`text-base ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`} onPress={() => navigate(-1)}>
                    {isArabic ? '→' : '←'}
                </Button>
                <div className="flex flex-col text-start">
                    <h1 className={`text-xl font-black leading-none ${isDark ? 'text-indigo-100' : 'text-indigo-900'} flex items-center gap-2`}>
                        <div className="w-8 h-8 rounded-full border overflow-hidden shrink-0">
                            {currentChild?.avatar && (currentChild.avatar.startsWith('data:image') || currentChild.avatar.startsWith('http')) ? (
                                <img src={currentChild.avatar} alt="Avatar" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-500/20 text-xs">{currentChild?.avatar || '🧘'}</div>
                            )}
                        </div>
                        {isArabic ? 'مساحة السكينة' : 'Serenity Space'}
                    </h1>
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-40 mt-1">{isArabic ? 'تنفس، استرخِ، ركز' : 'BREATHE, RELAX, FOCUS'}</span>
                </div>
            </div>
        </nav>
    );
}
