import { Link } from "react-router-dom";
import { Heart, Instagram, Facebook, Send2 } from "iconsax-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#060609] border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 no-underline mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <span className="font-bold text-xl gradient-text">LearnNeur</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your modern learning platform. Discover courses, build skills, and
                            achieve your goals.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {["Home", "Courses", "About", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={`/${item.toLowerCase()}`}
                                        className="text-gray-500 hover:text-indigo-400 text-sm transition-colors no-underline"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                            Support
                        </h4>
                        <ul className="space-y-2">
                            {["FAQ", "Help Center", "Privacy Policy", "Terms of Service"].map(
                                (item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-gray-500 hover:text-indigo-400 text-sm transition-colors no-underline"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                            Follow Us
                        </h4>
                        <div className="flex gap-3">
                            {[
                                { icon: <Instagram size={18} />, label: "Instagram" },
                                { icon: <Facebook size={18} />, label: "Facebook" },
                                { icon: <Send2 size={18} />, label: "Telegram" },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all no-underline"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs">
                        &copy; {currentYear} LearnNeur. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        Made with <Heart size={12} variant="Bold" className="text-pink-500" /> by
                        LearnNeur Team
                    </p>
                </div>
            </div>
        </footer>
    );
}
