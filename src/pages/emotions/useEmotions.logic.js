/**
 * useEmotions.logic.js
 * ─────────────────────────────────────────────────────────
 * Rule 4: Logic Separation — Custom hook for all EmotionsPage state & logic.
 * EmotionsPage.jsx imports this hook and renders pure UI only.
 */

import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { getUpToLevel } from '../../data/emotionData';

export function useEmotionsLogic() {
    const { isArabic } = useApp();
    const { trackEmotionLearn, trackEmotionQuiz } = useData();
    const { currentChild, updateChildEmotionStats } = useAuth();

    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [quizFinished, setQuizFinished] = useState(false);

    const emotions = getUpToLevel(currentLevel);
    const currentEmotion = emotions[currentIndex] || emotions[0];
    const historyEntries = Object.entries(currentChild?.emotionHistory || {})
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .slice(0, 5);
    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;

    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.8;
            speechSynthesis.speak(u);
        }
    }, [isArabic]);

    const nextEmotion = () => { setCurrentIndex(i => (i + 1) % emotions.length); trackEmotionLearn(); };
    const prevEmotion = () => { setCurrentIndex(i => (i - 1 + emotions.length) % emotions.length); trackEmotionLearn(); };

    const startQuiz = () => {
        let pool = [...emotions].sort(() => Math.random() - 0.5);
        while (pool.length < 10) pool = [...pool, ...[...emotions].sort(() => Math.random() - 0.5)];
        const questions = pool.slice(0, 10).map(answer => ({
            answer,
            options: [answer, ...emotions.filter(e => e.id !== answer.id).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5)
        }));
        setQuizQuestions(questions);
        setCurrentQuestionIdx(0);
        setCorrectAnswers(0);
        setTotalAttempts(0);
        setLastAnswerCorrect(null);
        setSelectedOptionId(null);
        setQuizFinished(false);
        setIsQuizMode(true);
    };

    const nextQuiz = useCallback(() => {
        if (currentQuestionIdx >= quizQuestions.length - 1) {
            setQuizFinished(true);
        } else {
            setCurrentQuestionIdx(p => p + 1);
            setLastAnswerCorrect(null);
            setSelectedOptionId(null);
        }
    }, [currentQuestionIdx, quizQuestions.length]);

    const answerQuiz = (optionId) => {
        if (lastAnswerCorrect !== null) return;
        const correct = quizQuestions[currentQuestionIdx].answer.id === optionId;
        setSelectedOptionId(optionId);
        setLastAnswerCorrect(correct);
        const newTotal = totalAttempts + 1;
        const newCorrect = correct ? correctAnswers + 1 : correctAnswers;
        setTotalAttempts(newTotal);
        setCorrectAnswers(newCorrect);
        trackEmotionQuiz(correct);
        const todayKey = new Date().toLocaleDateString('en-CA');
        if (currentChild) updateChildEmotionStats(currentChild.childId, todayKey, correct ? 1 : 0, 1);
        setTimeout(nextQuiz, 1500);
    };

    return {
        // State
        currentLevel, setCurrentLevel,
        currentIndex, setCurrentIndex,
        isQuizMode, setIsQuizMode,
        quizQuestions,
        currentQuestionIdx,
        correctAnswers,
        totalAttempts,
        lastAnswerCorrect,
        selectedOptionId,
        quizFinished,
        // Derived
        emotions, currentEmotion, historyEntries, accuracy,
        // Actions
        speak, nextEmotion, prevEmotion, startQuiz, answerQuiz,
    };
}
