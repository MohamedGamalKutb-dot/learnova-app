import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react';

interface LandingNavbarProps {
    isDark: boolean;
    isArabic: boolean;
    T: {
        nl: string[];
        regBtn: string;
    };
    navIds: string[];
    navigate: (path: string) => void;
    scrollTo: (id: string) => void;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

export default function LandingNavbar({ isDark, isArabic, T, navIds, navigate, scrollTo, menuOpen, setMenuOpen }: LandingNavbarProps) {
    const navBtnCls = `font-jakarta text-[13px] font-semibold ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`;

    return (
        <>
            <Navbar maxWidth="full" isBordered className={`fixed top-0 inset-x-0 h-[72px] z-[999] backdrop-blur-[18px] transition-colors duration-300 ${isDark ? 'bg-[rgba(8,14,28,.92)]' : 'bg-[rgba(255,255,255,.88)]'}`} classNames={{ wrapper: 'px-5 md:px-14 gap-3' }}>
                <NavbarBrand className="gap-2.5 shrink-0 cursor-pointer" onClick={() => scrollTo('hero')}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-p600 to-a500 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,.25)] overflow-hidden">
                        <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                    </div>
                    <span className="text-[21px] font-extrabold tracking-tight bg-gradient-to-r from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </NavbarBrand>

                <NavbarContent className="hidden md:flex gap-0.5 mx-auto" justify="center">
                    {navIds.map((id, i) => (
                        <NavbarItem key={id}>
                            <Button variant="light" size="sm" radius="lg" className={`${isDark ? 'text-ltxt2-dark hover:bg-lbg2-dark' : 'text-ltxt2 hover:bg-p50'} text-sm font-semibold hover:text-p600`} onPress={() => scrollTo(id)}>{T.nl[i]}</Button>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end" className="gap-2 shrink-0">
                    <NavbarItem>
                        <Button size="sm" variant="bordered" className={navBtnCls} onPress={() => navigate('/settings')}>
                            {isArabic ? 'الإعدادات' : 'Settings'}
                        </Button>
                    </NavbarItem>
                    <NavbarItem>
                        <Button size="sm" className="bg-gradient-to-br from-p600 to-a500 text-white font-bold shadow-lg shadow-p500/20" onPress={() => navigate('/choice')}>
                            {T.regBtn}
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="md:hidden">
                        <Button isIconOnly size="sm" variant="light" className="text-xl" onPress={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            {menuOpen && (
                <div className={`fixed top-[72px] inset-x-0 z-[998] ${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-lsurf border-lbdr'} border-b p-4 flex flex-col gap-2 md:hidden shadow-lg`}>
                    {navIds.map((id, i) => (
                        <Button key={id} variant="light" radius="lg" className={`${isDark ? 'text-ltxt2-dark hover:bg-lbg2-dark' : 'text-ltxt2 hover:bg-p50'} text-base font-semibold justify-start hover:text-p600`} onPress={() => scrollTo(id)}>{T.nl[i]}</Button>
                    ))}
                    <Button className="font-jakarta text-sm font-semibold bg-gradient-to-br from-p600 to-p700 text-white shadow-[0_4px_14px_rgba(37,99,235,.28)] mt-2 sm:hidden" onPress={() => { navigate('/choice'); setMenuOpen(false); }}>{T.regBtn}</Button>
                </div>
            )}
        </>
    );
}
