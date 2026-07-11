import { Card, CardBody } from '@heroui/react';
import { useState } from 'react';

export default function PecsItemsGrid({ isDark, isArabic, items, selectedCategory, addToSentence }) {
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <Card 
                    key={item.id} 
                    isPressable 
                    onPress={() => addToSentence(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`rounded-[25px] sm:rounded-[40px] border transition-all duration-500 backdrop-blur-md w-full ${
                        isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white/80 border-indigo-50 shadow-sm'
                    } ${hoveredItem === item.id ? 'scale-[1.01] border-indigo-500/30 shadow-2xl' : ''}`}
                    style={{ 
                        animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s both`
                    }}>
                    <CardBody className="p-4 sm:p-5 md:p-7 flex flex-row items-center gap-4 sm:gap-8 md:gap-12">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[20px] sm:rounded-[30px] md:rounded-[35px] flex items-center justify-center text-6xl shrink-0 transition-all duration-500 overflow-hidden ${
                            isDark ? 'bg-white/5' : 'bg-indigo-50/70'
                        } ${hoveredItem === item.id ? 'rotate-6 scale-110' : ''}`}>
                            <img src={item.category === 'emotions' ? `/icons/emotion_${item.id}.png` : `/icons/pecs_${item.id}.png`} 
                                alt="" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { 
                                    if (e.target.src.includes('pecs_') || e.target.src.includes('emotion_')) {
                                        e.target.src = `/icons/${item.category}_cat.png`; 
                                    } else {
                                        e.target.style.display = 'none'; 
                                        e.target.nextSibling.style.display = 'flex'; 
                                    }
                                }}
                            />
                            <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">{item.emoji}</span>
                        </div>
                        <div className="flex-1 text-left rtl:text-right min-w-0">
                            <h3 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-indigo-100' : 'text-indigo-920'}`}>
                                {isArabic ? item.labelAr : item.label}
                            </h3>
                            <div className="flex items-center gap-2 mt-3 opacity-40">
                                <span className="text-[12px] font-black uppercase tracking-widest">{selectedCategory}</span>
                            </div>
                        </div>
                        <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            hoveredItem === item.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-indigo-500/10 text-indigo-500 opacity-20'
                        }`}>
                            <span className="text-2xl sm:text-4xl font-black">+</span>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
