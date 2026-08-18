import { Card, CardBody, Chip } from '@heroui/react';
import { FaGamepad, FaChartLine, FaComments, FaCalendarAlt, FaStethoscope, FaBookOpen } from 'react-icons/fa';

interface LandingToolsSectionProps {
    isDark: boolean;
    T: {
        tltag: string;
        tlh2: string;
        tlsub: string;
        tools: { h: string; p: string; badge: string }[];
    };
}

export default function LandingToolsSection({ isDark, T }: LandingToolsSectionProps) {
    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    return (
        <section id="tools" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg}`}>
            <div className="text-center mb-10 md:mb-14">
                <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.tltag}</Chip>
                <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.tlh2}</h2>
                <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.tlsub}</p>
                <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
            </div>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
    );
}
