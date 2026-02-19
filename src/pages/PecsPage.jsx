import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { categories, categoryEmojis, categoryLabels, categoryLabelsAr, getItemsByCategory } from '../data/pecsData';

export default function PecsPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { trackPecsTap, trackPecsSentence } = useData();
    const [selectedCategory, setSelectedCategory] = useState('food');
    const [sentence, setSentence] = useState([]);

    const items = getItemsByCategory(selectedCategory);
    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';

    const addToSentence = useCallback((item) => {
        setSentence(prev => [...prev, item]);
        trackPecsTap(item, isArabic);
        // TTS
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(isArabic ? item.labelAr : item.label);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.8;
            speechSynthesis.speak(u);
        }
    }, [isArabic, trackPecsTap]);

    const speakSentence = useCallback(() => {
        if (sentence.length === 0) return;
        trackPecsSentence();
        const text = sentence.map(s => isArabic ? s.labelAr : s.label).join('. ');
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.7;
            speechSynthesis.speak(u);
        }
    }, [sentence, isArabic, trackPecsSentence]);

    return (
        <div style={{ minHeight: '100vh', background: bg, direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* AppBar */}
            <div style={{ background: isDark ? '#16213E' : '#6C63FF', color: '#fff', padding: '16px 20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? 'التواصل بالصور' : 'PECS Communication'}</h1>
                <div style={{ width: 30 }} />
            </div>

            {/* Sentence Bar */}
            <div style={{ margin: '16px', padding: '12px 16px', background: cardBg, borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minHeight: 70, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {sentence.length === 0 ? (
                    <span style={{ color: '#999', fontSize: 14, fontStyle: 'italic' }}>{isArabic ? 'اضغط على الصور لبناء جملة...' : 'Tap cards to build a sentence...'}</span>
                ) : (
                    <>
                        {sentence.map((item, i) => (
                            <div key={i} onClick={() => setSentence(prev => prev.filter((_, idx) => idx !== i))} style={{ background: isDark ? '#2a3654' : '#f0f0f5', padding: '6px 12px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                                <span style={{ color: text, fontWeight: 500 }}>{isArabic ? item.labelAr.split(' ').slice(-1)[0] : item.label.split(' ').slice(-1)[0]}</span>
                                <span style={{ color: '#999', fontSize: 12 }}>✕</span>
                            </div>
                        ))}
                    </>
                )}
                <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 6 }}>
                    {sentence.length > 0 && (
                        <>
                            <button onClick={speakSentence} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>🔊</button>
                            <button onClick={() => setSentence([])} style={{ background: '#FF6584', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>🗑️</button>
                        </>
                    )}
                </div>
            </div>

            {/* Category Chips */}
            <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', paddingBottom: 8 }}>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                        padding: '8px 16px', borderRadius: 16, border: `1px solid ${selectedCategory === cat ? '#6C63FF' : isDark ? '#444' : '#ddd'}`,
                        background: selectedCategory === cat ? '#6C63FF' : isDark ? '#1F2940' : '#fff',
                        color: selectedCategory === cat ? '#fff' : text,
                        cursor: 'pointer', fontWeight: selectedCategory === cat ? 700 : 500, fontSize: 13, whiteSpace: 'nowrap',
                        transition: 'all 0.25s',
                    }}>
                        {categoryEmojis[cat]} {isArabic ? categoryLabelsAr[cat] : categoryLabels[cat]}
                    </button>
                ))}
            </div>

            {/* PECS Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, padding: '16px' }}>
                {items.map(item => (
                    <button key={item.id} onClick={() => addToSentence(item)} style={{
                        padding: '20px 12px', borderRadius: 22, border: 'none', cursor: 'pointer',
                        background: cardBg, boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        transition: 'all 0.2s', aspectRatio: '1',
                        justifyContent: 'center',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(108,99,255,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; }}
                    >
                        <span style={{ fontSize: 48 }}>{item.emoji}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: text, textAlign: 'center' }}>{isArabic ? item.labelAr : item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
