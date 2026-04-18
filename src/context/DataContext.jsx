import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const BASE_STORAGE_KEY = 'learnova_data_';

function loadChildSpecificData(childId) {
    if (!childId) return getDefaultData();
    try {
        const saved = localStorage.getItem(BASE_STORAGE_KEY + childId);
        if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return getDefaultData();
}

function getDefaultData() {
    return {
        // PECS tracking
        pecsWordsUsed: {},
        pecsSentencesBuilt: 0,
        pecsTotalTaps: 0,

        // Emotions tracking
        emotionQuizAttempts: 0,
        emotionQuizCorrect: 0,
        emotionLearningViews: 0,
        emotionQuizHistory: [], // Latest results

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

function saveChildSpecificData(childId, data) {
    if (!childId) return;
    try {
        localStorage.setItem(BASE_STORAGE_KEY + childId, JSON.stringify(data));
    } catch (e) { /* ignore */ }
}

function getTodayKey() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
}

export function DataProvider({ children }) {
    const { currentChild, isChildLoggedIn, isParentLoggedIn, linkedChild } = useAuth();
    
    // Determine which child we are tracking for
    const activeChildId = currentChild?.childId || linkedChild?.childId || null;

    const [data, setData] = useState(() => loadChildSpecificData(activeChildId));
    const [lastChildId, setLastChildId] = useState(activeChildId);

    // Immediate state update if activeChildId changes during render (to avoid stale data)
    if (activeChildId !== lastChildId) {
        setLastChildId(activeChildId);
        setData(loadChildSpecificData(activeChildId));
    }

    // Reload data when active child changes or when external storage updates (Sync)
    useEffect(() => {
        if (!activeChildId) return;
        
        // Listen for Storage Events (Same browser, other tabs)
        const handleStorageChange = (e) => {
            if (e.key === BASE_STORAGE_KEY + activeChildId) {
                setData(loadChildSpecificData(activeChildId));
            }
        };
        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(() => {
            const freshData = loadChildSpecificData(activeChildId);
            if (JSON.stringify(freshData) !== JSON.stringify(data)) {
                setData(freshData);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [activeChildId, data]);

    const updateData = useCallback((updater) => {
        if (!activeChildId) return;

        setData(prev => {
            const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
            updated.lastActivity = new Date().toISOString();
            saveChildSpecificData(activeChildId, updated);
            return updated;
        });
    }, [activeChildId]);

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

    const trackEmotionQuiz = useCallback((isCorrect, scorePct) => {
        updateData(prev => {
            const todayKey = getTodayKey();
            const newHistory = [{
                date: new Date().toLocaleDateString(),
                score: scorePct,
                correct: isCorrect ? 1 : 0
            }, ...(prev.emotionQuizHistory || [])].slice(0, 5);

            return {
                ...prev,
                emotionQuizAttempts: prev.emotionQuizAttempts + 1,
                emotionQuizCorrect: prev.emotionQuizCorrect + (isCorrect ? 1 : 0),
                emotionQuizHistory: newHistory,
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
        if (!activeChildId) return;
        localStorage.removeItem(BASE_STORAGE_KEY + activeChildId);
        setData(getDefaultData());
    }, [activeChildId]);

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
            activeChildId
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
