import { Card, CardBody, Chip } from '@heroui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function EmotionsQuizActive({ 
    isDark, 
    isArabic, 
    currentQuestionIdx, 
    quizQuestions, 
    correctAnswers, 
    totalAttempts, 
    selectedOptionId, 
    lastAnswerCorrect, 
    answerQuiz 
}) {
    if (!quizQuestions || quizQuestions.length === 0) return null;

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center px-4">
                <div className="flex flex-col text-start">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{isArabic ? 'السؤال' : 'QUESTION'}</span>
                    <h3 className="text-2xl font-black">{currentQuestionIdx + 1} <span className="text-indigo-500 text-sm">/ {quizQuestions.length}</span></h3>
                </div>
                <div className="flex gap-3">
                    <Chip variant="flat" className="h-10 px-4 bg-emerald-500/10 text-emerald-500 font-bold flex items-center gap-2">
                        <FaCheckCircle className="w-4 h-4" /> {correctAnswers}
                    </Chip>
                    <Chip variant="flat" className="h-10 px-4 bg-rose-500/10 text-rose-500 font-bold flex items-center gap-2">
                        <FaTimesCircle className="w-4 h-4" /> {totalAttempts - correctAnswers}
                    </Chip>
                </div>
            </div>

            <Card className={`rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-50 shadow-2xl shadow-indigo-500/5'}`}>
                <CardBody className="p-8 sm:p-12 text-center flex flex-col items-center gap-6">
                    <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] transition-all duration-500 hover:scale-110 flex items-center justify-center overflow-hidden mx-auto">
                        <img src={`/icons/emotion_${quizQuestions[currentQuestionIdx].answer.id}.png`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <span style={{ display: 'none' }} className="text-[120px]">{quizQuestions[currentQuestionIdx].answer.emoji}</span>
                    </div>
                    <h2 className="text-3xl font-black">{isArabic ? 'ماذا يعبر هذا الوجه؟' : 'What is this feeling?'}</h2>
                </CardBody>
            </Card>

            <div className="space-y-4">
                {quizQuestions[currentQuestionIdx].options.map((option) => {
                    const isCorrect = option.id === quizQuestions[currentQuestionIdx].answer.id;
                    const isSelected = selectedOptionId === option.id;

                    let cardStyle = isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white shadow-sm border-indigo-50';
                    if (lastAnswerCorrect !== null) {
                        if (isCorrect) cardStyle = 'bg-emerald-500/20 border-emerald-500/50 shadow-emerald-500/10';
                        else if (isSelected && !isCorrect) cardStyle = 'bg-rose-500/20 border-rose-500/50 shadow-rose-500/10';
                        else cardStyle = 'opacity-40';
                    }

                    return (
                        <Card
                            key={option.id}
                            isPressable
                            onPress={() => answerQuiz(option.id)}
                            className={`rounded-[35px] border transition-all duration-500 backdrop-blur-md w-full ${cardStyle} ${lastAnswerCorrect === null ? 'hover:scale-[1.01] hover:border-indigo-500/30' : 'cursor-default'}`}>
                            <CardBody className="p-6 flex flex-row items-center gap-8 px-12">
                                <span className="flex-1 text-2xl font-black text-center">{isArabic ? option.nameAr : option.name}</span>
                                {lastAnswerCorrect !== null && isCorrect && <FaCheckCircle className="w-8 h-8 absolute right-10 animate-appearance-in text-emerald-500" />}
                                {lastAnswerCorrect === false && isSelected && !isCorrect && <FaTimesCircle className="w-8 h-8 absolute right-10 animate-appearance-in text-rose-500" />}
                            </CardBody>
                        </Card>
                    );
                })}
            </div>

            {lastAnswerCorrect !== null && (
                <div className="text-center mt-6 animate-pulse text-indigo-500 font-bold uppercase tracking-widest text-xs">
                    {isArabic ? 'جاري الانتقال...' : 'MOVING TO NEXT...'}
                </div>
            )}
        </div>
    );
}
