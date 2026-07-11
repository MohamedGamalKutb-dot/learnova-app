import { Button } from '@heroui/react';

export default function WordGameControls({ isDark, isArabic, setSelectedIndices, setAnswer, setIsCorrect, setShowResult, handleSkip, loadNewWord }) {
    return (
        <div className="flex justify-center gap-3">
            <Button
                radius="full"
                variant="bordered"
                className={`font-bold ${isDark ? 'border-white/20 text-slate-300' : 'border-emerald-200 text-emerald-600'}`}
                onPress={() => {
                    setSelectedIndices([]);
                    setAnswer([]);
                    setIsCorrect(null);
                    setShowResult(false);
                }}
            >
                🔄 {isArabic ? 'مسح' : 'Clear'}
            </Button>
            <Button
                radius="full"
                variant="bordered"
                className={`font-bold ${isDark ? 'border-white/20 text-slate-300' : 'border-slate-200 text-slate-500'}`}
                onPress={handleSkip}
            >
                ⏭️ {isArabic ? 'تخطي' : 'Skip'}
            </Button>
            <Button
                radius="full"
                variant="bordered"
                className={`font-bold ${isDark ? 'border-white/20 text-slate-300' : 'border-emerald-200 text-emerald-600'}`}
                onPress={loadNewWord}
            >
                🔀 {isArabic ? 'كلمة جديدة' : 'New Word'}
            </Button>
        </div>
    );
}
