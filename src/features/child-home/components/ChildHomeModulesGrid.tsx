import { Card, CardBody } from '@heroui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModuleConfig {
    key: string;
    path: string;
    icon: string;
    gradient: string;
    color: string;
}

interface LabelConfig {
    ar: string;
    en: string;
}

interface ChildHomeModulesGridProps {
    isDark: boolean;
    isArabic: boolean;
    modules: ModuleConfig[];
    labels: Record<string, LabelConfig>;
    onOpen: () => void;
}

export default function ChildHomeModulesGrid({ isDark, isArabic, modules, labels, onOpen }: ChildHomeModulesGridProps) {
    const navigate = useNavigate();
    const [hoveredModule, setHoveredModule] = useState<string | null>(null);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
            {modules.map((mod) => {
                const isHovered = hoveredModule === mod.key;
                return (
                    <Card 
                        key={mod.key} 
                        isPressable
                        onPress={() => mod.path === 'modal' ? onOpen() : navigate(mod.path)}
                        onMouseEnter={() => setHoveredModule(mod.key)}
                        onMouseLeave={() => setHoveredModule(null)}
                        className={`group relative h-[220px] sm:h-[280px] md:h-[320px] rounded-[35px] sm:rounded-[50px] md:rounded-[60px] border overflow-hidden transition-all duration-700 hover:translate-y-[-8px] sm:hover:translate-y-[-12px] shadow-2xl backdrop-blur-3xl ${isDark ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20' : 'bg-white/80 border-indigo-100 hover:bg-white hover:border-indigo-300'}`}
                    >
                        {/* Glow layer */}
                        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                        
                        <CardBody className="relative z-10 p-5 sm:p-8 md:p-12 flex flex-col justify-between h-full">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[20px] sm:rounded-[28px] md:rounded-[32px] border flex items-center justify-center transition-all duration-700 backdrop-blur-2xl overflow-hidden ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-indigo-100'} ${isHovered ? 'scale-110 rotate-6 shadow-xl' : ''}`}>
                                <div className={`absolute inset-0 rounded-[32px] opacity-20 blur-2xl transition-opacity duration-700 ${isHovered ? 'opacity-50' : 'opacity-0'}`} style={{ backgroundColor: mod.color }} />
                                <img src={mod.icon} alt={mod.key} className="relative z-10 w-full h-full object-cover"  loading="lazy" decoding="async"/>
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                                <div className={`text-[8px] sm:text-[10px] uppercase tracking-[0.4em] font-black transition-colors duration-1000 ${isDark ? 'opacity-30 text-white' : 'opacity-50 text-indigo-900'}`}>{mod.key}</div>
                                <h3 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight group-hover:translate-x-2 transition-transform duration-500 ${isDark ? 'text-white/90 group-hover:text-white' : 'text-indigo-900'}`}>{isArabic ? labels[mod.key].ar : labels[mod.key].en}</h3>
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
