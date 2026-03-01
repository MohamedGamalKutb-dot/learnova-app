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
    const [hoveredItem, setHoveredItem] = useState(null);

    const items = getItemsByCategory(selectedCategory);
    const accent = '#6C63FF';

    const addToSentence = useCallback((item) => {
        setSentence(prev => [...prev, item]);
        trackPecsTap(item, isArabic);
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
        const t = sentence.map(s => isArabic ? s.labelAr : s.label).join('. ');
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(t);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.7;
            speechSynthesis.speak(u);
        }
    }, [sentence, isArabic, trackPecsSentence]);

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Navbar */}
            <nav className={`flex items-center gap-3 py-3 px-6 max-w-[1000px] mx-auto border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                <button onClick={() => navigate(-1)}
                    className={`w-9 h-9 rounded-[10px] border flex items-center justify-center text-base cursor-pointer ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>←</button>
                <h1 className={`flex-1 text-lg font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    🗣️ {isArabic ? 'التواصل بالصور' : 'PECS Communication'}
                </h1>
            </nav>

            <div className="max-w-[1000px] mx-auto py-5 px-6">
                {/* Sentence Bar */}
                <div className={`py-4 px-5 rounded-2xl border min-h-[60px] flex items-center gap-2 flex-wrap mb-5 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}>
                    {sentence.length === 0 ? (
                        <span className={`text-sm ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? '🖼️ اضغط على الصور لبناء جملة...' : '🖼️ Tap cards to build a sentence...'}</span>
                    ) : (
                        <>
                            {sentence.map((item, i) => (
                                <div key={i} onClick={() => setSentence(prev => prev.filter((_, idx) => idx !== i))}
                                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-[10px] cursor-pointer text-sm border transition-all duration-200 ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-[#F0F0FF] border-[#E0E0FF]'}`}>
                                    <span className="text-lg">{item.emoji}</span>
                                    <span className={`font-medium ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? item.labelAr.split(' ').slice(-1)[0] : item.label.split(' ').slice(-1)[0]}</span>
                                    <span className="text-red-500 text-xs ms-1">✕</span>
                                </div>
                            ))}
                        </>
                    )}
                    <div className="ms-auto flex gap-1.5 shrink-0">
                        {sentence.length > 0 && (
                            <>
                                <button onClick={speakSentence}
                                    className="flex items-center gap-1 bg-accent text-white border-none rounded-[10px] py-2 px-4 cursor-pointer font-semibold text-sm shadow-[0_2px_8px_rgba(108,99,255,0.25)]">
                                    🔊 {isArabic ? 'نطق' : 'Speak'}
                                </button>
                                <button onClick={() => setSentence([])}
                                    className={`rounded-[10px] py-2 px-4 cursor-pointer font-semibold text-sm text-red-500 border ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-red-50 border-red-200'}`}>
                                    🗑️
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Category Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-5 [scrollbar-width:none]">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)}
                            className={`py-2.5 px-4 rounded-xl cursor-pointer text-[13px] whitespace-nowrap border transition-all duration-200 ${selectedCategory === cat
                                    ? 'bg-accent text-white border-accent font-bold shadow-[0_4px_12px_rgba(108,99,255,0.19)]'
                                    : `font-medium ${isDark ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-card text-text border-border'}`
                                }`}>
                            {categoryEmojis[cat]} {isArabic ? categoryLabelsAr[cat] : categoryLabels[cat]}
                        </button>
                    ))}
                </div>

                {/* PECS Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3.5">
                    {items.map((item, i) => (
                        <button key={item.id} onClick={() => addToSentence(item)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`flex flex-col items-center gap-2.5 py-6 px-3 rounded-2xl cursor-pointer transition-all duration-[250ms] border ${isDark ? 'bg-card-dark' : 'bg-card'} ${isDark && hoveredItem !== item.id ? 'shadow-none' : ''}`}
                            style={{
                                borderColor: hoveredItem === item.id ? `${accent}50` : (isDark ? '#21262D' : '#E5E7EB'),
                                boxShadow: hoveredItem === item.id ? `0 8px 24px ${accent}15` : (isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.03)'),
                                transform: hoveredItem === item.id ? 'translateY(-4px)' : 'translateY(0)',
                                animation: `fadeInUp 0.3s ease-out ${i * 0.04}s both`,
                            }}>
                            <span className="text-[44px] transition-transform duration-300" style={{ transform: hoveredItem === item.id ? 'scale(1.15)' : 'scale(1)' }}>{item.emoji}</span>
                            <span className={`text-[13px] font-semibold text-center ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? item.labelAr : item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
