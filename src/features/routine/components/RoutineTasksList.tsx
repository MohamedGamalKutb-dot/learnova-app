import { Card, CardBody } from '@heroui/react';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface RoutineTasksListProps {
    isDark: boolean;
    isArabic: boolean;
    filteredItems: any[];
    toggleComplete: (id: string) => void;
}

export default function RoutineTasksList({ isDark, isArabic, filteredItems, toggleComplete }: RoutineTasksListProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <div className="space-y-4 w-full">
            {filteredItems.map((item, index) => (
                <Card 
                    key={item.id} 
                    isPressable 
                    onPress={() => toggleComplete(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`rounded-[35px] border transition-all duration-500 backdrop-blur-md overflow-hidden w-full ${
                        item.isCompleted 
                        ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-100')
                        : (isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white/80 border-indigo-50')
                    } ${hoveredItem === item.id && !item.isCompleted ? 'scale-[1.01] border-indigo-500/30 shadow-xl' : ''}`}
                    style={{ 
                        animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s both`
                    }}>
                    <CardBody className="p-4 sm:p-5 md:p-6 flex flex-row items-center gap-4 sm:gap-8">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[24px] flex items-center justify-center text-4xl shrink-0 transition-all duration-500 overflow-hidden ${
                            item.isCompleted ? 'bg-emerald-500 text-white rotate-12 scale-110' : (isDark ? 'bg-white/5' : 'bg-indigo-50/50')
                        }`}>
                            {item.isCompleted ? <FaCheckCircle className="w-10 h-10 text-white" /> : (
                                <>
                                    <img src={`/icons/${item.id.includes('custom_') ? item.iconId : `routine_${item.id}`}.png`} 
                                        alt="" 
                                        className="w-full h-full object-cover" 
                                        onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                    <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">{item.emoji}</span>
                                </>
                            )}
                        </div>
                        <div className="flex-1 text-left rtl:text-right">
                            <div className={`text-lg sm:text-2xl font-black tracking-tight transition-all ${item.isCompleted ? 'opacity-40 line-through' : ''}`}>
                                {isArabic ? item.titleAr : item.title}
                            </div>
                            {item.startTime && (
                                <div className={`text-[12px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2 mt-1`}>
                                    <span className="scale-125">🕐</span> {item.startTime}
                                </div>
                            )}
                        </div>
                        <div className={`w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                            item.isCompleted ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' : 'bg-transparent border-indigo-200 opacity-20'
                        }`}>
                            {item.isCompleted && <span className="text-white font-black text-lg">L</span>}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
