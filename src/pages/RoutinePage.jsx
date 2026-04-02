import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { defaultRoutine, timeOfDayLabels, timeOfDayLabelsAr, availableEmojis } from '../data/routineData';
import { Button, Card, CardBody, Navbar, NavbarContent, NavbarItem, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Input } from '@heroui/react';

export default function RoutinePage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild, updateChildRoutine } = useAuth();

    const todayKey = new Date().toLocaleDateString('en-CA');
    const [items, setItems] = useState(() => {
        const history = currentChild?.routineHistory || {};
        const todayData = history[todayKey] || {};
        return defaultRoutine.map(r => ({ ...r, isCompleted: todayData[r.id] || false }));
    });
    const [selectedTime, setSelectedTime] = useState('morning');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', titleAr: '', emoji: '🎯', timeOfDay: 'morning', startTime: '' });
    const [hoveredItem, setHoveredItem] = useState(null);

    const accent = '#10B981';
    const filteredItems = items.filter(i => i.timeOfDay === selectedTime);
    const completedCount = items.filter(i => i.isCompleted).length;
    const totalCount = items.length;
    const progress = totalCount > 0 ? completedCount / totalCount : 0;

    useEffect(() => {
        if (currentChild) {
            const statusMap = {};
            items.forEach(item => { if (item.isCompleted) statusMap[item.id] = true; });
            updateChildRoutine(currentChild.childId, todayKey, statusMap);
        }
    }, [items, currentChild?.childId, todayKey]);

    const toggleComplete = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i));
    const resetDay = () => { setItems(prev => prev.map(i => ({ ...i, isCompleted: false }))); if (currentChild) updateChildRoutine(currentChild.childId, todayKey, {}); };
    const addItem = () => {
        if (!newItem.title) return;
        setItems(prev => [...prev, { ...newItem, id: `custom_${Date.now()}`, titleAr: newItem.titleAr || newItem.title, isCompleted: false }]);
        setShowAddModal(false);
        setNewItem({ title: '', titleAr: '', emoji: '🎯', timeOfDay: 'morning', startTime: '' });
    };

    const historyEntries = Object.entries(currentChild?.routineHistory || {}).sort((a, b) => new Date(b[0]) - new Date(a[0])).slice(0, 5);
    const todDisplay = new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const navBtnCls = `text-base border ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`;

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Navbar */}
            <Navbar maxWidth="lg" className={`py-1 border-b sticky top-0 z-50 backdrop-blur-xl ${isDark ? 'bg-card-dark/95 border-border-dark' : 'bg-white/95 border-border'}`} classNames={{ wrapper: 'px-6 max-w-[800px] flex justify-between gap-3' }}>
                <div className="flex items-center gap-3">
                    <Button isIconOnly size="sm" variant="bordered" className={navBtnCls} onPress={() => navigate(-1)}>←</Button>
                    <h1 className={`m-0 text-lg font-bold flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        📋 {isArabic ? 'الروتين اليومي' : 'Daily Routine'}
                    </h1>
                </div>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button isIconOnly size="sm" variant="bordered" title="Reset" className={navBtnCls} onPress={resetDay}>🔄</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <div className="max-w-[800px] mx-auto py-5 px-6 pb-24">
                <p className={`text-center text-[13px] mb-4 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{todDisplay}</p>

                {/* Progress */}
                <Card className={`mb-5 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}>
                    <CardBody className="p-5">
                        <div className="flex justify-between mb-3 items-center">
                            <span className={`text-[15px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تقدم اليوم' : "Today's Progress"}</span>
                            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/[0.08] py-1 px-3 rounded-lg">{completedCount}/{totalCount}</span>
                        </div>
                        <div className={`h-2 rounded-lg overflow-hidden ${isDark ? 'bg-border-dark' : 'bg-gray-100'}`}>
                            <div className="h-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 transition-[width] duration-500 ease-out" style={{ width: `${progress * 100}%` }} />
                        </div>
                        {progress >= 1 && <p className="text-center text-emerald-500 font-bold mt-2.5 text-sm">🎉 {isArabic ? 'أحسنت! أكملت كل المهام!' : 'Great job! All tasks completed!'}</p>}
                    </CardBody>
                </Card>

                {/* Time Chips */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                        <Button key={tod} radius="xl" size="md" onPress={() => setSelectedTime(tod)}
                            variant={selectedTime === tod ? "solid" : "bordered"}
                            className={`text-[13px] whitespace-nowrap transition-all duration-200 ${selectedTime === tod
                                ? 'bg-emerald-500 text-white border-emerald-500 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.19)]'
                                : `font-medium ${isDark ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-card text-text border-border'}`
                                }`}>
                            {isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]}
                        </Button>
                    ))}
                </div>

                {/* Routine Items */}
                <div className="grid gap-2 min-h-[300px]">
                    {filteredItems.map((item, index) => (
                        <Card key={item.id} isPressable onPress={() => toggleComplete(item.id)}
                            onMouseEnter={() => setHoveredItem(item.id)} onMouseLeave={() => setHoveredItem(null)}
                            className={`border transition-all duration-300 ${isDark ? 'bg-card-dark' : 'bg-card'}`}
                            style={{
                                borderColor: item.isCompleted ? accent : (hoveredItem === item.id ? `${accent}50` : (isDark ? '#21262D' : '#E5E7EB')),
                                opacity: item.isCompleted ? 0.7 : 1,
                                transform: hoveredItem === item.id ? 'translateX(4px)' : 'translateX(0)',
                                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                            }}>
                            <CardBody className="py-3.5 px-4 flex flex-row items-center gap-3.5 w-full">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${item.isCompleted ? 'bg-emerald-500/[0.08]' : (isDark ? 'bg-border-dark' : 'bg-[#F9FAFB]')}`}>{item.emoji}</div>
                                <div className="flex-1 text-left rtl:text-right">
                                    <div className={`text-[15px] font-semibold ${isDark ? 'text-text-dark' : 'text-text'} ${item.isCompleted ? 'line-through' : ''}`}>
                                        {isArabic ? item.titleAr : item.title}
                                    </div>
                                    {item.startTime && <div className={`text-xs mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>🕐 {item.startTime}</div>}
                                </div>
                                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${item.isCompleted ? 'bg-emerald-500 border-emerald-500' : `bg-transparent ${isDark ? 'border-[#30363D]' : 'border-gray-300'}`
                                    }`}>
                                    {item.isCompleted && <span className="text-white text-sm font-bold">✓</span>}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* History */}
                {historyEntries.length > 0 && (
                    <Card className={`mt-5 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                        <CardBody className="p-5">
                            <h3 className={`text-[15px] font-bold mb-3 ${isDark ? 'text-text-dark' : 'text-text'}`}>📊 {isArabic ? 'إحصائيات الأيام السابقة' : 'History Stats'}</h3>
                            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1">
                                {historyEntries.map(([date, tasks]) => {
                                    const count = Object.keys(tasks || {}).length;
                                    const pct = Math.round((count / defaultRoutine.length) * 100);
                                    return (
                                        <Card key={date} className={`min-w-[85px] border shrink-0 ${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`}>
                                            <CardBody className="p-3 flex flex-col items-center gap-1">
                                                <div className={`text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{date.split('-').slice(1).join('/')}</div>
                                                <div className="text-lg font-bold text-emerald-500">{pct}%</div>
                                                <div className={`text-[10px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{count} {isArabic ? 'مهمة' : 'tasks'}</div>
                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>

            {/* FAB */}
            <Button isIconOnly radius="lg" size="lg" onPress={() => setShowAddModal(true)}
                className="fixed z-50 bottom-6 right-6 w-[52px] h-[52px] bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-2xl shadow-[0_4px_16px_rgba(16,185,129,0.25)] flex items-center justify-center transition-transform duration-200 hover:scale-110 pb-1">+</Button>

            {/* Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md" backdrop="blur" classNames={{ base: isDark ? 'bg-card-dark border border-border-dark' : 'bg-card border border-border' }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={`flex flex-col gap-1 text-center justify-center w-full mt-2 font-bold text-xl ${isDark ? 'text-text-dark' : 'text-text'}`}>
                                {isArabic ? '➕ إضافة نشاط جديد' : '➕ Add New Activity'}
                            </ModalHeader>
                            <ModalBody className="pb-4 pt-2">
                                <p className={`font-semibold mb-0 text-[13px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'اختر رمز' : 'Choose Emoji'}</p>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {availableEmojis.map(em => (
                                        <Button key={em} isIconOnly size="sm" variant={newItem.emoji === em ? "solid" : "bordered"} onPress={() => setNewItem(p => ({ ...p, emoji: em }))}
                                            className={`text-xl border ${newItem.emoji === em ? 'border-emerald-500 bg-emerald-500/[0.08] text-emerald-500' : `bg-transparent ${isDark ? 'border-border-dark' : 'border-border'}`}`}>
                                            {em}
                                        </Button>
                                    ))}
                                </div>

                                <Input variant="bordered" radius="lg" value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                                    placeholder={isArabic ? 'اسم النشاط (إنجليزي)' : 'Activity Name (English)'}
                                    classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-emerald-500` }} />
                                <Input variant="bordered" radius="lg" value={newItem.titleAr} onChange={e => setNewItem(p => ({ ...p, titleAr: e.target.value }))}
                                    placeholder={isArabic ? 'اسم النشاط (عربي)' : 'Activity Name (Arabic)'}
                                    classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-emerald-500` }} />
                                <Input variant="bordered" radius="lg" value={newItem.startTime} onChange={e => setNewItem(p => ({ ...p, startTime: e.target.value }))}
                                    placeholder={isArabic ? 'الوقت (مثال: 08:00)' : 'Time (e.g. 08:00)'}
                                    classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-emerald-500` }} />

                                <p className={`font-semibold mt-2 -mb-2 text-[13px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'الفترة' : 'Time of Day'}</p>
                                <div className="flex gap-1.5 mb-2">
                                    {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                                        <Button key={tod} radius="md" size="sm" onPress={() => setNewItem(p => ({ ...p, timeOfDay: tod }))}
                                            variant={newItem.timeOfDay === tod ? "solid" : "bordered"}
                                            className={`flex-1 text-[13px] border px-1 min-w-[60px] ${newItem.timeOfDay === tod
                                                ? 'bg-emerald-500 text-white border-emerald-500 font-bold'
                                                : `bg-transparent ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`
                                                }`}>{(isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]).split(' ')[0]}</Button>
                                    ))}
                                </div>
                            </ModalBody>
                            <ModalFooter className="pt-2 pb-6 w-full flex-row gap-2.5">
                                <Button radius="xl" size="lg" onPress={addItem}
                                    className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-400 text-white font-bold text-[15px]">
                                    {isArabic ? '✅ إضافة' : '✅ Add Activity'}
                                </Button>
                                <Button radius="xl" size="lg" variant="bordered" onPress={onClose}
                                    className={`flex-1 font-semibold ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>
                                    {isArabic ? 'إلغاء' : 'Cancel'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}
