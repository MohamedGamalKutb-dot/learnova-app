import { Card, CardBody, Chip } from '@heroui/react';

interface LandingTipsSectionProps {
    isDark: boolean;
    T: {
        titag: string;
        tih2: string;
        tisub: string;
        tips: { h: string; p: string }[];
    };
}

export default function LandingTipsSection({ isDark, T }: LandingTipsSectionProps) {
    const darkBg2 = isDark ? 'bg-lbg2-dark' : 'bg-lbg2';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    return (
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
    );
}
