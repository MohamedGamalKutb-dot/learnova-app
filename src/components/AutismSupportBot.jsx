import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { autismKnowledgeBase, defaultResponse, searchFallback } from '../data/autismKnowledgeBase';
import { childBotData, childDefaultResponse, childFallbackResponse } from '../data/childBotData';
import { getGeminiResponse, isGeminiAvailable } from '../api/geminiAI';

const normalize = (text) => text.toLowerCase().replace(/[ًٌٍَُِّْ]/g, '').replace(/[أإآ]/g, 'ا').replace(/[ة]/g, 'ه').replace(/[ى]/g, 'ي').trim();

export default function AutismSupportBot({ mode = 'parent' }) {
    const { isDark, isArabic } = useApp();
    const isChild = mode === 'child';
    const knowledgeBase = isChild ? childBotData : autismKnowledgeBase;
    const initialText = isChild ? (isArabic ? childDefaultResponse.ar : childDefaultResponse.en) : (isArabic ? defaultResponse.ar : defaultResponse.en);
    const fallbackText = isChild ? (isArabic ? childFallbackResponse.ar : childFallbackResponse.en) : (isArabic ? searchFallback.ar : searchFallback.en);
    const aiActiveText = isGeminiAvailable();
    const accent = isChild ? '#FF6584' : '#6C63FF';

    const [messages, setMessages] = useState([{ id: 1, text: initialText, sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const findLocalAnswer = useCallback((query) => {
        const normalizedQuery = normalize(query);
        const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
        let bestMatch = null, highestScore = 0;
        knowledgeBase.forEach(topic => {
            let score = 0;
            topic.keywords.forEach(keyword => {
                const nk = normalize(keyword); if (nk.length <= 1) return;
                if (nk.includes(' ') && normalizedQuery.includes(nk)) score += 10;
                else if (normalizedQuery.includes(nk) && nk.length >= 3) score += 5;
                else if (nk.length >= 3 && queryWords.some(w => (w.length >= 3 && w.includes(nk)) || (nk.length >= 3 && nk.includes(w) && w.length >= 3))) score += 2;
            });
            if (score > highestScore) { highestScore = score; bestMatch = topic; }
        });
        return bestMatch && highestScore >= 3 ? { text: isArabic ? bestMatch.answerAr : bestMatch.answerEn, type: 'answer', source: 'local' } : null;
    }, [knowledgeBase, isArabic]);

    const handleSend = async (textOverride = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;
        const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]); setInput(''); setIsTyping(true);
        try {
            if (isGeminiAvailable()) {
                const aiResponse = await getGeminiResponse(textToSend, [...messages, userMsg], mode, isArabic);
                setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'bot', type: 'answer', source: 'ai' }]);
                setIsTyping(false); return;
            }
        } catch (error) { console.warn('Gemini AI failed, falling back to local KB:', error.message); }
        setTimeout(() => {
            const localResponse = findLocalAnswer(textToSend);
            if (localResponse) setMessages(prev => [...prev, { id: Date.now() + 1, text: localResponse.text, sender: 'bot', type: 'answer', source: 'local' }]);
            else if (isChild) setMessages(prev => [...prev, { id: Date.now() + 1, text: fallbackText, sender: 'bot', type: 'answer', source: 'local' }]);
            else setMessages(prev => [...prev, { id: Date.now() + 1, text: fallbackText, sender: 'bot', type: 'search', query: textToSend, source: 'local' }]);
            setIsTyping(false);
        }, Math.random() * 800 + 600);
    };

    const quickQuestions = isChild
        ? (isArabic ? ['أنا زعلان 😢', 'أنا جعان 🍔', 'عايز ألعب 🎮', 'أنا مبسوط 😄', 'أنا خايف 😨', 'عايز ماما ❤️'] : ['I am sad 😢', 'I am hungry 🍔', 'I want to play 🎮', 'I am happy 😄', 'I am scared 😨', 'I want mom ❤️'])
        : (isArabic ? ['كيف أتعامل مع الصراخ؟', 'ابني لا يتكلم', 'مشاكل النوم', 'ينزعج من الأصوات', 'لا يأكل جيداً', 'علامات التوحد', 'أنواع العلاج', 'مش فاهمين العيلة'] : ['How to handle meltdowns?', 'My child is non-verbal', 'Sleep problems', 'Sensory issues', 'Picky eater', 'Early signs', 'Therapy types', 'Explaining to family']);

    return (
        <div className={`rounded-[20px] flex flex-col overflow-hidden my-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border ${isDark ? 'bg-[#1F2940] border-[#444]' : 'bg-white border-gray-200'}`}
            style={{ height: isChild ? 450 : 600 }}>
            {/* Header */}
            <div className={`py-4 px-5 flex items-center gap-3 border-b ${isDark ? 'bg-[#16213E] border-[#333]' : 'bg-[#fafafa] border-gray-200'}`}>
                <div className="rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(108,99,255,0.3)]"
                    style={{ width: isChild ? 50 : 44, height: isChild ? 50 : 44, background: `linear-gradient(135deg, ${accent}, #FF6584)`, fontSize: isChild ? 30 : 26 }}>🤖</div>
                <div className="flex-1">
                    <h3 className={`m-0 font-bold ${isDark ? 'text-[#E0E0E0]' : 'text-[#2D3436]'}`} style={{ fontSize: isChild ? 18 : 16 }}>{isArabic ? (isChild ? 'صديقي الروبوت' : 'المساعد الذكي للتوحد') : (isChild ? 'Robot Friend' : 'Autism AI Assistant')}</h3>
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" style={{ animation: 'pulse 2s infinite' }} />
                            {isArabic ? 'متصل الآن' : 'Online'}
                        </div>
                        {aiActiveText && <span className="text-[9px] py-0.5 px-1.5 rounded-md bg-gradient-to-br from-accent to-accent2 text-white font-bold tracking-wider">✨ Gemini AI</span>}
                    </div>
                </div>
                <button onClick={() => setMessages([{ id: 1, text: initialText, sender: 'bot' }])} title={isArabic ? 'مسح المحادثة' : 'Clear Chat'} className="bg-transparent border-none cursor-pointer text-lg text-gray-400">🗑️</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
                {messages.map(msg => (
                    <div key={msg.id} className="flex gap-2.5 max-w-[85%]"
                        style={{ alignSelf: msg.sender === 'user' ? (isArabic ? 'flex-start' : 'flex-end') : (isArabic ? 'flex-end' : 'flex-start'), flexDirection: isArabic ? 'row' : (msg.sender === 'user' ? 'row-reverse' : 'row') }}>
                        {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-lg" style={{ background: `${accent}20` }}>🤖</div>}
                        <div className="shadow-[0_2px_5px_rgba(0,0,0,0.05)] whitespace-pre-wrap leading-relaxed relative"
                            style={{
                                padding: isChild ? '16px 20px' : '14px 18px', borderRadius: 20,
                                background: msg.sender === 'user' ? accent : (isDark ? '#2a3654' : '#F0F2F5'),
                                color: msg.sender === 'user' ? '#fff' : (isDark ? '#E0E0E0' : '#2D3436'),
                                borderTopLeftRadius: msg.sender === 'bot' && !isArabic ? 4 : 20,
                                borderTopRightRadius: msg.sender === 'bot' && isArabic ? 4 : (msg.sender === 'user' && !isArabic ? 4 : 20),
                                borderBottomLeftRadius: msg.sender === 'user' && isArabic ? 4 : 20,
                                fontSize: isChild ? 16 : 15, fontWeight: isChild ? 500 : 400,
                            }}>
                            {msg.text}
                            {msg.sender === 'bot' && msg.source === 'ai' && (<div className={`mt-2 text-[10px] flex items-center gap-1 ${isDark ? 'text-[#777]' : 'text-[#aaa]'}`}><span className="text-[10px]">✨</span>{isArabic ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by AI'}</div>)}
                            {msg.type === 'search' && !isChild && (
                                <a href={`https://www.google.com/search?q=${encodeURIComponent(msg.query + ' autism')}`} target="_blank" rel="noopener noreferrer"
                                    className={`block mt-3 py-2.5 px-4 rounded-xl text-accent no-underline font-bold text-sm text-center border transition-colors duration-200 ${isDark ? 'bg-[#16213E] border-[#3a4a6a] hover:bg-[#1F2940]' : 'bg-white border-gray-200 hover:bg-gray-100'}`}>
                                    🔍 {isArabic ? `بحث جوجل عن "${msg.query}"` : `Search Google for "${msg.query}"`}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-2.5" style={{ alignSelf: isArabic ? 'flex-end' : 'flex-start' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${accent}20` }}>🤖</div>
                        <div className="rounded-[20px] py-3.5 px-[18px] flex gap-1.5 items-center" style={{ background: isDark ? '#2a3654' : '#F0F2F5' }}>
                            {[0, 0.16, 0.32].map((d, i) => <span key={i} className="w-2 h-2 rounded-full opacity-70" style={{ background: accent, animation: `bounce 1.4s infinite ease-in-out both ${d}s` }} />)}
                            <span className="text-[11px] text-gray-400 ms-2">{isGeminiAvailable() ? (isArabic ? '🧠 بيفكر...' : '🧠 Thinking...') : (isArabic ? 'بيكتب...' : 'Typing...')}</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-5 pb-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
                {quickQuestions.map(q => (
                    <button key={q} onClick={() => handleSend(q)}
                        className={`rounded-3xl border cursor-pointer whitespace-nowrap transition-all duration-200 ${isDark ? 'bg-accent/15 border-accent/40' : 'bg-white border-accent/40'}`}
                        style={{ padding: isChild ? '12px 20px' : '8px 16px', color: accent, fontSize: isChild ? 15 : 13, fontWeight: isChild ? 700 : 500 }}>
                        {q}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className={`p-4 flex gap-2.5 border-t ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !isTyping && handleSend()} disabled={isTyping}
                    placeholder={isArabic ? (isGeminiAvailable() ? '✨ اسألني أي حاجة...' : 'اكتب...') : (isGeminiAvailable() ? '✨ Ask me anything...' : 'Type...')}
                    className={`flex-1 rounded-[28px] border outline-none text-base ${isDark ? 'bg-[#2a3654] border-[#444] text-[#E0E0E0]' : 'bg-[#f9f9f9] border-gray-200 text-[#2D3436]'} ${isTyping ? 'opacity-60' : ''}`}
                    style={{ padding: isChild ? '16px 20px' : '14px 20px' }} />
                <button onClick={() => handleSend()} disabled={!input.trim() || isTyping}
                    className={`rounded-full text-white border-none flex items-center justify-center text-[22px] shadow-[0_4px_12px_rgba(108,99,255,0.4)] transition-transform duration-200 hover:scale-105 ${!input.trim() || isTyping ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
                    style={{ background: accent, width: isChild ? 56 : 52, height: isChild ? 56 : 52 }}>➤</button>
            </div>

            <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } } @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); } 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); } }`}</style>
        </div>
    );
}
