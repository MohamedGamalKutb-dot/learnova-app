import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { categories, categoryEmojis, categoryLabels, categoryLabelsAr, getItemsByCategory } from '../data/pecsData';
import { Button, Card, CardBody, Chip } from '@heroui/react';

export default function PecsPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();
    const { trackPecsTap, trackPecsSentence } = useData();

    const storageKey = currentChild ? `pecs_sentence_${currentChild.childId}` : 'pecs_sentence_guest';

    const [selectedCategory, setSelectedCategory] = useState('food');
    const [sentence, setSentence] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [hoveredItem, setHoveredItem] = useState(null);

    const updateSentence = useCallback((newSentence) => {
        setSentence(newSentence);
        localStorage.setItem(storageKey, JSON.stringify(newSentence));
    }, [storageKey]);

    const items = getItemsByCategory(selectedCategory);

    const addToSentence = useCallback((item) => {
        const newSentence = [...sentence, item];
        updateSentence(newSentence);
        trackPecsTap(item, isArabic);
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(isArabic ? item.labelAr : item.label);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.8;
            speechSynthesis.speak(u);
        }
    }, [isArabic, trackPecsTap, sentence, updateSentence]);

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
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'}`} />
            </div>

            <nav className={`fixed top-0 inset-x-0 h-20 z-50 px-8 flex items-center justify-between backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'bg-[#0C0D17]/40 border-white/5' : 'bg-white/40 border-indigo-100'}`}>
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="bordered" radius="full" size="sm" className={`text-base ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`} onPress={() => navigate(-1)}>
                        {isArabic ? '→' : '←'}
                    </Button>
                    <div className="flex flex-col">
                        <h1 className={`text-xl font-black leading-none ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'التواصل بالصور' : 'PECS'}</h1>
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-40 mt-1">{isArabic ? 'تحدث بالصور' : 'VISUAL SPEECH'}</span>
                    </div>
                </div>
            </nav>

            <main className="relative max-w-[1300px] mx-auto px-8 pt-32 pb-20">
                <div className="space-y-10 w-full">
                    <div className="sticky top-24 z-40">
                        <Card className={`rounded-[35px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                            <CardBody className="p-8 flex flex-row items-center gap-6 min-h-[100px]">
                                {sentence.length === 0 ? (
                                    <div className="flex items-center gap-4 px-4 opacity-40">
                                        <span className="text-4xl animate-bounce">✨</span>
                                        <p className="text-xl font-black">{isArabic ? 'أضف صوراً لتبدأ الحديث..' : 'Add photos to start talking..'}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-4 flex-1 px-2">
                                        {sentence.map((item, i) => (
                                            <Chip 
                                                key={i}
                                                onClose={() => updateSentence(sentence.filter((_, idx) => idx !== i))}
                                                variant="flat"
                                                className={`h-16 px-8 rounded-[30px] transition-all ${isDark ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-50 text-indigo-900'}`}>
                                                <span className="text-4xl mr-2 ml-2">{item.emoji}</span>
                                                <span className="font-black text-xl">{isArabic ? item.labelAr?.split(' ').slice(-1)[0] : item.label?.split(' ').slice(-1)[0]}</span>
                                            </Chip>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-4 shrink-0">
                                    {sentence.length > 0 && (
                                        <>
                                            <Button radius="full" onPress={speakSentence} className="h-16 px-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xl shadow-xl shadow-indigo-500/20">
                                                🔊 {isArabic ? 'نطق' : 'SPEAK'}
                                            </Button>
                                            <Button isIconOnly radius="full" color="danger" variant="flat" className="h-16 w-16" onPress={() => updateSentence([])}>🗑️</Button>
                                        </>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar px-2">
                        {categories.map(cat => (
                            <Button 
                                key={cat} 
                                radius="full" 
                                onPress={() => setSelectedCategory(cat)}
                                variant={selectedCategory === cat ? "solid" : "bordered"}
                                className={`h-12 px-10 min-w-fit font-black text-[12px] uppercase tracking-widest transition-all ${
                                    selectedCategory === cat
                                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-xl'
                                    : `${isDark ? 'border-white/10 text-white/50' : 'border-indigo-100 text-indigo-900/40'}`
                                }`}
                                startContent={<span className="text-2xl">{categoryEmojis[cat]}</span>}>
                                {isArabic ? categoryLabelsAr[cat] : categoryLabels[cat]}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {items.map((item, i) => (
                            <Card 
                                key={item.id} 
                                isPressable 
                                onPress={() => addToSentence(item)}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`rounded-[40px] border transition-all duration-500 backdrop-blur-md w-full ${
                                    isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white/80 border-indigo-50 shadow-sm'
                                } ${hoveredItem === item.id ? 'scale-[1.01] border-indigo-500/30 shadow-2xl' : ''}`}
                                style={{ 
                                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s both`
                                }}>
                                <CardBody className="p-7 flex flex-row items-center gap-12">
                                    <div className={`w-24 h-24 rounded-[35px] flex items-center justify-center text-6xl shrink-0 transition-all duration-500 ${
                                        isDark ? 'bg-white/5' : 'bg-indigo-50/70'
                                    } ${hoveredItem === item.id ? 'rotate-6 scale-110' : ''}`}>
                                        {item.emoji}
                                    </div>
                                    <div className="flex-1 text-left rtl:text-right">
                                        <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-indigo-100' : 'text-indigo-920'}`}>
                                            {isArabic ? item.labelAr : item.label}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-3 opacity-40">
                                            <span className="text-[12px] font-black uppercase tracking-widest">{selectedCategory}</span>
                                        </div>
                                    </div>
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                                        hoveredItem === item.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-indigo-500/10 text-indigo-500 opacity-20'
                                    }`}>
                                        <span className="text-4xl font-black">+</span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
