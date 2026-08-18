import { Card, CardBody, Button } from '@heroui/react';
import EmotionsHistory from './EmotionsHistory';

interface EmotionsLearnModeProps {
    isDark: boolean;
    isArabic: boolean;
    currentLevel: number;
    setCurrentLevel: (level: number) => void;
    setCurrentIndex: (index: number) => void;
    startQuiz: () => void;
    currentEmotion: any;
    speak: (text: string) => void;
    prevEmotion: () => void;
    nextEmotion: () => void;
    historyEntries: [string, any][];
}

export default function EmotionsLearnMode({ 
    isDark, 
    isArabic, 
    currentLevel, 
    setCurrentLevel, 
    setCurrentIndex, 
    startQuiz, 
    currentEmotion, 
    speak, 
    prevEmotion, 
    nextEmotion, 
    historyEntries 
}: EmotionsLearnModeProps) {
    if (!currentEmotion || !currentEmotion.id) return null;

    return (
        <div className="space-y-12 animate-appearance-in">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
                {[1, 2, 3].map(level => (
                    <Button key={level} radius="full" size="lg" onPress={() => { setCurrentLevel(level); setCurrentIndex(0); }}
                        variant={currentLevel === level ? "solid" : "bordered"}
                        className={`px-10 h-14 font-black text-xs uppercase tracking-widest transition-all ${currentLevel === level ? 'bg-rose-500 text-white shadow-xl' : `opacity-40 ${isDark ? 'border-white/10' : 'border-indigo-100'}`
                            }`}>
                        {[isArabic ? 'نجم واحد' : 'Level 1', isArabic ? 'نجمتان' : 'Level 2', isArabic ? 'ثلاثة نجوم' : 'Level 3'][level - 1]}
                    </Button>
                ))}
                <Button radius="full" size="lg" onPress={startQuiz} className="h-14 px-10 bg-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-xl ml-auto flex items-center gap-2">
                    <div className="w-6 h-6 overflow-hidden rounded-md flex items-center justify-center">
                        <img src="/icons/games.png" alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                    </div> {isArabic ? 'ابدأ الاختبار' : 'Start Quiz'}
                </Button>
            </div>

            <div className="relative group">
                <Card isPressable onPress={() => speak(isArabic ? currentEmotion.nameAr : currentEmotion.name)}
                    className={`rounded-[40px] sm:rounded-[60px] border transition-all duration-700 backdrop-blur-3xl p-6 sm:p-12 overflow-hidden w-full ${isDark ? 'bg-white/[0.03] border-white/10 shadow-2xl' : 'bg-white border-indigo-100 shadow-xl'}`}>
                    <CardBody className="items-center text-center gap-4 sm:gap-8 relative z-10">
                        <div className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] text-[180px] animate-float transition-all duration-700 group-hover:scale-110 overflow-hidden flex items-center justify-center">
                            <img src={`/icons/emotion_${currentEmotion.id}.png`}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                            <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">{currentEmotion.emoji}</span>
                        </div>
                        <div className="space-y-2 sm:space-y-4">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">{isArabic ? currentEmotion.nameAr : currentEmotion.name}</h2>
                            <p className="text-base sm:text-xl font-bold opacity-60 max-w-[600px] leading-relaxed mx-auto">
                                {isArabic ? currentEmotion.descriptionAr : currentEmotion.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-indigo-500/10 text-indigo-500 font-black text-sm uppercase tracking-widest mt-4">
                            🔊 {isArabic ? 'اضغط للاستماع' : 'TAP TO LISTEN'}
                        </div>
                    </CardBody>
                </Card>

                <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-10 z-20">
                    <Button isIconOnly radius="full" size="lg" onPress={prevEmotion} className="w-10 h-10 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-2xl border border-white/20 text-2xl sm:text-3xl shadow-2xl">←</Button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-10 z-20">
                    <Button isIconOnly radius="full" size="lg" onPress={nextEmotion} className="w-10 h-10 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-2xl border border-white/20 text-2xl sm:text-3xl shadow-2xl">→</Button>
                </div>
            </div>

            {historyEntries.length > 0 && (
                <EmotionsHistory entries={historyEntries} isDark={isDark} isArabic={isArabic} />
            )}
        </div>
    );
}
