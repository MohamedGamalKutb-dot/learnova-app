import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button } from '@heroui/react';
import { useAuth } from '../context/AuthContext';

export default function MainNavbar({ userType, onProfileClick }) {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const { currentChild, currentParent, currentDoctor, logoutChild, logoutParent, logoutDoctor } = useAuth();

    let user = null;
    let logoutFn = null;

    if (userType === 'child') {
        user = currentChild;
        logoutFn = logoutChild;
    } else if (userType === 'parent') {
        user = currentParent;
        logoutFn = logoutParent;
    } else if (userType === 'doctor') {
        user = currentDoctor;
        logoutFn = logoutDoctor;
    }

    const handleLogout = () => {
        if (logoutFn) logoutFn();
        navigate('/choice');
    };

    if (!user) return null;

    const avatarSrc = user?.avatar?.length > 10 ? user.avatar : undefined;
    const avatarFallback = user?.avatar?.length <= 2 ? user.avatar : '👤';

    return (
        <Navbar
            maxWidth="full"
            isBordered
            classNames={{
                base: `fixed top-0 inset-x-0 z-50 backdrop-blur-[16px] transition-all duration-500 ${isDark ? 'bg-[#080912]/80 border-white/5' : 'bg-white/80 border-slate-200'}`,
                wrapper: 'px-5 md:px-12'
            }}
        >
            <NavbarBrand className="gap-2.5 cursor-pointer" onClick={() => navigate(userType === 'child' ? '/child-home' : userType === 'parent' ? '/parent-dashboard' : '/doctor-dashboard')}>
                <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-p600 to-a500 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,.25)] overflow-hidden">
                    <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                </div>
                <span className={`text-xl font-extrabold tracking-tight bg-gradient-to-r ${isDark ? 'from-indigo-300 to-purple-300' : 'from-indigo-600 to-purple-600'} bg-clip-text text-transparent`}>LearnNeur</span>
            </NavbarBrand>

            <NavbarContent justify="end" className="gap-2">
                <NavbarItem>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <span className={`hidden sm:block font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.name}</span>
                                <Avatar
                                    isBordered
                                    as="button"
                                    color="primary"
                                    size="sm"
                                    src={avatarSrc}
                                    icon={!avatarSrc ? <span className="text-lg">{avatarFallback}</span> : undefined}
                                    className="transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(168,180,255,0.3)]"
                                />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile_info" className="h-14 gap-2" textValue="Profile Info">
                                <p className="font-semibold">{isArabic ? 'مرحباً،' : 'Signed in as'}</p>
                                <p className="font-bold">{user.email || user.name}</p>
                            </DropdownItem>
                            <DropdownItem key="profile" startContent={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} onPress={() => {
                                if (userType === 'child') navigate('/profile');
                                else if (userType === 'parent') navigate('/parent-dashboard/profile');
                                else if (userType === 'doctor') navigate('/doctor-dashboard/profile');
                            }}>
                                {isArabic ? 'الملف الشخصي' : 'Profile'}
                            </DropdownItem>
                            <DropdownItem key="settings" startContent={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>} onPress={() => navigate('/settings')}>
                                {isArabic ? 'الإعدادات' : 'Settings'}
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" className="text-danger" startContent={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isArabic ? "rotate-180" : ""}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>} onPress={handleLogout}>
                                {isArabic ? 'تسجيل الخروج' : 'Log Out'}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
