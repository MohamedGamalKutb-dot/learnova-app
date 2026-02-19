import { useState, useEffect } from "react";
import {
    Navbar as NextNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle, // Was missing in destructured imports used in code
    NavbarMenu,       // Was missing
    NavbarMenuItem,   // Was missing
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from "@heroui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../common/Logo";
import { Book1, Home2, LogoutCurve, Profile, Setting2 } from "iconsax-react";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/", icon: <Home2 size={18} /> },
        { name: "Courses", path: "/courses", icon: <Book1 size={18} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <NextNavbar
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="xl"
            position="sticky"
            className={`transition-all duration-300 ${scrolled
                ? "bg-[#060609]/80 backdrop-blur-xl shadow-lg border-b border-white/5 py-2"
                : "bg-transparent py-4"
                }`}
            isBordered={false}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-white"
                />
                <NavbarBrand>
                    <Link
                        as={RouterLink}
                        to="/"
                        className="flex items-center gap-3 transition-transform hover:scale-105 no-underline"
                    >
                        <div className="w-10 h-10">
                            <Logo className="w-full h-full" showText={false} />
                        </div>
                        <span className="font-bold text-lg sm:text-2xl gradient-text tracking-wide">
                            LearnNeur
                        </span>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-6" justify="center">
                {navLinks.map((link) => (
                    <NavbarItem key={link.path} isActive={location.pathname === link.path}>
                        <Link
                            as={RouterLink}
                            to={link.path}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors no-underline ${location.pathname === link.path
                                ? "text-indigo-400"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                {isAuthenticated ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name={user?.name || "User"}
                                size="sm"
                                isBordered
                                src={user?.avatar}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User menu" variant="flat">
                            <DropdownItem key="profile-info" className="h-14 gap-2" textValue="Profile info">
                                <p className="font-semibold text-sm">{user?.name}</p>
                                <p className="text-xs text-gray-400">{user?.email}</p>
                            </DropdownItem>
                            <DropdownItem
                                key="dashboard"
                                startContent={<Profile size={16} />}
                                onPress={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </DropdownItem>
                            <DropdownItem
                                key="settings"
                                startContent={<Setting2 size={16} />}
                                onPress={() => navigate("/settings")}
                            >
                                Settings
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                startContent={<LogoutCurve size={16} />}
                                onPress={handleLogout}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem className="flex gap-2">
                        <Button
                            as={Link}
                            to="/login"
                            variant="light"
                            size="sm"
                            className="text-gray-300 hover:text-white"
                        >
                            Login
                        </Button>
                        <Button
                            as={Link}
                            to="/register"
                            size="sm"
                            className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg shadow-indigo-500/25"
                        >
                            Sign Up
                        </Button>
                    </NavbarItem>
                )}
            </NavbarContent>

            <NavbarMenu className="bg-[#0a0a0f]/95 backdrop-blur-xl pt-6">
                {navLinks.map((link) => (
                    <NavbarMenuItem key={link.path}>
                        <Link
                            as={RouterLink}
                            to={link.path}
                            className={`w-full flex items-center gap-3 py-2 text-base no-underline ${location.pathname === link.path
                                ? "text-indigo-400 font-semibold"
                                : "text-gray-400"
                                }`}
                            onPress={() => setIsMenuOpen(false)}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
                {!isAuthenticated && (
                    <>
                        <NavbarMenuItem>
                            <Link
                                as={RouterLink}
                                to="/login"
                                className="w-full text-gray-300 py-2 no-underline block"
                                onPress={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Link
                                as={RouterLink}
                                to="/register"
                                className="w-full text-indigo-400 font-semibold py-2 no-underline block"
                                onPress={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </NavbarMenuItem>
                    </>
                )}
            </NavbarMenu>
        </NextNavbar>
    );
}
