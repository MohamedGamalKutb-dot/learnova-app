import { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext(null);

const STORAGE_KEY = 'lLearnNeur_data';

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return {
        // PECS tracking
        pecsWordsUsed: {},        // { "I want water": 5, ... }
        pecsSentencesBuilt: 0,
        pecsTotalTaps: 0,

        // Emotions tracking
        emotionQuizAttempts: 0,
        emotionQuizCorrect: 0,
        emotionLearningViews: 0,

        // Routine tracking
        routineCompletedTasks: 0,
        routineTotalTasks: 0,
        routineResets: 0,

        // Calming tracking
        calmingSessionsCompleted: 0,
        calmingTotalMinutes: 0,
        breathingExercises: 0,

        // General
        totalInteractions: 0,
        weeklyUsage: { Sat: 0, Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 },
        moduleUsage: { pecs: 0, emotions: 0, routine: 0, calming: 0 },
        dailyNotes: [],
        lastActivity: null,
    };
}

function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
}

function getTodayKey() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
}

export function DataProvider({ children }) {
    const [data, setData] = useState(loadData);

    const updateData = useCallback((updater) => {
        setData(prev => {
            const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
            updated.lastActivity = new Date().toISOString();
            saveData(updated);
            return updated;
        });
    }, []);

    // ===== PECS Tracking =====
    const trackPecsTap = useCallback((item, isArabic) => {
        updateData(prev => {
            const label = isArabic ? item.labelAr : item.label;
            const wordsUsed = { ...prev.pecsWordsUsed };
            wordsUsed[label] = (wordsUsed[label] || 0) + 1;
            const todayKey = getTodayKey();
            return {
                ...prev,
                pecsWordsUsed: wordsUsed,
                pecsTotalTaps: prev.pecsTotalTaps + 1,
                totalInteractions: prev.totalInteractions + 1,
                moduleUsage: { ...prev.moduleUsage, pecs: prev.moduleUsage.pecs + 1 },
                weeklyUsage: { ...prev.weeklyUsage, [todayKey]: (prev.weeklyUsage[todayKey] || 0) + 1 },
            };
        });
    }, [updateData]);

    const trackPecsSentence = useCallback(() => {
        updateData(prev => ({
            ...prev,
            pecsSentencesBuilt: prev.pecsSentencesBuilt + 1,
        }));
    }, [updateData]);

    // ===== Emotions Tracking =====
    const trackEmotionLearn = useCallback(() => {
        updateData(prev => {
            const todayKey = getTodayKey();
            return {
                ...prev,
                emotionLearningViews: prev.emotionLearningViews + 1,
                totalInteractions: prev.totalInteractions + 1,
                moduleUsage: { ...prev.moduleUsage, emotions: prev.moduleUsage.emotions + 1 },
                weeklyUsage: { ...prev.weeklyUsage, [todayKey]: (prev.weeklyUsage[todayKey] || 0) + 1 },
            };
        });
    }, [updateData]);

    const trackEmotionQuiz = useCallback((isCorrect) => {
        updateData(prev => {
            const todayKey = getTodayKey();
            return {
                ...prev,
                emotionQuizAttempts: prev.emotionQuizAttempts + 1,
                emotionQuizCorrect: prev.emotionQuizCorrect + (isCorrect ? 1 : 0),
                totalInteractions: prev.totalInteractions + 1,
                moduleUsage: { ...prev.moduleUsage, emotions: prev.moduleUsage.emotions + 1 },
                weeklyUsage: { ...prev.weeklyUsage, [todayKey]: (prev.weeklyUsage[todayKey] || 0) + 1 },
            };
        });
    }, [updateData]);

    // ===== Routine Tracking =====
    const trackRoutineToggle = useCallback((completed, totalTasks) => {
        updateData(prev => {
            const todayKey = getTodayKey();
            return {
                ...prev,
                routineCompletedTasks: completed,
                routineTotalTasks: totalTasks,
                totalInteractions: prev.totalInteractions + 1,
                moduleUsage: { ...prev.moduleUsage, routine: prev.moduleUsage.routine + 1 },
                weeklyUsage: { ...prev.weeklyUsage, [todayKey]: (prev.weeklyUsage[todayKey] || 0) + 1 },
            };
        });
    }, [updateData]);

    const trackRoutineReset = useCallback(() => {
        updateData(prev => ({
            ...prev,
            routineResets: prev.routineResets + 1,
            routineCompletedTasks: 0,
        }));
    }, [updateData]);

    // ===== Calming Tracking =====
    const trackBreathingExercise = useCallback(() => {
        updateData(prev => {
            const todayKey = getTodayKey();
            return {
                ...prev,
                breathingExercises: prev.breathingExercises + 1,
                totalInteractions: prev.totalInteractions + 1,
                moduleUsage: { ...prev.moduleUsage, calming: prev.moduleUsage.calming + 1 },
                weeklyUsage: { ...prev.weeklyUsage, [todayKey]: (prev.weeklyUsage[todayKey] || 0) + 1 },
            };
        });
    }, [updateData]);

    const trackCalmingSession = useCallback((minutes) => {
        updateData(prev => ({
            ...prev,
            calmingSessionsCompleted: prev.calmingSessionsCompleted + 1,
            calmingTotalMinutes: prev.calmingTotalMinutes + minutes,
        }));
    }, [updateData]);

    // ===== Notes =====
    const addDailyNote = useCallback((noteText) => {
        updateData(prev => ({
            ...prev,
            dailyNotes: [...prev.dailyNotes, { note: noteText, date: new Date().toLocaleDateString() }],
        }));
    }, [updateData]);

    const removeDailyNote = useCallback((index) => {
        updateData(prev => ({
            ...prev,
            dailyNotes: prev.dailyNotes.filter((_, i) => i !== index),
        }));
    }, [updateData]);

    // ===== Reset =====
    const resetAllData = useCallback(() => {
        const fresh = loadData();
        // return defaults
        localStorage.removeItem(STORAGE_KEY);
        setData(loadData());
    }, []);

    // ===== Computed Values =====
    const emotionAccuracy = data.emotionQuizAttempts > 0
        ? data.emotionQuizCorrect / data.emotionQuizAttempts
        : 0;

    const routineCompletion = data.routineTotalTasks > 0
        ? Math.round((data.routineCompletedTasks / data.routineTotalTasks) * 100)
        : 0;

    const mostUsedWords = Object.entries(data.pecsWordsUsed)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    return (
        <DataContext.Provider value={{
            data,
            // PECS
            trackPecsTap, trackPecsSentence,
            // Emotions
            trackEmotionLearn, trackEmotionQuiz,
            // Routine
            trackRoutineToggle, trackRoutineReset,
            // Calming
            trackBreathingExercise, trackCalmingSession,
            // Notes
            addDailyNote, removeDailyNote,
            // Reset
            resetAllData,
            // Computed
            emotionAccuracy, routineCompletion, mostUsedWords,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used within DataProvider');
    return ctx;
}
