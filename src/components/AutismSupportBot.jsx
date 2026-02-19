import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { autismKnowledgeBase, defaultResponse, searchFallback } from '../data/autismKnowledgeBase';
import { childBotData, childDefaultResponse, childFallbackResponse } from '../data/childBotData';

// Helper to normalize text (remove diacritics, lowercase)
const normalize = (text) => text.toLowerCase()
    .replace(/[ًٌٍَُِّْ]/g, '') // remove tashkeel
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .trim();

export default function AutismSupportBot({ mode = 'parent' }) {
    const { isDark, isArabic } = useApp();
    const isChild = mode === 'child';

    // Choose appropriate responses/data
    const knowledgeBase = isChild ? childBotData : autismKnowledgeBase;
    const initialText = isChild
        ? (isArabic ? childDefaultResponse.ar : childDefaultResponse.en)
        : (isArabic ? defaultResponse.ar : defaultResponse.en);
    const fallbackText = isChild
        ? (isArabic ? childFallbackResponse.ar : childFallbackResponse.en)
        : (isArabic ? searchFallback.ar : searchFallback.en);

    const [messages, setMessages] = useState([
        { id: 1, text: initialText, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const bg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const accent = isChild ? '#FF6584' : '#6C63FF'; // Child uses playful pink
    const botBg = isDark ? '#2a3654' : '#F0F2F5';
    const userBg = accent;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const findAnswer = (query) => {
        const normalizedQuery = normalize(query);
        const queryWords = normalizedQuery.split(/\s+/); // split by spaces

        // Score each topic based on keyword matches
        let bestMatch = null;
        let highestScore = 0;

        knowledgeBase.forEach(topic => {
            let score = 0;
            topic.keywords.forEach(keyword => {
                const normalizedKeyword = normalize(keyword);
                // Exact match or partial match in query
                if (normalizedQuery.includes(normalizedKeyword)) {
                    score += 5; // Direct phrase match
                } else if (queryWords.some(w => w.includes(normalizedKeyword) || normalizedKeyword.includes(w))) {
                    score += 2; // Partial word match
                }
            });

            if (score > highestScore) {
                highestScore = score;
                bestMatch = topic;
            }
        });

        // Threshold for a "good" match
        if (bestMatch && highestScore >= 2) {
            return {
                text: isArabic ? bestMatch.answerAr : bestMatch.answerEn,
                type: 'answer'
            };
        }

        // Child Fallback: Just return simple message (no Google search)
        if (isChild) {
            return {
                text: fallbackText,
                type: 'answer' // Always 'answer' for child, no 'search' actions
            };
        }

        // Parent Fallback: Google Search
        return {
            text: fallbackText,
            type: 'search',
            query: query
        };
    };

    const handleSend = async (textOverride = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        // User Message
        const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Thinking Delay (random between 1s and 2s)
        setTimeout(() => {
            const response = findAnswer(textToSend);

            let botMsg = {
                id: Date.now() + 1,
                text: response.text,
                sender: 'bot',
                type: response.type,
                query: response.query
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, Math.random() * 1000 + 1000);
    };

    const quickQuestions = isChild
        ? (isArabic ? ['أنا زعلان 😢', 'أنا جعان 🍔', 'عايز ألعب 🎮', 'أنا مبسوط 😄'] : ['I am sad 😢', 'I am hungry 🍔', 'I want to play 🎮', 'I am happy 😄'])
        : (isArabic
            ? ['كيف أتعامل مع الصراخ؟', 'ابني لا يتكلم', 'مشاكل النوم', 'ينزعج من الأصوات', 'لا يأكل جيداً', 'التنمر في المدرسة']
            : ['How to handle meltdowns?', 'My child is non-verbal', 'Sleep problems', 'Sensory issues', 'Picky eater', 'Bullying at school']);

    return (
        <div style={{
            background: bg, borderRadius: 20, border: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
            display: 'flex', flexDirection: 'column', height: isChild ? 450 : 600, overflow: 'hidden', margin: '20px 0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px', background: isDark ? '#16213E' : '#fafafa', borderBottom: `1px solid ${isDark ? '#333' : '#eee'}`,
                display: 'flex', alignItems: 'center', gap: 12
            }}>
                <div style={{ width: isChild ? 50 : 44, height: isChild ? 50 : 44, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #FF6584)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isChild ? 30 : 26, boxShadow: '0 2px 10px rgba(108,99,255,0.3)' }}>🤖</div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: isChild ? 18 : 16, fontWeight: 700, color: text }}>{isArabic ? (isChild ? 'صديقي الروبوت' : 'المساعد الذكي للتوحد') : (isChild ? 'Robot Friend' : 'Autism AI Assistant')}</h3>
                    <div style={{ fontSize: 12, color: '#4CAF50', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', animation: 'pulse 2s infinite' }}></span>
                        {isArabic ? 'متصل الآن' : 'Online'}
                    </div>
                </div>
                <button onClick={() => setMessages([{ id: 1, text: initialText, sender: 'bot' }])} title={isArabic ? 'مسح المحادثة' : 'Clear Chat'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#999' }}>🗑️</button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        alignSelf: msg.sender === 'user' ? (isArabic ? 'flex-start' : 'flex-end') : (isArabic ? 'flex-end' : 'flex-start'),
                        maxWidth: '85%', display: 'flex', gap: 10,
                        flexDirection: isArabic ? 'row' : (msg.sender === 'user' ? 'row-reverse' : 'row')
                    }}>
                        {msg.sender === 'bot' && (
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${accent}20`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                        )}
                        <div style={{
                            padding: isChild ? '16px 20px' : '14px 18px', borderRadius: 20,
                            background: msg.sender === 'user' ? userBg : botBg,
                            color: msg.sender === 'user' ? '#fff' : text,
                            borderTopLeftRadius: msg.sender === 'bot' && !isArabic ? 4 : 20,
                            borderTopRightRadius: msg.sender === 'bot' && isArabic ? 4 : (msg.sender === 'user' && !isArabic ? 4 : 20),
                            borderBottomLeftRadius: msg.sender === 'user' && isArabic ? 4 : 20,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: isChild ? 16 : 15, fontWeight: isChild ? 500 : 400
                        }}>
                            {msg.text}

                            {/* Google Search Fallback Button (ONLY IN PARENT MODE) */}
                            {msg.type === 'search' && !isChild && (
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(msg.query + ' autism')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block', marginTop: 12, padding: '10px 16px', borderRadius: 12,
                                        background: isDark ? '#16213E' : '#fff', border: `1px solid ${isDark ? '#3a4a6a' : '#ddd'}`,
                                        color: accent, textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1F2940' : '#f0f0f0'}
                                    onMouseLeave={e => e.currentTarget.style.background = isDark ? '#16213E' : '#fff'}
                                >
                                    🔍 {isArabic ? `بحث جوجل عن "${msg.query}"` : `Search Google for "${msg.query}"`}
                                </a>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ alignSelf: isArabic ? 'flex-end' : 'flex-start', display: 'flex', gap: 10, flexDirection: isArabic ? 'row' : 'row' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
                        <div style={{ background: botBg, padding: '14px 18px', borderRadius: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ width: 6, height: 6, background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                            <span style={{ width: 6, height: 6, background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.16s' }}></span>
                            <span style={{ width: 6, height: 6, background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.32s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                {quickQuestions.map(q => (
                    <button key={q} onClick={() => handleSend(q)} style={{
                        padding: isChild ? '12px 20px' : '8px 16px', borderRadius: 24, border: `1px solid ${accent}40`,
                        background: isDark ? 'rgba(108,99,255,0.15)' : '#fff', color: accent,
                        fontSize: isChild ? 15 : 13, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: isChild ? 700 : 500
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = `${accent}20`}
                        onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(108,99,255,0.15)' : '#fff'}
                    >{q}</button>
                ))}
            </div>

            {/* Input Area */}
            <div style={{ padding: 16, borderTop: `1px solid ${isDark ? '#333' : '#eee'}`, display: 'flex', gap: 10 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={isArabic ? 'اكتب...' : 'Type...'}
                    style={{
                        flex: 1, padding: isChild ? '16px 20px' : '14px 20px', borderRadius: 28, border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                        background: isDark ? '#2a3654' : '#f9f9f9', color: text, outline: 'none', fontSize: 16
                    }}
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    style={{
                        width: isChild ? 56 : 52, height: isChild ? 56 : 52, borderRadius: '50%', background: accent, color: '#fff',
                        border: 'none', cursor: input.trim() ? 'pointer' : 'default', opacity: input.trim() ? 1 : 0.6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                        boxShadow: '0 4px 12px rgba(108,99,255,0.4)', transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isArabic ? '➤' : '➤'}
                </button>
            </div>
            <style>{`
                @keyframes bounce { 
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
                    70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
            `}</style>
        </div>
    );
}
