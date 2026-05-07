import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useState, useMemo } from 'react';
import {
    Button, Card, CardBody, CardFooter, Chip, Divider, Input,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Navbar, NavbarBrand, NavbarContent, NavbarItem,
    useDisclosure
} from '@heroui/react';

import { getChoiceData } from '../data/choiceData';

export default function ChoicePage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();

    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    const { T, cards } = getChoiceData(isArabic);

    return (
        <div className={`font-jakarta min-h-screen flex flex-col ${darkBg} ${darkTxt} transition-colors duration-300`} dir={isArabic ? 'rtl' : 'ltr'}>
            <Navbar maxWidth="full" isBordered classNames={{ base: `sticky top-0 z-[99] backdrop-blur-[16px] ${isDark ? 'bg-[rgba(8,14,28,.90)]' : 'bg-[rgba(255,255,255,.85)]'}`, wrapper: 'px-5 md:px-12' }}>
                <NavbarBrand className="gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-p600 to-a500 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,.25)] overflow-hidden">
                        <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </NavbarBrand>
                <NavbarContent justify="end" className="gap-2">
                    <NavbarItem>
                        <Button size="sm" variant="bordered" className={`font-jakarta text-[13px] font-semibold ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`} onPress={() => navigate('/settings')}>
                            {isArabic ? 'الإعدادات' : 'Settings'}
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(59,130,246,.07)_0%,transparent_70%)]" />
                <div className="relative text-center mb-10 max-w-[520px]">
                    <Chip variant="bordered" className={`${tagBg} text-p600 font-bold mb-5`}>{T.eyebrow}</Chip>
                    <h1 className={`text-[clamp(28px,4vw,44px)] font-extrabold mb-3.5 ${darkTxt}`}>{T.pageTitle1}<span className="bg-gradient-to-br from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">{T.pageTitleGrad}</span></h1>
                    <p className={`${darkTxt2} text-base`}>{T.pageDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[920px]">
                    {cards.map((card, idx) => (
                        <Card key={card.id} isPressable onPress={() => navigate(card.loginPath)} className={`${darkSurf} border-2 ${card.borderCls} rounded-3xl p-8 text-center transition-all hover:-translate-y-2 group shadow-sm hover:shadow-xl`}>
                            <CardBody className="p-0 flex flex-col items-center">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden ${card.bubbleCls}`}>
                                    <img src={card.id === 'doctor' ? '/icons/doctor_consultation.png' : card.icon} alt={card.title} className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                                </div>
                                <div className={`text-xl font-extrabold mb-2 ${darkTxt}`}>{card.title}</div>
                                <div className={`${darkTxt2} text-sm mb-6`}>{card.desc}</div>
                                <ul className="w-full space-y-2 mb-6 text-sm">
                                    {card.features.map((f, i) => (
                                        <li key={i} className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                            <span className={`${card.dotCls} w-6 h-6 flex items-center justify-center rounded-full overflow-hidden`}>
                                                {f.icon ? <img src={f.icon} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/> : f.emoji}
                                            </span> {f.text}
                                        </li>
                                    ))}
                                </ul>
                                <Button fullWidth className={`font-bold text-white ${card.btnGrad}`} onPress={() => navigate(card.loginPath)}>{card.btn}</Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
