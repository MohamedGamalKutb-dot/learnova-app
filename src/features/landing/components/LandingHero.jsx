import { Button, Card, CardBody, Chip } from '@heroui/react';

export default function LandingHero({ isDark, isArabic, T, heroCards, scrollTo }) {
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkTxt3 = isDark ? 'text-ltxt3-dark' : 'text-ltxt3';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const darkShad = isDark ? 'shadow-[0_4px_20px_rgba(6,182,212,.12)]' : 'shadow-[0_4px_20px_rgba(37,99,235,.10)]';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    return (
        <section id="hero" className="min-h-screen flex items-center pt-[132px] pb-20 px-5 md:px-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_35%,rgba(59,130,246,.09)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_15%_75%,rgba(6,182,212,.07)_0%,transparent_60%)] z-0" />
            <div className="absolute inset-0 dot-grid opacity-35 z-0" />
            
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <img src="/images/autism_bg.png" alt="" className={`w-full h-full object-cover transition-opacity duration-1000 ${isDark ? 'opacity-[40] grayscale' : 'opacity-[40]'}`}  loading="lazy" decoding="async"/>
                <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-lbg-dark via-transparent to-transparent' : 'from-lsurf via-transparent to-transparent'}`} />
            </div>

            <div className="relative z-10 max-w-[600px]">
                <Chip variant="bordered" className={`${tagBg} text-p600 font-semibold mb-7 border`}>{T.heroPill}</Chip>
                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] ${darkTxt}`}>
                    {T.heroH1a}<br />{T.heroH1b}<span className="bg-gradient-to-br from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </h1>
                <p className={`text-[15px] md:text-[17px] ${darkTxt2} leading-[1.8] mb-10 max-w-[520px]`}>{T.heroSub}</p>
                <div className="flex gap-3 flex-wrap">
                    <Button radius="lg" className="bg-gradient-to-br from-p600 to-p700 text-white font-jakarta py-3.5 px-7 text-[15px] font-bold shadow-[0_6px_24px_rgba(37,99,235,.30)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(37,99,235,.40)]"
                        onPress={() => scrollTo('login')}>{T.heroBtn1}</Button>
                    <Button variant="bordered" radius="lg" className={`${darkSurf} ${darkTxt} ${darkBdr} font-jakarta py-3.5 px-7 text-[15px] font-semibold hover:bg-lbg2`}
                        onPress={() => scrollTo('about')}>{T.heroBtn2}</Button>
                </div>
            </div>

            <div className={`hidden lg:flex absolute ${isArabic ? 'left-14' : 'right-14'} top-1/2 -translate-y-1/2 flex-col gap-3.5 w-[260px]`}>
                {heroCards.map((c, i) => (
                    <Card key={i} className={`${darkSurf} border ${darkBdr} ${darkShad} ${c.cls}`}>
                        <CardBody className="py-4 px-[18px] flex flex-row items-center gap-3.5">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${c.bg}`}>
                                {c.icon.includes('.png') ? <img src={c.icon} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/> : <span className="text-[22px]">{c.icon}</span>}
                            </div>
                            <div className="flex-1">
                                <div className={`text-[13px] font-bold ${darkTxt}`}>{c.t}</div>
                                <div className={`text-[11px] ${darkTxt3} mt-0.5`}>{c.s}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        </CardBody>
                    </Card>
                ))}
            </div>
        </section>
    );
}
