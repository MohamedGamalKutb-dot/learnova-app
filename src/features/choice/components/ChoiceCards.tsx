import { Card, CardBody, Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

interface ChoiceCardData {
    id: string;
    loginPath: string;
    borderCls: string;
    bubbleCls: string;
    icon: string;
    title: string;
    desc: string;
    features: { icon?: string; emoji?: string; text: string }[];
    dotCls: string;
    btnGrad: string;
    btn: string;
}

interface ChoiceCardsProps {
    cards: ChoiceCardData[];
    darkSurf: string;
    darkTxt: string;
    darkTxt2: string;
    isArabic: boolean;
}

export default function ChoiceCards({ cards, darkSurf, darkTxt, darkTxt2, isArabic }: ChoiceCardsProps) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[920px]">
            {cards.map((card) => (
                <Card key={card.id} isPressable onPress={() => navigate(card.loginPath)} className={`${darkSurf} border-2 ${card.borderCls} rounded-3xl p-8 text-center transition-all hover:-translate-y-2 group shadow-sm hover:shadow-xl`}>
                    <CardBody className="p-0 flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden ${card.bubbleCls}`}>
                            <img src={card.icon} alt={card.title} className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                        </div>
                        <div className={`text-xl font-extrabold mb-2 ${darkTxt}`}>{card.title}</div>
                        <div className={`${darkTxt2} text-sm mb-6`}>{card.desc}</div>
                        <ul className="w-full space-y-2 mb-6 text-sm">
                            {card.features.map((f, i) => (
                                <li key={i} className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <span className={`${card.dotCls} w-6 h-6 flex items-center justify-center rounded-full overflow-hidden`}>
                                        {f.icon ? <img src={f.icon} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/> : f.emoji}
                                    </span> {f.text}
                                </li>
                            ))}
                        </ul>
                        <Button fullWidth className={`font-bold text-white ${card.btnGrad}`} onPress={() => navigate(card.loginPath)}>{card.btn}</Button>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
