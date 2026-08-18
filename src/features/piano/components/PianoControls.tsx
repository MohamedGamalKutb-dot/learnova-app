import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

interface PianoControlsProps {
    isDark: boolean;
    isArabic: boolean;
    isRecording: boolean;
    recording: any[];
    isPlaying: boolean;
    handleStartRecording: () => void;
    handleStopRecording: () => void;
    handlePlayRecording: () => void;
    handleSaveMelody: () => void;
    onMelodiesOpen: () => void;
    savedMelodiesCount: number;
}

export default function PianoControls({ isDark, isArabic, isRecording, recording, isPlaying, handleStartRecording, handleStopRecording, handlePlayRecording, handleSaveMelody, onMelodiesOpen, savedMelodiesCount }: PianoControlsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
        >
            {!isRecording ? (
                <Button radius="full" className="bg-red-500 text-white font-bold shadow-lg shadow-red-500/20" onPress={handleStartRecording}>
                    🔴 {isArabic ? 'تسجيل لحن' : 'Record'}
                </Button>
            ) : (
                <Button radius="full" className="bg-red-600 text-white font-bold animate-pulse shadow-lg shadow-red-500/30" onPress={handleStopRecording}>
                    ⏹️ {isArabic ? `إيقاف (${recording.length} نغمات)` : `Stop (${recording.length} notes)`}
                </Button>
            )}

            {recording.length > 0 && !isRecording && (
                <>
                    <Button
                        radius="full" variant="bordered"
                        className={`font-bold ${isDark ? 'border-white/20 text-slate-300' : 'border-amber-200 text-amber-600'}`}
                        onPress={handlePlayRecording}
                        isLoading={isPlaying}
                    >
                        ▶️ {isArabic ? 'تشغيل' : 'Play'}
                    </Button>
                    <Button
                        radius="full" className="bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20"
                        onPress={handleSaveMelody}
                    >
                        💾 {isArabic ? 'حفظ اللحن' : 'Save Melody'}
                    </Button>
                </>
            )}

            <Button
                radius="full" variant="bordered"
                className={`font-bold ${isDark ? 'border-white/20 text-slate-300' : 'border-amber-200 text-amber-600'}`}
                onPress={onMelodiesOpen}
            >
                🎼 {isArabic ? `ألحاني (${savedMelodiesCount})` : `My Melodies (${savedMelodiesCount})`}
            </Button>
        </motion.div>
    );
}
