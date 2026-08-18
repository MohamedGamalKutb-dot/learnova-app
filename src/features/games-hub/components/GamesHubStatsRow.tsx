import { motion } from 'framer-motion';

interface GamesHubStatsRowProps {
    isDark: boolean;
    isArabic: boolean;
    stats: any;
}

export default function GamesHubStatsRow({ isDark, isArabic, stats }: GamesHubStatsRowProps) {
    if (!stats) return null;

    const statItems = [
        { label: isArabic ? 'بازل مكتمل' : 'Puzzles Done', value: stats.puzzleCompleted, icon: '🧩' },
        { label: isArabic ? 'كلمات صحيحة' : 'Words Correct', value: stats.wordCorrect, icon: '✅' },
        { label: isArabic ? 'رسومات' : 'Drawings', value: stats.drawingSaved, icon: '🖼️' },
        { label: isArabic ? 'نغمات' : 'Notes Played', value: stats.pianoTotalNotes, icon: '🎵' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
            {statItems.map((stat, i) => (
                <div key={i} className={`p-5 rounded-[24px] border backdrop-blur-2xl text-center transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-indigo-900'}`}>{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">{stat.label}</div>
                </div>
            ))}
        </motion.div>
    );
}
