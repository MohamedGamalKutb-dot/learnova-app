import { Card, CardBody, Button } from '@heroui/react';
import { FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import EmotionsHistory from './EmotionsHistory';

interface EmotionsQuizResultProps {
    isDark: boolean;
    isArabic: boolean;
    accuracy: number;
    correctAnswers: number;
    totalAttempts: number;
    startQuiz: () => void;
    setIsQuizMode: (mode: boolean) => void;
    historyEntries: [string, any][];
}

export default function EmotionsQuizResult({ isDark, isArabic, accuracy, correctAnswers, totalAttempts, startQuiz, setIsQuizMode, historyEntries }: EmotionsQuizResultProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12 animate-appearance-in">
            {/* Main Result Card */}
            <Card className={`w-full max-w-[600px] rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl p-10 flex flex-col items-center ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/95 border-indigo-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]'}`}>
                <CardBody className="items-center gap-6 p-0">
                    <div className="w-32 h-32 animate-bounce mb-2 overflow-hidden flex items-center justify-center">
                        <img src={`/icons/${accuracy >= 0.8 ? 'quiz_excellent.png' : accuracy >= 0.5 ? 'quiz_good.png' : 'quiz_try.png'}`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <span style={{ display: 'none' }} className="text-8xl">{accuracy >= 0.8 ? '🎉' : accuracy >= 0.5 ? '👏' : '💪'}</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                        {accuracy >= 0.8 ? (isArabic ? 'رائع يا بطل!' : 'Amazing, Hero!') : (isArabic ? 'محاولة جيدة!' : 'Good Effort!')}
                    </h2>

                    <div className="grid grid-cols-3 gap-4 w-full my-6">
                        <div className={`p-4 rounded-[25px] flex flex-col items-center border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                            <FaCheckCircle className="w-8 h-8 mb-2 text-emerald-500" />
                            <span className="text-2xl font-black text-emerald-500">{correctAnswers}</span>
                            <span className="text-[9px] font-black uppercase opacity-40">{isArabic ? 'صحيح' : 'CORRECT'}</span>
                        </div>
                        <div className={`p-4 rounded-[25px] flex flex-col items-center border ${isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'}`}>
                            <FaTimesCircle className="w-8 h-8 mb-2 text-rose-500" />
                            <span className="text-2xl font-black text-rose-500">{totalAttempts - correctAnswers}</span>
                            <span className="text-[9px] font-black uppercase opacity-40">{isArabic ? 'خاطئ' : 'WRONG'}</span>
                        </div>
                        <div className={`p-4 rounded-[25px] flex flex-col items-center border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                            <FaChartLine className="w-8 h-8 mb-2 text-indigo-500" />
                            <span className="text-2xl font-black text-indigo-500">{Math.round(accuracy * 100)}%</span>
                            <span className="text-[9px] font-black uppercase opacity-40">{isArabic ? 'النسبة' : 'PERCENT'}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full mt-2">
                        <Button radius="full" size="lg" onPress={startQuiz} className="flex-1 h-16 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black text-lg shadow-xl shadow-rose-500/20">
                            {isArabic ? 'مرة أخرى' : 'Play Again'}
                        </Button>
                        <Button radius="full" size="lg" variant="bordered" onPress={() => setIsQuizMode(false)} className={`flex-1 h-16 font-black text-lg border-2 ${isDark ? 'border-white/10' : 'border-indigo-100'}`}>
                            {isArabic ? 'خروج' : 'Exit'}
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Previous Results shown below the card */}
            {historyEntries.length > 0 && (
                <EmotionsHistory entries={historyEntries} isDark={isDark} isArabic={isArabic} />
            )}
        </div>
    );
}
