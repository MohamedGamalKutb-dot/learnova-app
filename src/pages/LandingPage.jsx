import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';

export default function LandingPage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stats = [
        { num: isArabic ? '١ من ٣٦' : '1 in 36', label: isArabic ? 'طفل مصاب بالتوحد' : 'Children have autism', icon: '🧩' },
        { num: isArabic ? '٧٥%' : '75%', label: isArabic ? 'تحسن مع التدخل المبكر' : 'Improve with early help', icon: '📈' },
        { num: '60+', label: isArabic ? 'مركز متخصص في مصر' : 'Specialist centers in Egypt', icon: '🏥' },
        { num: isArabic ? '٢٤/٧' : '24/7', label: isArabic ? 'دعم بالذكاء الاصطناعي' : 'AI-powered support', icon: '🤖' },
    ];

    const features = [
        { icon: '🗣️', color: '#6C63FF', title: isArabic ? 'التواصل بالصور (PECS)' : 'Picture Communication (PECS)', desc: isArabic ? 'نظام تواصل بصري يساعد الطفل على التعبير عن احتياجاته بالصور بدلاً من الكلمات' : 'Visual communication system helping children express needs through pictures instead of words' },
        { icon: '😊', color: '#FF6584', title: isArabic ? 'التعرف على المشاعر' : 'Emotion Recognition', desc: isArabic ? 'تعليم الطفل التعرف على المشاعر المختلفة من خلال ألعاب تفاعلية واختبارات ممتعة' : 'Teaching children to recognize different emotions through interactive games and fun quizzes' },
        { icon: '📅', color: '#4ECDC4', title: isArabic ? 'الروتين اليومي المرئي' : 'Visual Daily Routine', desc: isArabic ? 'جدول مرئي يساعد الطفل على فهم روتينه اليومي ويقلل من القلق والتوتر' : 'Visual schedule helping children understand their daily routine, reducing anxiety and stress' },
        { icon: '🤖', color: '#F4A623', title: isArabic ? 'مساعد ذكي بالـ AI' : 'AI-Powered Assistant', desc: isArabic ? 'مساعد ذكي مدعوم بـ Gemini AI يجاوب على أي سؤال عن التوحد ويتفاعل مع الطفل' : 'Gemini AI-powered assistant answering any autism question and interacting with your child' },
        { icon: '🗺️', color: '#E91E63', title: isArabic ? 'خريطة المراكز المتخصصة' : 'Specialist Centers Map', desc: isArabic ? 'خريطة تفاعلية بها أكثر من 60 مركز توحد في كل محافظات مصر مع معلومات التواصل' : 'Interactive map with 60+ autism centers across all Egyptian governorates with contact info' },
        { icon: '🧘', color: '#00BCD4', title: isArabic ? 'منطقة الهدوء والاسترخاء' : 'Calming & Relaxation Zone', desc: isArabic ? 'تمارين تنفس وأنشطة تهدئة تساعد الطفل على التعامل مع التوتر والقلق' : 'Breathing exercises and calming activities helping children manage stress and anxiety' },
    ];

    const autismFacts = [
        { icon: '🧠', fact: isArabic ? 'التوحد ليس مرضاً بل اختلاف في طريقة عمل الدماغ' : 'Autism is not a disease, but a different way the brain works' },
        { icon: '👶', fact: isArabic ? 'العلامات المبكرة تظهر عادة بين 12-18 شهر من العمر' : 'Early signs usually appear between 12-18 months of age' },
        { icon: '💪', fact: isArabic ? 'التدخل المبكر يحسن النتائج بنسبة تصل إلى 75%' : 'Early intervention improves outcomes by up to 75%' },
        { icon: '❤️', fact: isArabic ? 'كل طفل توحد فريد - لا يوجد طفلان متشابهان تماماً' : 'Every autistic child is unique - no two children are exactly alike' },
        { icon: '🌍', fact: isArabic ? 'التوحد يؤثر على 1 من كل 36 طفل حول العالم' : 'Autism affects 1 in every 36 children worldwide' },
    ];

    const gradientText = "bg-gradient-to-br from-accent to-accent2 bg-clip-text [-webkit-text-fill-color:transparent]";

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] overflow-x-hidden ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* NAVBAR */}
            <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between py-3 px-6 transition-all duration-300"
                style={{
                    background: scrollY > 50 ? (isDark ? 'rgba(13,17,23,0.95)' : 'rgba(250,251,255,0.95)') : 'transparent',
                    backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
                    borderBottom: scrollY > 50 ? `1px solid ${isDark ? '#21262D' : '#E5E7EB'}` : 'none',
                }}>
                <div className="flex items-center gap-2.5">
                    <span className="text-[28px]">🧩</span>
                    <span className={`text-[22px] font-extrabold ${gradientText}`}>LearnNeur</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <button onClick={toggleTheme} className={`w-[38px] h-[38px] rounded-full border-none cursor-pointer text-lg flex items-center justify-center ${isDark ? 'bg-border-dark' : 'bg-gray-100'}`}>{isDark ? '☀️' : '🌙'}</button>
                    <button onClick={toggleLanguage} className={`w-[38px] h-[38px] rounded-full border-none cursor-pointer text-base flex items-center justify-center ${isDark ? 'bg-border-dark' : 'bg-gray-100'}`}>{isArabic ? 'EN' : 'ع'}</button>
                    <button onClick={() => navigate('/choice')}
                        className="py-2.5 px-6 rounded-xl bg-gradient-to-br from-accent to-accent2 text-white border-none cursor-pointer font-bold text-sm shadow-[0_4px_15px_rgba(108,99,255,0.4)] transition-transform duration-200 hover:scale-105">
                        {isArabic ? '🚀 ابدأ الآن' : '🚀 Get Started'}
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center pt-[120px] pb-[60px] px-6 relative"
                style={{
                    background: isDark
                        ? `radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,101,132,0.1) 0%, transparent 50%)`
                        : `radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,101,132,0.06) 0%, transparent 50%)`
                }}>
                <div className="absolute top-[15%] left-[10%] text-[60px] opacity-15" style={{ animation: 'float 6s ease-in-out infinite' }}>🧩</div>
                <div className="absolute top-[25%] right-[12%] text-5xl opacity-[0.12]" style={{ animation: 'float 8s ease-in-out infinite 1s' }}>💜</div>
                <div className="absolute bottom-[20%] left-[15%] text-[45px] opacity-10" style={{ animation: 'float 7s ease-in-out infinite 2s' }}>⭐</div>

                <div className="inline-block py-1.5 px-4 rounded-[20px] bg-accent/[0.08] text-accent text-[13px] font-semibold mb-5 border border-accent/20">
                    {isArabic ? '🧩 منصة دعم أطفال التوحد الأولى في مصر' : "🧩 Egypt's #1 Autism Support Platform"}
                </div>

                <h1 className={`text-[clamp(32px,5vw,56px)] font-black leading-tight max-w-[800px] mx-auto mb-5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    {isArabic ? (<>كل طفل <span className={gradientText}>يستحق</span> فرصة للتواصل والتعلم</>) : (<>Every Child <span className={gradientText}>Deserves</span> a Chance to Connect & Learn</>)}
                </h1>

                <p className={`text-lg max-w-[600px] leading-relaxed mb-9 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                    {isArabic ? 'منصة متكاملة تساعد أطفال التوحد وأولياء أمورهم والأطباء المتخصصين - بأدوات ذكية مدعومة بالذكاء الاصطناعي' : 'A comprehensive platform helping autistic children, their parents, and specialist doctors — with AI-powered smart tools'}
                </p>

                <div className="flex gap-3.5 flex-wrap justify-center">
                    <button onClick={() => navigate('/choice')}
                        className="py-4 px-9 rounded-2xl bg-gradient-to-br from-accent to-[#8B5CF6] text-white border-none cursor-pointer font-bold text-base shadow-[0_8px_30px_rgba(108,99,255,0.4)] transition-all duration-300 flex items-center gap-2 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(108,99,255,0.5)]">
                        {isArabic ? '🚀 ابدأ رحلتك الآن' : '🚀 Start Your Journey'}
                    </button>
                    <a href="#learn-more"
                        className={`py-4 px-9 rounded-2xl border cursor-pointer font-semibold text-base no-underline transition-all duration-300 flex items-center gap-2 ${isDark ? 'bg-border-dark text-text-dark border-[#30363D]' : 'bg-gray-100 text-text border-border'}`}>
                        {isArabic ? '📖 اعرف أكتر' : '📖 Learn More'}
                    </a>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mt-[60px] w-full max-w-[700px]">
                    {stats.map((s, i) => (
                        <div key={i} className={`rounded-2xl py-5 px-3 text-center border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]'}`}>
                            <div className="text-[28px] mb-1.5">{s.icon}</div>
                            <div className="text-[22px] font-extrabold text-accent">{s.num}</div>
                            <div className={`text-[11px] mt-1 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ABOUT AUTISM */}
            <section id="learn-more" className={`py-20 px-6 ${isDark ? 'bg-card-dark' : 'bg-[#F0F0FF]'}`}>
                <div className="max-w-[900px] mx-auto text-center">
                    <h2 className={`text-[32px] font-extrabold mb-3 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? '🧠 ما هو التوحد؟' : '🧠 What is Autism?'}</h2>
                    <p className={`text-base max-w-[700px] mx-auto mb-10 leading-[1.8] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isArabic ? 'اضطراب طيف التوحد (ASD) هو حالة عصبية تؤثر على التواصل والتفاعل الاجتماعي والسلوك. ليس مرضاً يُعالج، بل اختلاف في طريقة عمل الدماغ. مع الدعم المناسب والتدخل المبكر، يمكن لأطفال التوحد تحقيق تقدم مذهل.' : "Autism Spectrum Disorder (ASD) is a neurological condition affecting communication, social interaction, and behavior. It's not a disease to cure, but a different way the brain works. With proper support and early intervention, autistic children can achieve remarkable progress."}
                    </p>
                    <div className="grid gap-3">
                        {autismFacts.map((f, i) => (
                            <div key={i} className={`flex items-center gap-4 py-4 px-5 rounded-[14px] text-start border transition-transform duration-200 hover:translate-x-1.5 ${isDark ? 'bg-bg-dark border-border-dark' : 'bg-card border-border'}`}>
                                <span className="text-[28px] shrink-0">{f.icon}</span>
                                <span className={`text-sm leading-relaxed ${isDark ? 'text-text-dark' : 'text-text'}`}>{f.fact}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className={`py-20 px-6 ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <div className="max-w-[1000px] mx-auto text-center">
                    <h2 className={`text-[32px] font-extrabold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? '✨ أدوات ذكية لدعم طفلك' : '✨ Smart Tools to Support Your Child'}</h2>
                    <p className={`text-[15px] mb-10 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'كل ما يحتاجه طفلك وعائلتك في مكان واحد' : 'Everything your child and family needs in one place'}</p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                        {features.map((f, i) => (
                            <div key={i}
                                className={`rounded-[20px] p-7 text-start border cursor-default transition-all duration-300 hover:-translate-y-1.5 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_4px_20px_rgba(0,0,0,0.04)]'}`}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}20`; e.currentTarget.style.borderColor = `${f.color}40`; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = isDark ? '#21262D' : '#E5E7EB'; }}>
                                <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] mb-4"
                                    style={{ background: `${f.color}15` }}>{f.icon}</div>
                                <h3 className={`text-[17px] font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{f.title}</h3>
                                <p className={`text-[13px] leading-relaxed m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHO IS THIS FOR */}
            <section className={`py-20 px-6 ${isDark ? 'bg-card-dark' : 'bg-[#F8F5FF]'}`}>
                <div className="max-w-[900px] mx-auto text-center">
                    <h2 className={`text-[32px] font-extrabold mb-10 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? '👥 مين يقدر يستخدم التطبيق؟' : '👥 Who Can Use This App?'}</h2>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
                        {[
                            { icon: '🎮', title: isArabic ? 'الطفل' : 'Child', color: '#FF6584', desc: isArabic ? 'يتعلم، يلعب، ويتواصل من خلال أدوات مصممة خصيصاً له بطريقة ممتعة وآمنة' : 'Learn, play, and communicate through tools designed specifically for them in a fun safe way', btn: isArabic ? 'دخول الطفل' : 'Child Login', path: '/child-login' },
                            { icon: '👨‍👩‍👧', title: isArabic ? 'ولي الأمر' : 'Parent', color: '#4ECDC4', desc: isArabic ? 'يتابع تقدم طفله، يحصل على نصائح من AI، ويتواصل مع المتخصصين' : 'Track child progress, get AI advice, and connect with specialists', btn: isArabic ? 'دخول ولي الأمر' : 'Parent Login', path: '/login' },
                            { icon: '🩺', title: isArabic ? 'الطبيب' : 'Doctor', color: '#6C63FF', desc: isArabic ? 'يتابع حالات مرضاه، يكتب تقارير، ويتواصل مع أولياء الأمور' : 'Monitor patient cases, write reports, and communicate with parents', btn: isArabic ? 'دخول الطبيب' : 'Doctor Login', path: '/doctor-auth' },
                        ].map((item, i) => (
                            <div key={i} className={`rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-1.5 ${isDark ? 'bg-bg-dark' : 'bg-card'}`}
                                style={{ border: `2px solid ${item.color}20` }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}60`; e.currentTarget.style.boxShadow = `0 12px 40px ${item.color}15`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = `${item.color}20`; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div className="text-[56px] mb-1.5">{item.icon}</div>
                                <h3 className={`text-[22px] font-extrabold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{item.title}</h3>
                                <p className={`text-[13px] leading-relaxed mb-5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{item.desc}</p>
                                <button onClick={() => navigate(item.path)}
                                    className="w-full py-3 px-7 rounded-[14px] text-white border-none cursor-pointer font-bold text-sm transition-transform duration-200 hover:scale-[1.03]"
                                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`, boxShadow: `0 4px 15px ${item.color}40` }}>
                                    {item.btn}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center bg-gradient-to-br from-accent via-[#8B5CF6] to-accent2">
                <h2 className="text-[32px] font-extrabold text-white mb-3">{isArabic ? '💜 ابدأ رحلة طفلك اليوم' : "💜 Start Your Child's Journey Today"}</h2>
                <p className="text-base text-white/85 max-w-[500px] mx-auto mb-[30px] leading-relaxed">
                    {isArabic ? 'كل يوم تأخير هو فرصة ضائعة. التدخل المبكر يصنع فرق حقيقي في حياة طفلك.' : "Every day of delay is a missed opportunity. Early intervention makes a real difference in your child's life."}
                </p>
                <button onClick={() => navigate('/choice')}
                    className="py-4 px-12 rounded-2xl bg-white text-accent border-none cursor-pointer font-extrabold text-lg shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-105">
                    {isArabic ? '🚀 سجل مجاناً' : '🚀 Sign Up Free'}
                </button>
            </section>

            {/* FOOTER */}
            <footer className={`py-10 px-6 pb-5 text-center ${isDark ? 'bg-bg-dark' : 'bg-gray-800'}`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl">🧩</span>
                    <span className="text-xl font-extrabold text-white">LearnNeur</span>
                </div>
                <p className="text-[13px] text-white/50 mb-2">{isArabic ? 'منصة دعم أطفال التوحد - مصر' : 'Autism Support Platform - Egypt'}</p>
                <p className="text-[11px] text-white/30">© 2026 LearnNeur. {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
            </footer>

            <style>{`@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }`}</style>
        </div>
    );
}
