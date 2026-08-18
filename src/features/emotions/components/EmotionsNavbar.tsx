import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

interface EmotionsNavbarProps {
    isDark: boolean;
    isArabic: boolean;
    isQuizMode: boolean;
    setIsQuizMode: (mode: boolean) => void;
}

export default function EmotionsNavbar({ isDark, isArabic, isQuizMode, setIsQuizMode }: EmotionsNavbarProps) {
    const navigate = useNavigate();

    return (
        <nav className={`fixed top-0 inset-x-0 h-20 z-50 px-8 flex items-center justify-between backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'bg-[#0C0D17]/40 border-white/5' : 'bg-white/40 border-indigo-100'}`}>
            <div className="flex items-center gap-4">
                <Button 
                    isIconOnly 
                    variant="bordered" 
                    radius="full" 
                    size="sm" 
                    className={`text-base ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`} 
                    onPress={() => isQuizMode ? setIsQuizMode(false) : navigate(-1)}
                >
                    {isArabic ? '→' : '←'}
                </Button>
                <div className="flex flex-col text-start">
                    <h1 className={`text-xl font-black leading-none ${isDark ? 'text-rose-100' : 'text-rose-900'} flex items-center gap-2`}>
                        <div className="w-8 h-8 overflow-hidden rounded-lg flex items-center justify-center">
                            <img src="/icons/emotions.png" alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                        </div>
                        {isArabic ? 'مستكشف المشاعر' : 'Emotion Lab'}
                    </h1>
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-40 mt-1">{isArabic ? 'افهم مشاعرك' : 'UNDERSTAND YOURSELF'}</span>
                </div>
            </div>
        </nav>
    );
}
