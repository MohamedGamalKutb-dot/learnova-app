import { Button, Card, CardBody, Chip } from '@heroui/react';
// Safelist for dynamic classes to prevent Tailwind from purging them
const SAFELIST = [
  'from-violet-500', 'to-violet-600', 'from-violet-100', 'to-violet-200',
  'from-cyan-500', 'to-cyan-600', 'from-cyan-100', 'to-cyan-200',
  'from-emerald-500', 'to-emerald-600', 'from-emerald-100', 'to-emerald-200',
  'from-p500', 'to-p600', 'bg-gradient-to-br'
];


export default function LandingLoginSection({ isDark, T, loginCards, navigate }) {
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkBg2 = isDark ? 'bg-lbg2-dark' : 'bg-lbg2';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    return (
        <section id="login" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg2}`}>
            <div className="text-center mb-10 md:mb-14">
                <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.ltag}</Chip>
                <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.lh2}</h2>
                <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.lsub}</p>
                <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
                {loginCards.map((c, i) => (
                    <Card key={i} isPressable onPress={() => navigate(c.path)}
                        className={`${darkSurf} border ${darkBdr} rounded-2xl pt-10 px-7 pb-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(37,99,235,.10)]`}>
                        <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${c.topC}`} />
                        <CardBody className="p-0 flex flex-col items-center">
                            <div className={`w-[76px] h-[76px] rounded-[22px] flex items-center justify-center mb-5 overflow-hidden ${c.iconBg}`}>
                                <img src={c.icon} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${darkTxt}`}>{c.h}</h3>
                            <p className={`${darkTxt2} text-sm leading-[1.65] mb-6`}>{c.p}</p>
                            <Button size="sm" radius="lg" className={`${c.btnBg} text-white font-bold font-jakarta hover:scale-105`} onPress={() => navigate(c.path)}>{c.btn}</Button>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </section>
    );
}
