import { Card, CardBody, Chip } from '@heroui/react';

interface LandingAboutSectionProps {
    isDark: boolean;
    T: {
        aitag: string;
        aih2: string;
        aiTitle: string;
        aip1: string;
        aip2: string;
        stats: { n: string; l: string }[];
        types: { dot: string; h: string; p: string }[];
    };
}

export default function LandingAboutSection({ isDark, T }: LandingAboutSectionProps) {
    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    return (
        <section id="about" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg} relative overflow-hidden`}>
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img src="/images/autism_bg.jpg" alt="" className={`w-full h-full object-cover transition-opacity duration-1000 ${isDark ? 'opacity-[0.60] grayscale' : 'opacity-[0.60]'}`}  loading="lazy" decoding="async"/>
                <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-lbg-dark via-transparent to-lbg-dark' : 'from-lbg via-transparent to-lbg'}`} />
            </div>

            <div className="relative z-10 text-center mb-10 md:mb-14">
                <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.aitag}</Chip>
                <h2 className="text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] text-[#0C1A2E]">{T.aih2}</h2>
                <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 relative z-10">
                <div>
                    <h2 className="text-[clamp(20px,2.5vw,34px)] font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">{T.aiTitle}</h2>
                    <div className="w-12 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 my-3" />
                    <p className="text-slate-800 text-[15px] leading-[1.85] mb-3.5 font-medium">{T.aip1}</p>
                    <p className="text-slate-800 text-[15px] leading-[1.85] mb-3.5 font-medium">{T.aip2}</p>
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
    );
}
