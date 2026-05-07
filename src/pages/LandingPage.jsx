import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import {
    Button, Card, CardBody, Chip, Divider, Navbar, NavbarBrand, NavbarContent, NavbarItem
} from '@heroui/react';
import { getLandingData } from '../data/landingData';
import { FaGamepad, FaChartLine, FaComments, FaCalendarAlt, FaStethoscope, FaBookOpen } from 'react-icons/fa';

export default function LandingPage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    const { T, navIds, loginCards, heroCards } = getLandingData(isArabic);

    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkBg2 = isDark ? 'bg-lbg2-dark' : 'bg-lbg2';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkTxt3 = isDark ? 'text-ltxt3-dark' : 'text-ltxt3';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const darkShad = isDark ? 'shadow-[0_4px_20px_rgba(6,182,212,.12)]' : 'shadow-[0_4px_20px_rgba(37,99,235,.10)]';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';
    const navBtnCls = `font-jakarta text-[13px] font-semibold ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`;

    return (
        <div className={`font-jakarta ${darkBg} ${darkTxt} overflow-x-hidden transition-colors duration-300 min-h-screen`} dir={isArabic ? 'rtl' : 'ltr'}>

            {/* ===== NAVBAR (HeroUI) ===== */}
            <Navbar
                maxWidth="full"
                isBordered
                className={`fixed top-0 inset-x-0 h-[72px] z-[999] backdrop-blur-[18px] transition-colors duration-300 ${isDark ? 'bg-[rgba(8,14,28,.92)]' : 'bg-[rgba(255,255,255,.88)]'}`}
                classNames={{ wrapper: 'px-5 md:px-14 gap-3' }}
            >
                <NavbarBrand className="gap-2.5 shrink-0 cursor-pointer" onClick={() => scrollTo('hero')}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-p600 to-a500 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,.25)] overflow-hidden">
                        <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                    </div>
                    <span className="text-[21px] font-extrabold tracking-tight bg-gradient-to-r from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </NavbarBrand>

                {/* Desktop Nav Links */}
                <NavbarContent className="hidden md:flex gap-0.5 mx-auto" justify="center">
                    {navIds.map((id, i) => (
                        <NavbarItem key={id}>
                            <Button variant="light" size="sm" radius="lg"
                                className={`${darkTxt2} text-sm font-semibold hover:bg-p50 hover:text-p600 ${isDark ? 'hover:bg-lbg2-dark' : ''}`}
                                onPress={() => scrollTo(id)}>{T.nl[i]}</Button>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                {/* Nav Controls */}
                <NavbarContent justify="end" className="gap-2 shrink-0">
                    <NavbarItem>
                        <Button size="sm" variant="bordered" className={navBtnCls} onPress={() => navigate('/settings')}>
                            {isArabic ? 'الإعدادات' : 'Settings'}
                        </Button>
                    </NavbarItem>
                    <NavbarItem>
                        <Button
                            size="sm"
                            className="bg-gradient-to-br from-p600 to-a500 text-white font-bold shadow-lg shadow-p500/20"
                            onPress={() => navigate('/choice')}
                        >
                            {T.regBtn}
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="md:hidden">
                        <Button isIconOnly size="sm" variant="light" className="text-xl" onPress={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={`fixed top-[72px] inset-x-0 z-[998] ${isDark ? 'bg-lbg-dark' : 'bg-lsurf'} border-b ${darkBdr} p-4 flex flex-col gap-2 md:hidden shadow-lg`}>
                    {navIds.map((id, i) => (
                        <Button key={id} variant="light" radius="lg" className={`${darkTxt2} text-base font-semibold justify-start hover:bg-p50 hover:text-p600 ${isDark ? 'hover:bg-lbg2-dark' : ''}`}
                            onPress={() => scrollTo(id)}>{T.nl[i]}</Button>
                    ))}
                    <Button className="font-jakarta text-sm font-semibold bg-gradient-to-br from-p600 to-p700 text-white shadow-[0_4px_14px_rgba(37,99,235,.28)] mt-2 sm:hidden"
                        onPress={() => { navigate('/choice'); setMenuOpen(false); }}>{T.regBtn}</Button>
                </div>
            )}

            {/* ===== HERO ===== */}
            <section id="hero" className="min-h-screen flex items-center pt-[132px] pb-20 px-5 md:px-14 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_35%,rgba(59,130,246,.09)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_15%_75%,rgba(6,182,212,.07)_0%,transparent_60%)] z-0" />
                <div className="absolute inset-0 dot-grid opacity-35 z-0" />
                
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img src="/images/autism_bg.png" 
                        alt="" 
                        className={`w-full h-full object-cover transition-opacity duration-1000 ${isDark ? 'opacity-[40] grayscale' : 'opacity-[40]'}`} 
                     loading="lazy" decoding="async"/>
                    <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-lbg-dark via-transparent to-transparent' : 'from-lsurf via-transparent to-transparent'}`} />
                </div>

                <div className="relative z-10 max-w-[600px]">
                    <Chip variant="bordered" className={`${tagBg} text-p600 font-semibold mb-7 border`}>{T.heroPill}</Chip>
                    <h1 className={`text-[clamp(28px,4.5vw,60px)] font-extrabold leading-[1.12] tracking-tight mb-5 ${darkTxt}`}>
                        {T.heroH1a}<br />{T.heroH1b}<span className="bg-gradient-to-br from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                    </h1>
                    <p className={`text-[15px] md:text-[17px] ${darkTxt2} leading-[1.8] mb-10 max-w-[520px]`}>{T.heroSub}</p>
                    <div className="flex gap-3 flex-wrap">
                        <Button radius="lg" className="bg-gradient-to-br from-p600 to-p700 text-white font-jakarta py-3.5 px-7 text-[15px] font-bold shadow-[0_6px_24px_rgba(37,99,235,.30)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(37,99,235,.40)]"
                            onPress={() => scrollTo('login')}>{T.heroBtn1}</Button>
                        <Button variant="bordered" radius="lg" className={`${darkSurf} ${darkTxt} ${darkBdr} font-jakarta py-3.5 px-7 text-[15px] font-semibold hover:bg-lbg2`}
                            onPress={() => scrollTo('about')}>{T.heroBtn2}</Button>
                    </div>
                </div>
                {/* Hero Cards */}
                <div className={`hidden lg:flex absolute ${isArabic ? 'left-14' : 'right-14'} top-1/2 -translate-y-1/2 flex-col gap-3.5 w-[260px]`}>
                    {heroCards.map((c, i) => (
                        <Card key={i} className={`${darkSurf} border ${darkBdr} ${darkShad} ${c.cls}`}>
                            <CardBody className="py-4 px-[18px] flex flex-row items-center gap-3.5">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${c.bg}`}>
                                    {c.icon.includes('.png') ? <img src={c.icon} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/> : <span className="text-[22px]">{c.icon}</span>}
                                </div>
                                <div className="flex-1">
                                    <div className={`text-[13px] font-bold ${darkTxt}`}>{c.t}</div>
                                    <div className={`text-[11px] ${darkTxt3} mt-0.5`}>{c.s}</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== LOGIN SECTION ===== */}
            <section id="login" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg2}`}>
                <div className="text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.ltag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.lh2}</h2>
                    <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.lsub}</p>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
                    {loginCards.map((c, i) => (
                        <Card key={i} isPressable onPress={() => navigate(c.path)}
                            className={`${darkSurf} border ${darkBdr} rounded-2xl pt-10 px-7 pb-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(37,99,235,.10)]`}>
                            <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${c.topC}`} />
                            <CardBody className="p-0 flex flex-col items-center">
                                <div className={`w-[76px] h-[76px] rounded-[22px] flex items-center justify-center mb-5 overflow-hidden ${c.iconBg}`}>
                                    <img src={c.icon} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${darkTxt}`}>{c.h}</h3>
                                <p className={`${darkTxt2} text-sm leading-[1.65] mb-6`}>{c.p}</p>
                                <Button size="sm" radius="lg" className={`${c.btnBg} text-white font-bold font-jakarta hover:scale-105`} onPress={() => navigate(c.path)}>{c.btn}</Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== ABOUT AUTISM ===== */}
            <section id="about" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg} relative overflow-hidden`}>
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img src="/images/autism_bg.jpg" 
                        alt="" 
                        className={`w-full h-full object-cover transition-opacity duration-1000 ${isDark ? 'opacity-[0.60] grayscale' : 'opacity-[0.60]'}`} 
                     loading="lazy" decoding="async"/>
                    <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-lbg-dark via-transparent to-lbg-dark' : 'from-lbg via-transparent to-lbg'}`} />
                </div>

                <div className="relative z-10 text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.aitag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.aih2}</h2>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                    <div>
                        <h2 className={`text-[clamp(20px,2.5vw,34px)] font-extrabold tracking-tight mb-2 ${darkTxt}`}>{T.aiTitle}</h2>
                        <div className="w-12 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 my-3" />
                        <p className={`${darkTxt2} text-[15px] leading-[1.85] mb-3.5`}>{T.aip1}</p>
                        <p className={`${darkTxt2} text-[15px] leading-[1.85] mb-3.5`}>{T.aip2}</p>
                        <div className="grid grid-cols-2 gap-3.5 mt-7">
                            {T.stats.map((s, i) => (
                                <Card key={i} className={`${darkSurf} border ${darkBdr}`}>
                                    <CardBody className="p-5">
                                        <div className="text-[28px] font-black text-p600">{s.n}</div>
                                        <div className={`text-[13px] ${darkTxt2} mt-1 leading-[1.4]`}>{s.l}</div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3.5">
                        {T.types.map((t, i) => (
                            <Card key={i} className={`${darkSurf} border ${darkBdr} transition-all duration-200 hover:border-p300 hover:shadow-[0_6px_24px_rgba(37,99,235,.10)]`}>
                                <CardBody className="py-[18px] px-[22px] flex flex-row gap-3.5 items-start">
                                    <div className="w-2.5 h-2.5 rounded-full mt-[5px] shrink-0" style={{ background: t.dot }} />
                                    <div>
                                        <h4 className={`text-[15px] font-bold mb-1 ${darkTxt}`}>{t.h}</h4>
                                        <p className={`text-[13px] ${darkTxt2} leading-[1.6] m-0`}>{t.p}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TIPS ===== */}
            <section id="tips" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg2}`}>
                <div className="text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.titag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.tih2}</h2>
                    <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.tisub}</p>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
                    {T.tips.map((tip, i) => (
                        <Card key={i} className={`${darkSurf} border ${darkBdr} transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_32px_rgba(37,99,235,.10)]`}>
                            <CardBody className="p-6 flex flex-row gap-4">
                                <div className="w-[42px] h-[42px] rounded-xl shrink-0 bg-gradient-to-br from-p600 to-a500 text-white text-base font-extrabold flex items-center justify-center">{i + 1}</div>
                                <div>
                                    <h4 className={`text-[15px] font-bold mb-1.5 ${darkTxt}`}>{tip.h}</h4>
                                    <p className={`text-[13px] ${darkTxt2} leading-[1.65] m-0`}>{tip.p}</p>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== TOOLS ===== */}
            <section id="tools" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg}`}>
                <div className="text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.tltag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.tlh2}</h2>
                    <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.tlsub}</p>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {T.tools.map((tool, i) => (
                        <Card key={i} className={`group ${darkSurf} border ${darkBdr} transition-all duration-300 relative overflow-hidden hover:-translate-y-[5px] hover:shadow-[0_18px_44px_rgba(37,99,235,.10)]`}>
                            <div className="toolcard-bar absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-p500 to-a500" />
                            <CardBody className="py-8 px-[26px]">
                                <div className={`w-16 h-16 mb-4 flex items-center justify-center rounded-2xl shadow-lg shadow-p500/20 bg-gradient-to-br 
                                    ${i === 0 ? 'from-p600 to-p400' : 
                                      i === 1 ? 'from-a600 to-a400' : 
                                      i === 2 ? 'from-emerald-600 to-emerald-400' : 
                                      i === 3 ? 'from-orange-600 to-orange-400' : 
                                      i === 4 ? 'from-violet-600 to-violet-400' : 
                                      'from-pink-600 to-pink-400'}`}>
                                    {i === 0 && <FaGamepad className="w-8 h-8 text-white" />}
                                    {i === 1 && <FaChartLine className="w-8 h-8 text-white" />}
                                    {i === 2 && <FaComments className="w-8 h-8 text-white" />}
                                    {i === 3 && <FaCalendarAlt className="w-8 h-8 text-white" />}
                                    {i === 4 && <FaStethoscope className="w-8 h-8 text-white" />}
                                    {i === 5 && <FaBookOpen className="w-8 h-8 text-white" />}
                                </div>
                                <h3 className={`text-[17px] font-bold mb-2 ${darkTxt}`}>{tool.h}</h3>
                                <p className={`${darkTxt2} text-sm leading-[1.7] m-0`}>{tool.p}</p>
                                <Chip size="sm" variant="bordered" className={`mt-4 ${tagBg} text-p600 text-[11px] font-bold tracking-[.5px] border`}>{tool.badge}</Chip>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <div className="bg-gradient-to-br from-p600 via-p700 to-[#1e3a8a] py-16 md:py-20 px-5 md:px-14 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(255,255,255,.05)_0%,transparent_70%)]" />
                <h2 className="text-[clamp(24px,3vw,40px)] font-extrabold text-white mb-3 relative">{T.ctah2}</h2>
                <p className="text-white/75 text-base mb-8 relative">{T.ctap}</p>
                <Button radius="lg" className="relative bg-white text-p700 py-3.5 px-[30px] text-[15px] font-bold font-jakarta shadow-[0_6px_24px_rgba(0,0,0,.18)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,0,0,.24)]"
                    onPress={() => navigate('/choice')}>{T.ctabtn}</Button>
            </div>

            {/* ===== FOOTER ===== */}
            <footer id="footer" className="bg-[#060D1C] text-[#94A3B8] py-14 md:py-[72px] px-5 md:px-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr] gap-10 mb-12">
                    <div>
                        <h3 className="text-[22px] font-extrabold bg-gradient-to-r from-p400 to-a400 bg-clip-text [-webkit-text-fill-color:transparent] mb-3 flex items-center gap-2">
                            <img src="/icons/brain_logo.png" alt="" className="w-6 h-6 object-contain"  loading="lazy" decoding="async"/> LearnNeur
                        </h3>
                        <p className="text-sm leading-[1.8] text-[#64748B] max-w-[280px]">{T.footdesc}</p>
                    </div>
                    <div>
                        <h4 className="text-[#F1F5F9] text-[13px] font-bold mb-4 tracking-[.5px] uppercase">{T.fc1h}</h4>
                        <ul className="list-none p-0 m-0">
                            {T.fc1.map((t, i) => <li key={i} className="mb-2.5"><a href="#" className="text-[#64748B] no-underline text-[13px] transition-colors duration-200 hover:text-a400">{t}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#F1F5F9] text-[13px] font-bold mb-4 tracking-[.5px] uppercase">{T.fc2h}</h4>
                        <ul className="list-none p-0 m-0">
                            {T.fc2.map((item, i) => <li key={i} className="mb-2.5"><a href="#" onClick={e => { e.preventDefault(); navigate(item.p); }} className="text-[#64748B] no-underline text-[13px] transition-colors duration-200 hover:text-a400">{item.t}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#F1F5F9] text-[13px] font-bold mb-4 tracking-[.5px] uppercase">{T.fc3h}</h4>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2.5"><a href="#" className="text-[#64748B] no-underline text-[13px]">info@learnneur.com</a></li>
                            {T.fc3.map((t, i) => <li key={i} className="mb-2.5"><a href="#" className="text-[#64748B] no-underline text-[13px] transition-colors duration-200 hover:text-a400">{t}</a></li>)}
                        </ul>
                    </div>
                </div>
                <Divider className="bg-[#1E293B] mb-6" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[#475569]">
                    <span>{T.footcopy}</span>
                    <div className="flex gap-2.5">
                        {['𝕏', 'in', '▶', 'f'].map((s, i) => (
                            <a key={i} href="#" className="w-9 h-9 rounded-[10px] bg-[#1E293B] border border-[#334155] flex items-center justify-center text-sm cursor-pointer transition-all duration-200 no-underline text-[#94A3B8] hover:bg-p600 hover:border-p600 hover:text-white">{s}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
