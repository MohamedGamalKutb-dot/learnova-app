import { Card, CardBody, Chip, Button } from '@heroui/react';

interface PecsSentenceBuilderProps {
    isDark: boolean;
    isArabic: boolean;
    sentence: any[];
    updateSentence: (sentence: any[]) => void;
    speakSentence: () => void;
}

export default function PecsSentenceBuilder({ isDark, isArabic, sentence, updateSentence, speakSentence }: PecsSentenceBuilderProps) {
    return (
        <div className="sticky top-24 z-40">
            <Card className={`rounded-[25px] sm:rounded-[35px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                <CardBody className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 min-h-[80px] sm:min-h-[100px]">
                    {sentence.length === 0 ? (
                        <div className="flex items-center gap-4 px-4 opacity-40">
                            <span className="text-4xl animate-bounce">✨</span>
                            <p className="text-xl font-black">{isArabic ? 'أضف صوراً لتبدأ الحديث..' : 'Add photos to start talking..'}</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 sm:gap-4 flex-1 px-1 sm:px-2">
                            {sentence.map((item, i) => (
                                <Chip 
                                    key={i}
                                    onClose={() => updateSentence(sentence.filter((_, idx) => idx !== i))}
                                    variant="flat"
                                    className={`h-10 sm:h-16 px-4 sm:px-8 rounded-[20px] sm:rounded-[30px] transition-all ${isDark ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-50 text-indigo-900'}`}>
                                    <span className="w-10 h-10 flex items-center justify-center mr-2 ml-2 overflow-hidden rounded-lg">
                                        <img src={item.category === 'emotions' ? `/icons/emotion_${item.id}.png` : `/icons/pecs_${item.id}.png`} 
                                            alt="" 
                                            className="w-full h-full object-cover" 
                                            onError={(e: any) => { 
                                                if (e.target.src.includes('pecs_') || e.target.src.includes('emotion_')) {
                                                    e.target.src = `/icons/${item.category}_cat.png`; 
                                                } else {
                                                    e.target.style.display = 'none'; 
                                                    e.target.nextSibling.style.display = 'flex'; 
                                                }
                                            }}
                                        />
                                        <span style={{ display: 'none' }} className="w-full h-full items-center justify-center text-4xl">{item.emoji}</span>
                                    </span>
                                    <span className="font-black text-xl">{isArabic ? item.labelAr?.split(' ').slice(-1)[0] : item.label?.split(' ').slice(-1)[0]}</span>
                                </Chip>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {sentence.length > 0 && (
                            <>
                                <Button radius="full" onPress={speakSentence} className="h-10 sm:h-16 px-5 sm:px-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-sm sm:text-xl shadow-xl shadow-indigo-500/20">
                                    🔊 {isArabic ? 'نطق' : 'SPEAK'}
                                </Button>
                                <Button isIconOnly radius="full" color="danger" variant="flat" className="h-10 w-10 sm:h-16 sm:w-16" onPress={() => updateSentence([])}>🗑️</Button>
                            </>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
