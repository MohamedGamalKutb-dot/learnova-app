import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { categories, categoryEmojis, categoryLabels, categoryLabelsAr, getItemsByCategory } from '../data/pecsData';
import { Button, Card, CardBody, Navbar, Chip } from '@heroui/react';

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
            <Navbar maxWidth="lg" className={`py-1 border-b transparent-navbar ${isDark ? 'border-border-dark' : 'border-border'}`} style={{ background: 'transparent' }} classNames={{ wrapper: 'px-6 max-w-[1000px] flex justify-start gap-3' }}>
                <Button isIconOnly size="sm" variant="bordered" className={`text-base ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`} onPress={() => navigate(-1)}>←</Button>
                <h1 className={`m-0 text-lg font-bold flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    🗣️ {isArabic ? 'التواصل بالصور' : 'PECS Communication'}
                </h1>
            </Navbar>

            <div className="max-w-[1000px] mx-auto py-5 px-6">
                {/* Sentence Bar */}
                <Card className={`mb-5 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}>
                    <CardBody className="py-4 px-5 flex flex-row items-center gap-2 flex-wrap min-h-[60px] w-full">
                        {sentence.length === 0 ? (
                            <span className={`text-sm ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? '🖼️ اضغط على الصور لبناء جملة...' : '🖼️ Tap cards to build a sentence...'}</span>
                        ) : (
                            <div className="flex flex-wrap gap-2 flex-1">
                                {sentence.map((item, i) => (
                                    <Chip key={i} onClose={() => setSentence(prev => prev.filter((_, idx) => idx !== i))}
                                        radius="md" size="lg" variant="bordered"
                                        classNames={{
                                            base: `cursor-pointer ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-[#F0F0FF] border-[#E0E0FF]'}`,
                                            content: `font-medium flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`
                                        }}>
                                        <span className="text-lg">{item.emoji}</span>
                                        <span>{isArabic ? item.labelAr.split(' ').slice(-1)[0] : item.label.split(' ').slice(-1)[0]}</span>
                                    </Chip>
                                ))}
                            </div>
                        )}
                        <div className="ms-auto flex gap-1.5 shrink-0">
                            {sentence.length > 0 && (
                                <>
                                    <Button radius="md" onPress={speakSentence} className="bg-accent text-white font-semibold text-sm shadow-[0_2px_8px_rgba(108,99,255,0.25)]">
                                        🔊 {isArabic ? 'نطق' : 'Speak'}
                                    </Button>
                                    <Button isIconOnly radius="md" color="danger" variant="flat" onPress={() => setSentence([])}>
                                        🗑️
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* Category Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
                    {categories.map(cat => (
                        <Button key={cat} radius="xl" onPress={() => setSelectedCategory(cat)}
                            variant={selectedCategory === cat ? "solid" : "bordered"}
                            className={`transition-all duration-200 text-[13px] whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-accent text-white border-accent font-bold shadow-[0_4px_12px_rgba(108,99,255,0.19)]'
                                : `font-medium ${isDark ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-card text-text border-border'}`
                                }`}
                            startContent={<span>{categoryEmojis[cat]}</span>}>
                            {isArabic ? categoryLabelsAr[cat] : categoryLabels[cat]}
                        </Button>
                    ))}
                </div>

                {/* PECS Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3.5">
                    {items.map((item, i) => (
                        <Card key={item.id} isPressable onPress={() => addToSentence(item)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`border transition-all duration-[250ms] ${isDark ? 'bg-card-dark' : 'bg-card'} ${isDark && hoveredItem !== item.id ? 'shadow-none' : ''}`}
                            style={{
                                borderColor: hoveredItem === item.id ? `${accent}50` : (isDark ? '#21262D' : '#E5E7EB'),
                                boxShadow: hoveredItem === item.id ? `0 8px 24px ${accent}15` : (isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.03)'),
                                transform: hoveredItem === item.id ? 'translateY(-4px)' : 'translateY(0)',
                                animation: `fadeInUp 0.3s ease-out ${i * 0.04}s both`,
                            }}>
                            <CardBody className="py-6 px-3 flex flex-col items-center gap-2.5 w-full">
                                <span className="text-[44px] transition-transform duration-300" style={{ transform: hoveredItem === item.id ? 'scale(1.15)' : 'scale(1)' }}>{item.emoji}</span>
                                <span className={`text-[13px] font-semibold text-center ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? item.labelAr : item.label}</span>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
            <style>{`nav.transparent-navbar header { background: transparent !important; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}
