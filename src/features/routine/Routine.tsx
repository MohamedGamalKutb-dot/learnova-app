import { useState, useEffect } from 'react';
import { useApp } from '@/shared/context/AppContext';
import { useData } from '@/shared/context/DataContext';
import { useAuth } from '@/shared/context/AuthContext';
import { useGlobalData } from '@/shared/context/GlobalDataContext';
import { Spinner } from '@heroui/react';

import RoutineNavbar from './components/RoutineNavbar';
import RoutineProgress from './components/RoutineProgress';
import RoutineTimeSwitcher from './components/RoutineTimeSwitcher';
import RoutineTasksList from './components/RoutineTasksList';
import RoutineHistory from './components/RoutineHistory';
import RoutineAddModal from './components/RoutineAddModal';

export default function Routine() {
    const { isDark, isArabic } = useApp();
    const { trackRoutineToggle } = useData();
    const { currentChild, updateChildRoutine, updateChildProfile } = useAuth();

    const { routine, isLoading } = useGlobalData();
    const { defaultRoutine, timeOfDayLabels, timeOfDayLabelsAr, availableIcons } = routine || {};

    const todayKey = new Date().toLocaleDateString('en-CA');
    const [items, setItems] = useState<any[]>([]);
    const [selectedTime, setSelectedTime] = useState('morning');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', titleAr: '', iconId: 'routine_wake_up', timeOfDay: 'morning', startTime: '' });

    // Initialize items from Firebase data — items are later mutated by toggleComplete/resetDay
    useEffect(() => {
        if (!isLoading && defaultRoutine) {
            const history = currentChild?.routineHistory || {};
            const todayData = history[todayKey] || {};
            const customItems = currentChild?.customRoutineItems || [];
            const allTasks = [...defaultRoutine, ...customItems];
            setItems(allTasks.map(r => ({ ...r, isCompleted: todayData[r.id] || false }))); 
        }
    }, [isLoading, defaultRoutine, currentChild, todayKey]);

    const filteredItems = items.filter(i => i.timeOfDay === selectedTime);
    const completedCount = items.filter(i => i.isCompleted).length;
    const totalCount = items.length;
    const progress = totalCount > 0 ? completedCount / totalCount : 0;

    const toggleComplete = (id: string) => {
        const newItems = items.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i);
        setItems(newItems);
        // Instant save trigger
        if (currentChild) {
            const statusMap: Record<string, boolean> = {};
            newItems.forEach(item => { if (item.isCompleted) statusMap[item.id] = true; });
            if (updateChildRoutine) updateChildRoutine(currentChild.childId, todayKey, statusMap);
            if (trackRoutineToggle) trackRoutineToggle(newItems.filter(i => i.isCompleted).length, newItems.length);
        }
    };

    const resetDay = () => { // eslint-disable-line @typescript-eslint/no-unused-vars
        const cleared = items.map(i => ({ ...i, isCompleted: false }));
        setItems(cleared); 
        if (currentChild) {
            if (updateChildRoutine) updateChildRoutine(currentChild.childId, todayKey, {}); 
            if (trackRoutineToggle) trackRoutineToggle(0, cleared.length);
        }
    };

    const addItem = () => {
        if (!newItem.title) return;
        const freshItem = { ...newItem, id: `custom_${Date.now()}`, titleAr: newItem.titleAr || newItem.title, isCompleted: false };
        const newItems = [...items, freshItem];
        setItems(newItems);
        
        // Save custom item definition to child profile permanently
        if (currentChild && updateChildProfile) {
            const currentCustom = currentChild.customRoutineItems || [];
            updateChildProfile({ customRoutineItems: [...currentCustom, freshItem] });
        }

        setShowAddModal(false);
        setNewItem({ title: '', titleAr: '', iconId: 'routine_wake_up', timeOfDay: 'morning', startTime: '' });
    };

    const historyEntries = Object.entries(currentChild?.routineHistory || {}).sort((a: any, b: any) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).slice(0, 5);
    const todDisplay = new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (isLoading || !routine) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-emerald-600/10' : 'bg-emerald-400/20'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'}`} />
            </div>

            <RoutineNavbar isDark={isDark} isArabic={isArabic} />

            <main className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-32">
                <p className={`text-center text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-40`}>{todDisplay}</p>

                <RoutineProgress 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    progress={progress} 
                    completedCount={completedCount} 
                    totalCount={totalCount} 
                />

                <RoutineTimeSwitcher 
                    isDark={isDark}
                    isArabic={isArabic}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    timeOfDayLabels={timeOfDayLabels}
                    timeOfDayLabelsAr={timeOfDayLabelsAr}
                />

                <RoutineTasksList 
                    isDark={isDark}
                    isArabic={isArabic}
                    filteredItems={filteredItems}
                    toggleComplete={toggleComplete}
                />

                <RoutineHistory 
                    isDark={isDark}
                    isArabic={isArabic}
                    historyEntries={historyEntries}
                    defaultRoutineLength={defaultRoutine ? defaultRoutine.length : 1}
                />
            </main>

            <RoutineAddModal 
                isDark={isDark}
                isArabic={isArabic}
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                newItem={newItem}
                setNewItem={setNewItem}
                addItem={addItem}
                availableIcons={availableIcons}
                timeOfDayLabels={timeOfDayLabels}
                timeOfDayLabelsAr={timeOfDayLabelsAr}
            />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
