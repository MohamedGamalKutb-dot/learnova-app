import { Button } from '@heroui/react';

interface RoutineTimeSwitcherProps {
    isDark: boolean;
    isArabic: boolean;
    selectedTime: string;
    setSelectedTime: (tod: string) => void;
    timeOfDayLabels: Record<string, string>;
    timeOfDayLabelsAr: Record<string, string>;
}

export default function RoutineTimeSwitcher({ isDark, isArabic, selectedTime, setSelectedTime, timeOfDayLabels, timeOfDayLabelsAr }: RoutineTimeSwitcherProps) {
    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8 no-scrollbar touch-pan-x px-2">
            {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                <Button 
                    key={tod} 
                    radius="full" 
                    onPress={() => setSelectedTime(tod)}
                    variant={selectedTime === tod ? "solid" : "bordered"}
                    className={`h-12 px-10 min-w-fit font-black text-[12px] uppercase tracking-widest transition-all duration-500 ${
                        selectedTime === tod
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105'
                        : `${isDark ? 'border-white/10 text-white/50 hover:bg-white/5' : 'border-indigo-100 text-indigo-900/40 hover:bg-indigo-50/50'}`
                    }`}>
                    {isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]}
                </Button>
            ))}
        </div>
    );
}
