import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { defaultRoutine, timeOfDayLabels, timeOfDayLabelsAr, availableIcons } from '../data/routineData';
import { Button, Card, CardBody, Navbar, NavbarContent, NavbarItem, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Input } from '@heroui/react';

export default function RoutinePage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { trackRoutineToggle } = useData();
    const { currentChild, updateChildRoutine, updateChildProfile } = useAuth();

    const todayKey = new Date().toLocaleDateString('en-CA');
    const [items, setItems] = useState(() => {
        const history = currentChild?.routineHistory || {};
        const todayData = history[todayKey] || {};
        return defaultRoutine.map(r => ({ ...r, isCompleted: todayData[r.id] || false }));
    });
    const [selectedTime, setSelectedTime] = useState('morning');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', titleAr: '', iconId: 'routine_wake_up', timeOfDay: 'morning', startTime: '' });
    const [hoveredItem, setHoveredItem] = useState(null);

    const filteredItems = items.filter(i => i.timeOfDay === selectedTime);
    const completedCount = items.filter(i => i.isCompleted).length;
    const totalCount = items.length;
    const progress = totalCount > 0 ? completedCount / totalCount : 0;

    useEffect(() => {
        if (currentChild) {
            // Update Global Stats for HomePage
            trackRoutineToggle(completedCount, totalCount);
        }
    }, [items, currentChild?.childId, todayKey, completedCount, totalCount, trackRoutineToggle]);

    const toggleComplete = (id) => {
        const newItems = items.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i);
        setItems(newItems);
        // Instant save trigger
        if (currentChild) {
            const statusMap = {};
            newItems.forEach(item => { if (item.isCompleted) statusMap[item.id] = true; });
            updateChildRoutine(currentChild.childId, todayKey, statusMap);
            trackRoutineToggle(newItems.filter(i => i.isCompleted).length, newItems.length);
        }
    };

    const resetDay = () => { 
        const cleared = items.map(i => ({ ...i, isCompleted: false }));
        setItems(cleared); 
        if (currentChild) {
            updateChildRoutine(currentChild.childId, todayKey, {}); 
            trackRoutineToggle(0, cleared.length);
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

    const historyEntries = Object.entries(currentChild?.routineHistory || {}).sort((a, b) => new Date(b[0]) - new Date(a[0])).slice(0, 5);
    const todDisplay = new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-emerald-600/10' : 'bg-emerald-400/20'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'}`} />
            </div>

            {/* MINIMALIST GLASS NAVBAR */}
            <nav className={`fixed top-0 inset-x-0 h-20 z-50 px-8 flex items-center justify-between backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'bg-[#0C0D17]/40 border-white/5' : 'bg-white/40 border-indigo-100'}`}>
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="bordered" radius="full" size="sm" className={`text-base ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`} onPress={() => navigate(-1)}>
                        {isArabic ? '→' : '←'}
                    </Button>
                    <div className="flex flex-col">
                        <h1 className={`text-xl font-black transition-all duration-1000 leading-none ${isDark ? 'text-emerald-100' : 'text-emerald-900'} flex items-center gap-2`}>
                            <div className="w-8 h-8 overflow-hidden rounded-lg flex items-center justify-center">
                                <img src="/icons/routine.png" alt="" className="w-full h-full object-cover" />
                            </div>
                            {isArabic ? 'الروتين اليومي' : 'Daily Routine'}
                        </h1>
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-40 mt-1">{isArabic ? 'يومي السعيد' : 'MY HAPPY DAY'}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                </div>
            </nav>

            <main className="relative max-w-[1300px] mx-auto px-8 pt-32 pb-32">
                <p className={`text-center text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-40`}>{todDisplay}</p>

                {/* PROGRESS CARD - FULL WIDTH OF CONTAINER */}
                <div className="w-full mb-10">
                    <Card className={`relative overflow-hidden rounded-[40px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                        <CardBody className="p-10">
                            <div className="flex justify-between items-end mb-6 px-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{isArabic ? 'إنجازك اليوم' : "TODAY'S VIBE"}</span>
                                    <h3 className="text-3xl font-black">{progress >= 1 ? (isArabic ? 'بطل خارق! ✨' : 'Hero Mode On! ✨') : (isArabic ? 'استمر يا بطل 🚀' : 'Keep Going! 🚀')}</h3>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-4xl font-black text-emerald-500">{Math.round(progress * 100)}%</span>
                                    <span className="text-[10px] font-black opacity-30">{completedCount}/{totalCount} {isArabic ? 'مهام' : 'TASKS'}</span>
                                </div>
                            </div>
                            <div className={`h-5 rounded-full overflow-hidden p-1.5 ${isDark ? 'bg-white/5' : 'bg-indigo-50/50'}`}>
                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-600 transition-all duration-1000 ease-out" style={{ width: `${progress * 100}%` }} />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* TIME OF DAY SWITCHER */}
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

                {/* ROUTINE TASKS LIST - EXACTLY MATCHING CONTAINER WIDTH */}
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
                            <CardBody className="p-6 flex flex-row items-center gap-8">
                                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-4xl shrink-0 transition-all duration-500 overflow-hidden ${
                                    item.isCompleted ? 'bg-emerald-500 text-white rotate-12 scale-110' : (isDark ? 'bg-white/5' : 'bg-indigo-50/50')
                                }`}>
                                    {item.isCompleted ? <img src="/icons/quiz_correct.png" alt="" className="w-10 h-10 object-contain" /> : (
                                        <>
                                            <img 
                                                src={`/icons/${item.id.includes('custom_') ? item.iconId : `routine_${item.id}`}.png`} 
                                                alt="" 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                            <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">{item.emoji}</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex-1 text-left rtl:text-right">
                                    <div className={`text-2xl font-black tracking-tight transition-all ${item.isCompleted ? 'opacity-40 line-through' : ''}`}>
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

                {/* HISTORY SECTION */}
                {historyEntries.length > 0 && (
                    <div className="mt-20 space-y-8 w-full">
                        <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'سجل الأبطال' : 'HERO HISTORY'}</h3>
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar touch-pan-x px-2">
                            {historyEntries.map(([date, tasks]) => {
                                const count = Object.keys(tasks || {}).length;
                                const pct = Math.round((count / defaultRoutine.length) * 100);
                                return (
                                    <Card key={date} className={`min-w-[180px] rounded-[35px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white/40 border-indigo-50'}`}>
                                        <CardBody className="p-8 flex flex-col items-center gap-3">
                                            <span className="text-[11px] font-black opacity-30 uppercase tracking-widest">{date.split('-').slice(1).reverse().join('/')}</span>
                                            <span className={`text-3xl font-black ${pct >= 100 ? 'text-emerald-500' : 'text-indigo-500'}`}>{pct}%</span>
                                            <span className="text-[10px] font-black tracking-[0.2em] opacity-40 uppercase">{count} {isArabic ? 'تمت' : 'TASKS'}</span>
                                        </CardBody>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>


            {/* ADD ACTIVITY MODAL */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md" backdrop="blur" 
                classNames={{ 
                    base: `backdrop-blur-3xl border rounded-[50px] overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-indigo-100'}`,
                    backdrop: 'bg-emerald-950/40 backdrop-blur-sm'
                }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={`flex flex-col gap-1 text-center justify-center w-full mt-6 font-black text-xl ${isDark ? 'text-emerald-100' : 'text-emerald-900'}`}>
                                {isArabic ? 'نشاط جديد' : 'New Activity'}
                            </ModalHeader>
                            <ModalBody className="pb-8 pt-4 px-8 space-y-6">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 ml-2`}>{isArabic ? 'اختر رمز' : 'CHOOSE ICON'}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableIcons.map(iconObj => (
                                            <Button key={iconObj.id} isIconOnly radius="xl" variant={newItem.iconId === iconObj.id ? "flat" : "bordered"} onPress={() => setNewItem(p => ({ ...p, iconId: iconObj.id, emoji: iconObj.emoji }))}
                                                className={`h-12 w-12 p-1 overflow-hidden transition-all ${newItem.iconId === iconObj.id ? 'scale-110 bg-emerald-500/20 border-emerald-500' : `opacity-40 ${isDark ? 'border-white/10' : 'border-indigo-100'}`}`}>
                                                <img 
                                                    src={`/icons/${iconObj.id}.png`} 
                                                    alt="" 
                                                    className="w-full h-full object-cover" 
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                />
                                                <span style={{ display: 'none' }} className="text-xl">{iconObj.emoji}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Input variant="underlined" label={isArabic ? 'اسم النشاط' : 'Activity Name'} value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                                        classNames={{ label: "font-black text-[10px] opacity-40 uppercase tracking-widest" }} />
                                    <Input variant="underlined" label={isArabic ? 'الوقت (اختياري)' : 'Time (Optional)'} placeholder="08:00 AM" value={newItem.startTime} onChange={e => setNewItem(p => ({ ...p, startTime: e.target.value }))}
                                        classNames={{ label: "font-black text-[10px] opacity-40 uppercase tracking-widest" }} />
                                </div>

                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 ml-2`}>{isArabic ? 'فترة اليوم' : 'DAY PERIOD'}</p>
                                    <div className="flex gap-2">
                                        {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                                            <Button key={tod} radius="full" size="sm" onPress={() => setNewItem(p => ({ ...p, timeOfDay: tod }))}
                                                variant={newItem.timeOfDay === tod ? "solid" : "bordered"}
                                                className={`flex-1 font-black text-[9px] tracking-widest uppercase transition-all ${newItem.timeOfDay === tod ? 'bg-indigo-500 text-white shadow-lg' : 'opacity-40'}`}>
                                                {(isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]).split(' ')[0]}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="pb-10 pt-4 px-8 flex gap-3">
                                <Button radius="full" size="lg" onPress={addItem} className="flex-1 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-black text-sm shadow-xl shadow-emerald-500/20">
                                    {isArabic ? 'إضافة للجدول' : 'ADD TO SCHEDULE'}
                                </Button>
                                <Button radius="full" size="lg" variant="light" onPress={onClose} className="font-black text-xs opacity-40">
                                    {isArabic ? 'إلغاء' : 'CANCEL'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
