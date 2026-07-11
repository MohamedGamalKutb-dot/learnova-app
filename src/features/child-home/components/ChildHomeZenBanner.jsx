import { useNavigate } from 'react-router-dom';

export default function ChildHomeZenBanner({ isDark, isArabic, currentChild }) {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate('/calming')}
            className={`group relative mb-10 sm:mb-16 cursor-pointer overflow-hidden rounded-[30px] sm:rounded-[50px] border h-40 sm:h-56 md:h-72 flex items-center transition-all duration-700 shadow-2xl ${isDark ? 'border-white/10 hover:border-indigo-500/40' : 'border-indigo-100 hover:border-indigo-300'}`}
        >
            <div className={`absolute inset-0 z-10 transition-all duration-1000 ${isDark ? 'bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-transparent' : 'bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent'}`} />
            {/* Animated aura */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                <div className={`absolute top-0 right-0 w-[70%] h-full rounded-full blur-[100px] animate-pulse transition-colors duration-1000 ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-400/30'}`} />
            </div>

            <div className="relative z-20 px-6 sm:px-12 md:px-20 flex items-center gap-5 sm:gap-10 w-full">
                <div className={`w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full border flex items-center justify-center text-7xl shadow-2xl animate-float backdrop-blur-3xl transition-all duration-500 overflow-hidden shrink-0 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-indigo-200 shadow-indigo-500/10'}`}>
                    {currentChild.avatar && (currentChild.avatar.startsWith('data:image') || currentChild.avatar.startsWith('http')) ? (
                        <img src={currentChild.avatar} alt="Avatar" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                    ) : (
                        <img src="/icons/emotion_emo_calm.png" alt="Zen" className="w-[70%] h-[70%] object-contain opacity-80"  loading="lazy" decoding="async"/>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className={`text-2xl sm:text-3xl md:text-5xl font-black mb-2 sm:mb-3 tracking-tighter ${isDark ? 'text-white' : 'text-indigo-900'}`}>{isArabic ? 'مساحة الهدوء' : 'The Zen Sanctuary'}</h2>
                    <p className={`font-bold text-sm sm:text-lg max-w-[500px] leading-relaxed transition-colors duration-1000 line-clamp-2 sm:line-clamp-none ${isDark ? 'text-indigo-200/60' : 'text-indigo-600/60'}`}>
                        {isArabic ? 'استرخِ في عالم من السكينة والتمارين المصممة خصيصاً لمساعدتك على التركيز.' : 'Reconnect with your inner peace in a world designed for ultimate calm and focus.'}
                    </p>
                </div>
                <div className={`hidden lg:flex w-20 h-20 rounded-full border items-center justify-center text-3xl group-hover:scale-110 transition-all duration-500 backdrop-blur-3xl ${isDark ? 'bg-white/10 border-white/20 text-white group-hover:bg-indigo-500' : 'bg-white/90 border-indigo-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    {isArabic ? '←' : '→'}
                </div>
            </div>
        </div>
    );
}
