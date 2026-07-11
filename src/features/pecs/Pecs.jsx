import { useState, useCallback } from 'react';
import { useApp } from '../../shared/context/AppContext';
import { useAuth } from '../../shared/context/AuthContext';
import { useData } from '../../shared/context/DataContext';
import { useGlobalData } from '../../shared/context/GlobalDataContext';

import PecsNavbar from './components/PecsNavbar';
import PecsSentenceBuilder from './components/PecsSentenceBuilder';
import PecsCategories from './components/PecsCategories';
import PecsItemsGrid from './components/PecsItemsGrid';

export default function Pecs() {
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();
    const { trackPecsTap, trackPecsSentence } = useData();
    const { pecs, isLoading } = useGlobalData();
    const { items: allItems, categories, categoryIcons, categoryLabels, categoryLabelsAr } = pecs || {};

    const getItemsByCategory = useCallback((category) => {
        return allItems ? allItems.filter(item => item.category === category) : [];
    }, [allItems]);

    const storageKey = currentChild ? `pecs_sentence_${currentChild.childId}` : 'pecs_sentence_guest';

    const [selectedCategory, setSelectedCategory] = useState('food');
    const [sentence, setSentence] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const updateSentence = useCallback((newSentence) => {
        setSentence(newSentence);
        localStorage.setItem(storageKey, JSON.stringify(newSentence));
    }, [storageKey]);

    const items = getItemsByCategory(selectedCategory);

    const addToSentence = useCallback((item) => {
        const newSentence = [...sentence, item];
        updateSentence(newSentence);
        if (trackPecsTap) trackPecsTap(item, isArabic);
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(isArabic ? item.labelAr : item.label);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.8;
            speechSynthesis.speak(u);
        }
    }, [isArabic, trackPecsTap, sentence, updateSentence]);

    const speakSentence = useCallback(() => {
        if (sentence.length === 0) return;
        if (trackPecsSentence) trackPecsSentence();
        const t = sentence.map(s => isArabic ? s.labelAr : s.label).join('. ');
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(t);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.7;
            speechSynthesis.speak(u);
        }
    }, [sentence, isArabic, trackPecsSentence]);

    if (isLoading || !pecs) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'}`} />
            </div>

            <PecsNavbar isDark={isDark} isArabic={isArabic} />

            <main className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-20">
                <div className="space-y-10 w-full">
                    <PecsSentenceBuilder 
                        isDark={isDark}
                        isArabic={isArabic}
                        sentence={sentence}
                        updateSentence={updateSentence}
                        speakSentence={speakSentence}
                    />

                    <PecsCategories 
                        isDark={isDark}
                        isArabic={isArabic}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categoryIcons={categoryIcons}
                        categoryLabels={categoryLabels}
                        categoryLabelsAr={categoryLabelsAr}
                    />

                    <PecsItemsGrid 
                        isDark={isDark}
                        isArabic={isArabic}
                        items={items}
                        selectedCategory={selectedCategory}
                        addToSentence={addToSentence}
                    />
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
