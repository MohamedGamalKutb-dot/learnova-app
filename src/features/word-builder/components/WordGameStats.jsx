import { motion } from 'framer-motion';

export default function WordGameStats({ isDark, isArabic, stats, accuracy }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-3 mb-6"
        >
            {[
                { label: isArabic ? 'صحيح' : 'Correct', value: stats.correct, icon: '✅', color: isDark ? 'text-emerald-300' : 'text-emerald-600' },
                { label: isArabic ? 'خطأ' : 'Wrong', value: stats.wrong, icon: '❌', color: isDark ? 'text-red-300' : 'text-red-500' },
                { label: isArabic ? 'النقاط' : 'Score', value: stats.score, icon: '⭐', color: isDark ? 'text-amber-300' : 'text-amber-500' },
                { label: isArabic ? 'النسبة' : 'Accuracy', value: `${accuracy}%`, icon: '📊', color: isDark ? 'text-blue-300' : 'text-blue-500' },
            ].map((s, i) => (
                <div key={i} className={`p-3 sm:p-4 rounded-[18px] border backdrop-blur-2xl text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-emerald-100'}`}>
                    <div className="text-lg">{s.icon}</div>
                    <div className={`text-lg sm:text-xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold opacity-40">{s.label}</div>
                </div>
            ))}
        </motion.div>
    );
}
