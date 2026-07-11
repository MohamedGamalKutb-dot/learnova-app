import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GamesHubGrid({ isDark, isArabic, games, labels, descriptions }) {
    const navigate = useNavigate();
    const [hoveredGame, setHoveredGame] = useState(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {games.map((game, i) => {
                const isHovered = hoveredGame === game.key;
                return (
                    <motion.div
                        key={game.key}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Card
                            isPressable
                            onPress={() => navigate(game.path)}
                            onMouseEnter={() => setHoveredGame(game.key)}
                            onMouseLeave={() => setHoveredGame(null)}
                            className={`group relative h-[200px] sm:h-[240px] md:h-[280px] rounded-[30px] sm:rounded-[40px] border overflow-hidden transition-all duration-700 hover:translate-y-[-8px] shadow-2xl backdrop-blur-3xl ${isDark ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20' : 'bg-white/80 border-indigo-100 hover:bg-white hover:border-indigo-300'}`}
                        >
                            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                            <CardBody className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full">
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[28px] border flex items-center justify-center text-4xl sm:text-5xl transition-all duration-700 backdrop-blur-2xl ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-indigo-100'} ${isHovered ? 'scale-110 rotate-6 shadow-xl' : ''}`}>
                                    <div className={`absolute inset-0 rounded-[28px] opacity-20 blur-2xl transition-opacity duration-700 ${isHovered ? 'opacity-50' : 'opacity-0'}`} style={{ backgroundColor: game.color }} />
                                    <span className="relative z-10">{game.emoji}</span>
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <div className={`text-[8px] sm:text-[10px] uppercase tracking-[0.4em] font-black transition-colors duration-1000 ${isDark ? 'opacity-30 text-white' : 'opacity-50 text-indigo-900'}`}>{game.key}</div>
                                    <h3 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight group-hover:translate-x-2 transition-transform duration-500 ${isDark ? 'text-white/90 group-hover:text-white' : 'text-indigo-900'}`}>
                                        {isArabic ? labels[game.key].ar : labels[game.key].en}
                                    </h3>
                                    <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {isArabic ? descriptions[game.key].ar : descriptions[game.key].en}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
