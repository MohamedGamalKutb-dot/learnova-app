import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

interface ChoiceNavbarProps {
    isDark: boolean;
    isArabic: boolean;
}

export default function ChoiceNavbar({ isDark, isArabic }: ChoiceNavbarProps) {
    const navigate = useNavigate();

    return (
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
    );
}
