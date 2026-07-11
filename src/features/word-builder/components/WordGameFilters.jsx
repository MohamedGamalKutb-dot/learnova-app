import { motion } from 'framer-motion';
import { Chip } from '@heroui/react';

export default function WordGameFilters({ isArabic, wordGameConfig, difficulty, setDifficulty, difficultyLabels, words, category, setCategory, categoryLabels }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
        >
            {/* Difficulty chips */}
            {Object.keys(wordGameConfig.DIFFICULTY || {}).map(d => (
                <Chip
                    key={d}
                    variant={difficulty === d ? 'solid' : 'bordered'}
                    color={difficulty === d ? 'success' : 'default'}
                    className="cursor-pointer font-bold"
                    onClick={() => setDifficulty(d)}
                >
                    {difficultyLabels[d]}
                </Chip>
            ))}
            <span className={`mx-2 self-center text-xs opacity-30`}>|</span>
            {/* Category chips */}
            <Chip
                variant={category === null ? 'solid' : 'bordered'}
                color={category === null ? 'primary' : 'default'}
                className="cursor-pointer font-bold"
                onClick={() => setCategory(null)}
            >
                {isArabic ? 'الكل' : 'All'}
            </Chip>
            {Object.keys(words || {}).map(cat => (
                <Chip
                    key={cat}
                    variant={category === cat ? 'solid' : 'bordered'}
                    color={category === cat ? 'primary' : 'default'}
                    className="cursor-pointer font-bold"
                    onClick={() => setCategory(cat)}
                >
                    {categoryLabels[cat]}
                </Chip>
            ))}
        </motion.div>
    );
}
