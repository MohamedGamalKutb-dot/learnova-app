import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { defaultRoutine, timeOfDayLabels, timeOfDayLabelsAr, availableEmojis } from '../data/routineData';

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
    const inputCls = `w-full py-3 px-4 rounded-xl text-sm border outline-none font-[inherit] box-border mb-2.5 ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Navbar */}
            <nav className={`flex items-center gap-3 py-3 px-6 max-w-[800px] mx-auto border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                <button onClick={() => navigate(-1)}
                    className={`w-9 h-9 rounded-[10px] border flex items-center justify-center text-base cursor-pointer ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>←</button>
                <h1 className={`flex-1 text-lg font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    📋 {isArabic ? 'الروتين اليومي' : 'Daily Routine'}
                </h1>
                <button onClick={resetDay} title="Reset"
                    className={`w-9 h-9 rounded-[10px] border flex items-center justify-center text-base cursor-pointer ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>🔄</button>
            </nav>

            <div className="max-w-[800px] mx-auto py-5 px-6">
                <p className={`text-center text-[13px] mb-4 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{todDisplay}</p>

                {/* Progress */}
                <div className={`rounded-2xl p-5 mb-5 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}>
                    <div className="flex justify-between mb-3 items-center">
                        <span className={`text-[15px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تقدم اليوم' : "Today's Progress"}</span>
                        <span className="text-sm font-bold text-emerald-500 bg-emerald-500/[0.08] py-1 px-3 rounded-lg">{completedCount}/{totalCount}</span>
                    </div>
                    <div className={`h-2 rounded-lg overflow-hidden ${isDark ? 'bg-border-dark' : 'bg-gray-100'}`}>
                        <div className="h-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 transition-[width] duration-500 ease-out" style={{ width: `${progress * 100}%` }} />
                    </div>
                    {progress >= 1 && <p className="text-center text-emerald-500 font-bold mt-2.5 text-sm">🎉 {isArabic ? 'أحسنت! أكملت كل المهام!' : 'Great job! All tasks completed!'}</p>}
                </div>

                {/* Time Chips */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                        <button key={tod} onClick={() => setSelectedTime(tod)}
                            className={`py-2.5 px-4 rounded-xl cursor-pointer text-[13px] whitespace-nowrap border transition-all duration-200 ${selectedTime === tod
                                    ? 'bg-emerald-500 text-white border-emerald-500 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.19)]'
                                    : `font-medium ${isDark ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-card text-text border-border'}`
                                }`}>
                            {isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]}
                        </button>
                    ))}
                </div>

                {/* Routine Items */}
                <div className="grid gap-2 min-h-[300px]">
                    {filteredItems.map((item, index) => (
                        <div key={item.id}
                            onMouseEnter={() => setHoveredItem(item.id)} onMouseLeave={() => setHoveredItem(null)}
                            className={`flex items-center gap-3.5 py-3.5 px-4 rounded-[14px] border transition-all duration-300 ${isDark ? 'bg-card-dark' : 'bg-card'}`}
                            style={{
                                borderColor: item.isCompleted ? accent : (hoveredItem === item.id ? `${accent}50` : (isDark ? '#21262D' : '#E5E7EB')),
                                opacity: item.isCompleted ? 0.7 : 1,
                                transform: hoveredItem === item.id ? 'translateX(4px)' : 'translateX(0)',
                                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                            }}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${item.isCompleted ? 'bg-emerald-500/[0.08]' : (isDark ? 'bg-border-dark' : 'bg-[#F9FAFB]')}`}>{item.emoji}</div>
                            <div className="flex-1">
                                <div className={`text-[15px] font-semibold ${isDark ? 'text-text-dark' : 'text-text'} ${item.isCompleted ? 'line-through' : ''}`}>
                                    {isArabic ? item.titleAr : item.title}
                                </div>
                                {item.startTime && <div className={`text-xs mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>🕐 {item.startTime}</div>}
                            </div>
                            <button onClick={() => toggleComplete(item.id)}
                                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer ${item.isCompleted ? 'bg-emerald-500 border-emerald-500' : `bg-transparent ${isDark ? 'border-[#30363D]' : 'border-gray-300'}`
                                    }`}>
                                {item.isCompleted && <span className="text-white text-sm font-bold">✓</span>}
                            </button>
                        </div>
                    ))}
                </div>

                {/* History */}
                {historyEntries.length > 0 && (
                    <div className={`p-5 rounded-2xl border mt-5 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                        <h3 className={`text-[15px] font-bold mb-3 ${isDark ? 'text-text-dark' : 'text-text'}`}>📊 {isArabic ? 'إحصائيات الأيام السابقة' : 'History Stats'}</h3>
                        <div className="flex gap-2.5 overflow-x-auto">
                            {historyEntries.map(([date, tasks]) => {
                                const count = Object.keys(tasks || {}).length;
                                const pct = Math.round((count / defaultRoutine.length) * 100);
                                return (
                                    <div key={date} className={`min-w-[85px] p-3 rounded-xl flex flex-col items-center gap-1 border ${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`}>
                                        <div className={`text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{date.split('-').slice(1).join('/')}</div>
                                        <div className="text-lg font-bold text-emerald-500">{pct}%</div>
                                        <div className={`text-[10px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{count} {isArabic ? 'مهمة' : 'tasks'}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* FAB */}
            <button onClick={() => setShowAddModal(true)}
                className="fixed bottom-6 end-6 w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-emerald-500 to-emerald-400 border-none text-white text-2xl cursor-pointer shadow-[0_4px_16px_rgba(16,185,129,0.25)] flex items-center justify-center transition-transform duration-200 hover:scale-110">+</button>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-6" onClick={() => setShowAddModal(false)}>
                    <div onClick={e => e.stopPropagation()}
                        className={`rounded-[20px] w-full max-w-[440px] p-7 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.1)]'}`}
                        style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                        <h3 className={`text-xl font-bold mb-5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            {isArabic ? '➕ إضافة نشاط جديد' : '➕ Add New Activity'}
                        </h3>

                        <p className={`font-semibold mb-2 text-[13px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'اختر رمز' : 'Choose Emoji'}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {availableEmojis.map(em => (
                                <button key={em} onClick={() => setNewItem(p => ({ ...p, emoji: em }))}
                                    className={`w-10 h-10 rounded-[10px] text-xl cursor-pointer flex items-center justify-center border ${newItem.emoji === em ? 'border-emerald-500 bg-emerald-500/[0.08]' : `bg-transparent ${isDark ? 'border-border-dark' : 'border-border'}`
                                        }`}>{em}</button>
                            ))}
                        </div>

                        <input value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                            placeholder={isArabic ? 'اسم النشاط (إنجليزي)' : 'Activity Name (English)'} className={inputCls} />
                        <input value={newItem.titleAr} onChange={e => setNewItem(p => ({ ...p, titleAr: e.target.value }))}
                            placeholder={isArabic ? 'اسم النشاط (عربي)' : 'Activity Name (Arabic)'} className={inputCls} />
                        <input value={newItem.startTime} onChange={e => setNewItem(p => ({ ...p, startTime: e.target.value }))}
                            placeholder={isArabic ? 'الوقت (مثال: 08:00)' : 'Time (e.g. 08:00)'} className={inputCls} />

                        <p className={`font-semibold mb-2 text-[13px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'الفترة' : 'Time of Day'}</p>
                        <div className="flex gap-1.5 mb-5">
                            {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                                <button key={tod} onClick={() => setNewItem(p => ({ ...p, timeOfDay: tod }))}
                                    className={`flex-1 py-2.5 px-1 rounded-[10px] cursor-pointer text-[13px] border ${newItem.timeOfDay === tod
                                            ? 'bg-emerald-500 text-white border-emerald-500 font-bold'
                                            : `bg-transparent ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`
                                        }`}>{(isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]).split(' ')[0]}</button>
                            ))}
                        </div>

                        <div className="flex gap-2.5">
                            <button onClick={addItem}
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white border-none cursor-pointer font-bold text-[15px]">
                                {isArabic ? '✅ إضافة' : '✅ Add Activity'}
                            </button>
                            <button onClick={() => setShowAddModal(false)}
                                className={`py-3.5 px-5 rounded-xl bg-transparent cursor-pointer font-semibold border ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>
                                {isArabic ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
