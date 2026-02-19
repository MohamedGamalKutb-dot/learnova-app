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

    // Get today's date key (YYYY-MM-DD) for daily reset logic
    const todayKey = new Date().toLocaleDateString('en-CA');

    // Load initial routine state from child's history or default
    const [items, setItems] = useState(() => {
        const history = currentChild?.routineHistory || {};
        const todayData = history[todayKey] || {};

        return defaultRoutine.map(r => ({
            ...r,
            isCompleted: todayData[r.id] || false // Load completed status if exists for today
        }));
    });

    const [selectedTime, setSelectedTime] = useState('morning');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', titleAr: '', emoji: '🎯', timeOfDay: 'morning', startTime: '' });

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';

    const filteredItems = items.filter(i => i.timeOfDay === selectedTime);
    const completedCount = items.filter(i => i.isCompleted).length;
    const totalCount = items.length;
    const progress = totalCount > 0 ? completedCount / totalCount : 0;

    // Save changes whenever items change
    useEffect(() => {
        if (currentChild) {
            const statusMap = {};
            items.forEach(item => {
                if (item.isCompleted) statusMap[item.id] = true;
            });
            updateChildRoutine(currentChild.childId, todayKey, statusMap);
        }
    }, [items, currentChild?.childId, todayKey]); // Removed updateChildRoutine from dependencies to avoid loop

    const toggleComplete = (id) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i));
    };

    const resetDay = () => {
        setItems(prev => prev.map(i => ({ ...i, isCompleted: false })));
        if (currentChild) updateChildRoutine(currentChild.childId, todayKey, {});
    };

    const addItem = () => {
        if (!newItem.title) return;
        const newId = `custom_${Date.now()}`;
        setItems(prev => [...prev, { ...newItem, id: newId, titleAr: newItem.titleAr || newItem.title, isCompleted: false }]);
        setShowAddModal(false);
        setNewItem({ title: '', titleAr: '', emoji: '🎯', timeOfDay: 'morning', startTime: '' });
    };

    // Calculate History Stats
    const historyEntries = Object.entries(currentChild?.routineHistory || {})
        .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort new to old
        .slice(0, 5); // Show last 5 days

    return (
        <div style={{ minHeight: '100vh', background: bg, direction: isArabic ? 'rtl' : 'ltr', paddingBottom: 40 }}>
            {/* AppBar */}
            <div style={{ background: isDark ? '#16213E' : '#8BC99A', color: '#fff', padding: '16px 20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? 'الروتين اليومي' : 'Daily Routine'}</h1>
                <button onClick={resetDay} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', title: 'Reset' }}>🔄</button>
            </div>

            {/* Date Display */}
            <div style={{ textAlign: 'center', padding: '10px 0', color: text, fontSize: 14, opacity: 0.7 }}>
                {new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            {/* Progress Bar */}
            <div style={{ margin: '0 16px 16px', padding: 16, background: cardBg, borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: text }}>{isArabic ? 'تقدم اليوم' : "Today's Progress"}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#8BC99A' }}>{completedCount}/{totalCount}</span>
                </div>
                <div style={{ height: 12, background: isDark ? '#333' : '#eee', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress * 100}%`, background: '#8BC99A', borderRadius: 10, transition: 'width 0.5s ease' }} />
                </div>
                {progress >= 1 && <p style={{ textAlign: 'center', color: '#8BC99A', fontWeight: 600, marginTop: 8 }}>🎉 {isArabic ? 'أحسنت! أكملت كل المهام!' : 'Great job! All tasks completed!'}</p>}
            </div>

            {/* Time Chips */}
            <div style={{ display: 'flex', gap: 8, padding: '0 12px', overflowX: 'auto', paddingBottom: 8 }}>
                {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                    <button key={tod} onClick={() => setSelectedTime(tod)} style={{
                        padding: '8px 16px', borderRadius: 16,
                        background: selectedTime === tod ? '#8BC99A' : isDark ? '#1F2940' : '#fff',
                        color: selectedTime === tod ? '#fff' : text,
                        border: `1px solid ${selectedTime === tod ? '#8BC99A' : isDark ? '#444' : '#ddd'}`,
                        cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: selectedTime === tod ? 700 : 500, fontSize: 13,
                        transition: 'all 0.25s',
                    }}>
                        {isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]}
                    </button>
                ))}
            </div>

            {/* Routine Cards */}
            <div style={{ padding: '8px 16px', minHeight: 400 }}>
                {filteredItems.map((item, index) => (
                    <div key={item.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', margin: '6px 0',
                        background: cardBg, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: item.isCompleted ? '2px solid #8BC99A' : '2px solid transparent',
                        transition: 'all 0.3s', animation: `fadeSlideUp 0.3s ease-out ${index * 0.06}s both`,
                        opacity: item.isCompleted ? 0.8 : 1
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: item.isCompleted ? 'rgba(139,201,154,0.15)' : 'rgba(249,228,167,0.15)',
                        }}>
                            <span style={{ fontSize: 30 }}>{item.emoji}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 17, fontWeight: 600, color: text, textDecoration: item.isCompleted ? 'line-through' : 'none' }}>{isArabic ? item.titleAr : item.title}</div>
                            {item.startTime && <div style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{item.startTime}</div>}
                        </div>
                        <button onClick={() => toggleComplete(item.id)} style={{
                            width: 36, height: 36, borderRadius: '50%', border: `2px solid ${item.isCompleted ? '#8BC99A' : isDark ? '#555' : '#ccc'}`,
                            background: item.isCompleted ? '#8BC99A' : 'transparent', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                        }}>
                            {item.isCompleted && <span style={{ color: '#fff', fontSize: 18 }}>✓</span>}
                        </button>
                    </div>
                ))}
            </div>

            {/* History Stats Section */}
            {historyEntries.length > 0 && (
                <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 18, color: text, marginBottom: 12 }}>{isArabic ? '📊 إحصائيات الأيام السابقة' : '📊 History Stats'}</h3>
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>
                        {historyEntries.map(([date, tasks]) => {
                            const count = Object.keys(tasks || {}).length;
                            const pct = Math.round((count / defaultRoutine.length) * 100);
                            return (
                                <div key={date} style={{
                                    minWidth: 100, padding: 12, borderRadius: 16, background: cardBg,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                    border: `1px solid ${isDark ? '#333' : '#eee'}`
                                }}>
                                    <div style={{ fontSize: 12, color: '#999' }}>{date.split('-').slice(1).join('/')}</div>
                                    <div style={{ fontSize: 20, fontWeight: 700, color: '#8BC99A' }}>{pct}%</div>
                                    <div style={{ fontSize: 11, color: text }}>{count} tasks</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* FAB */}
            <button onClick={() => setShowAddModal(true)} style={{
                position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%',
                background: '#8BC99A', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(139,201,154,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>+</button>

            {/* Add Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowAddModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: cardBg, borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 500,
                        padding: 20, maxHeight: '80vh', overflowY: 'auto',
                    }}>
                        <div style={{ width: 40, height: 4, background: '#ccc', borderRadius: 2, margin: '0 auto 16px' }} />
                        <h3 style={{ color: text, fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{isArabic ? 'إضافة نشاط جديد' : 'Add New Activity'}</h3>

                        {/* Emoji Picker */}
                        <p style={{ color: text, fontWeight: 600, marginBottom: 8 }}>{isArabic ? 'اختر رمز' : 'Choose Emoji'}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {availableEmojis.map((em) => (
                                <button key={em} onClick={() => setNewItem(p => ({ ...p, emoji: em }))} style={{
                                    width: 44, height: 44, borderRadius: 12, border: `1px solid ${newItem.emoji === em ? '#8BC99A' : isDark ? '#444' : '#ddd'}`,
                                    background: newItem.emoji === em ? 'rgba(139,201,154,0.2)' : 'transparent',
                                    cursor: 'pointer', fontSize: 24,
                                }}>{em}</button>
                            ))}
                        </div>

                        <input value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} placeholder={isArabic ? 'اسم النشاط (إنجليزي)' : 'Activity Name (English)'} style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${isDark ? '#444' : '#ddd'}`, marginBottom: 12, background: isDark ? '#2a3654' : '#fff', color: text, fontSize: 14 }} />
                        <input value={newItem.titleAr} onChange={e => setNewItem(p => ({ ...p, titleAr: e.target.value }))} placeholder={isArabic ? 'اسم النشاط (عربي)' : 'Activity Name (Arabic)'} style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${isDark ? '#444' : '#ddd'}`, marginBottom: 12, background: isDark ? '#2a3654' : '#fff', color: text, fontSize: 14 }} />
                        <input value={newItem.startTime} onChange={e => setNewItem(p => ({ ...p, startTime: e.target.value }))} placeholder={isArabic ? 'الوقت (مثال: 08:00)' : 'Time (e.g. 08:00)'} style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${isDark ? '#444' : '#ddd'}`, marginBottom: 16, background: isDark ? '#2a3654' : '#fff', color: text, fontSize: 14 }} />

                        {/* TOD Select */}
                        <p style={{ color: text, fontWeight: 600, marginBottom: 8 }}>{isArabic ? 'الفترة' : 'Time of Day'}</p>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                            {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                                <button key={tod} onClick={() => setNewItem(p => ({ ...p, timeOfDay: tod }))} style={{
                                    flex: 1, padding: '8px 4px', borderRadius: 10,
                                    background: newItem.timeOfDay === tod ? '#8BC99A' : 'transparent',
                                    color: newItem.timeOfDay === tod ? '#fff' : text,
                                    border: `1px solid ${newItem.timeOfDay === tod ? '#8BC99A' : isDark ? '#444' : '#ddd'}`,
                                    cursor: 'pointer', fontSize: 18,
                                }}>
                                    {(isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]).split(' ')[0]}
                                </button>
                            ))}
                        </div>

                        <button onClick={addItem} style={{
                            width: '100%', padding: '14px', borderRadius: 16, background: '#8BC99A', color: '#fff',
                            border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16,
                        }}>{isArabic ? 'إضافة' : 'Add Activity'}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
