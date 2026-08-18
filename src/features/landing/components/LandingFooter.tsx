import { Divider } from '@heroui/react';

interface LandingFooterProps {
    T: {
        footdesc: string;
        fc1h: string;
        fc1: string[];
        fc2h: string;
        fc2: { t: string; p: string }[];
        fc3h: string;
        fc3: string[];
        footcopy: string;
    };
    navigate: (path: string) => void;
}

export default function LandingFooter({ T, navigate }: LandingFooterProps) {
    return (
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
    );
}
