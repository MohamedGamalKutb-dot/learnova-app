import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/shared/firebase/config';

interface AppData {
    pecsWordsUsed: Record<string, number>;
    pecsSentencesBuilt: number;
    pecsTotalTaps: number;
    emotionQuizAttempts: number;
    emotionQuizCorrect: number;
    emotionLearningViews: number;
    emotionQuizHistory: any[];
    routineCompletedTasks: number;
    routineTotalTasks: number;
    routineResets: number;

    totalInteractions: number;
    weeklyUsage: Record<string, number>;
    moduleUsage: Record<string, number>;
    dailyNotes: any[];
    lastActivity: string | null;
}

interface DataContextType {
    data: AppData;
    trackPecsTap: (item: any, isArabic: boolean) => void;
    trackPecsSentence: () => void;
    trackEmotionLearn: () => void;
    trackEmotionQuiz: (isCorrect: boolean, scorePct?: number) => void;
    trackRoutineToggle: (completed: number, totalTasks: number) => void;
    trackRoutineReset: () => void;

    addDailyNote: (noteText: string) => void;
    removeDailyNote: (index: number) => void;
    resetAllData: () => void;
    emotionAccuracy: number;
    routineCompletion: number;
    mostUsedWords: [string, number][];
    activeChildId: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

const BASE_STORAGE_KEY = 'learnova_data_';

function loadChildSpecificData(childId: string | null, fallbackStats: any = null): AppData {
    if (!childId) return getDefaultData();
    let localData: AppData | null = null;
    try {
        const saved = localStorage.getItem(BASE_STORAGE_KEY + childId);
        if (saved) localData = JSON.parse(saved);
    } catch { /* ignore */ }

    // If Firestore has newer data (or local has none), use Firestore data
    if (fallbackStats && Object.keys(fallbackStats).length > 0) {
        const localTime = localData?.lastActivity ? new Date(localData.lastActivity).getTime() : 0;
        const fallbackTime = fallbackStats.lastActivity ? new Date(fallbackStats.lastActivity).getTime() : 0;
        
        if (!localData || fallbackTime > localTime) {
            const merged = { ...getDefaultData(), ...fallbackStats };
            saveChildSpecificData(childId, merged);
            return merged;
        }
    }

    if (localData) return localData;
    return getDefaultData();
}

function getDefaultData(): AppData {
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



        // General
        totalInteractions: 0,
        weeklyUsage: { Sat: 0, Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 },
        moduleUsage: { pecs: 0, emotions: 0, routine: 0 },
        dailyNotes: [],
        lastActivity: null,
    };
}

function saveChildSpecificData(childId: string | null, data: AppData) {
    if (!childId) return;
    try {
        localStorage.setItem(BASE_STORAGE_KEY + childId, JSON.stringify(data));
    } catch { /* ignore */ }
}

function getTodayKey() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
}

export function DataProvider({ children }: { children: ReactNode }) {
    const { currentChild, linkedChild } = useAuth();
    const location = useLocation();
    
    // Determine which child we are tracking for
    const isParentPath = location.pathname.includes('/parent-dashboard');
    const activeChild = isParentPath ? (linkedChild || currentChild || null) : (currentChild || linkedChild || null);
    const activeChildId = activeChild?.childId || null;

    const [data, setData] = useState<AppData>(() => loadChildSpecificData(activeChildId, (activeChild as any)?.stats));
    const [lastChildId, setLastChildId] = useState<string | null>(activeChildId);
    
    const activeChildRef = useRef(activeChild);
    useEffect(() => {
        activeChildRef.current = activeChild;
    }, [activeChild]);

    // Immediate state update if activeChildId changes during render (to avoid stale data)
    if (activeChildId !== lastChildId) {
        setLastChildId(activeChildId);
        setData(loadChildSpecificData(activeChildId, (activeChild as any)?.stats));
    }

    // Reload data when active child changes or when external storage updates (Sync)
    useEffect(() => {
        if (!activeChildId) return;
        
        // Listen for Storage Events (Same browser, other tabs)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === BASE_STORAGE_KEY + activeChildId) {
                setData(loadChildSpecificData(activeChildId));
            }
        };
        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(() => {
            const freshData = loadChildSpecificData(activeChildId, (activeChildRef.current as any)?.stats);
            if (JSON.stringify(freshData) !== JSON.stringify(data)) {
                setData(freshData);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [activeChildId, data]);

    const updateData = useCallback((updater: Partial<AppData> | ((prev: AppData) => AppData)) => {
        if (!activeChildId) return;

        setData(prev => {
            const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
            updated.lastActivity = new Date().toISOString();
            saveChildSpecificData(activeChildId, updated as AppData);
            
            // Sync stats to Firestore child document
            const childRef = doc(db, 'children', activeChildId);
            updateDoc(childRef, {
                stats: updated,
                updatedAt: new Date().toISOString()
            }).catch(err => console.error("Firestore stats update error:", err));

            return updated as AppData;
        });
    }, [activeChildId]);

    // ===== PECS Tracking =====
    const trackPecsTap = useCallback((item: any, isArabic: boolean) => {
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

    const trackEmotionQuiz = useCallback((isCorrect: boolean, scorePct?: number) => {
        updateData(prev => {
            const todayKey = getTodayKey();
            const newHistory = [{
                date: new Date().toLocaleDateString(),
                score: scorePct ?? null,
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
    const trackRoutineToggle = useCallback((completed: number, totalTasks: number) => {
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

    // ===== Notes =====
    const addDailyNote = useCallback((noteText: string) => {
        updateData(prev => ({
            ...prev,
            dailyNotes: [...prev.dailyNotes, { note: noteText, date: new Date().toLocaleDateString() }],
        }));
    }, [updateData]);

    const removeDailyNote = useCallback((index: number) => {
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
            trackPecsTap, trackPecsSentence,
            trackEmotionLearn, trackEmotionQuiz,
            trackRoutineToggle, trackRoutineReset,

            addDailyNote, removeDailyNote,
            resetAllData,
            emotionAccuracy, routineCompletion, mostUsedWords,
            activeChildId
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData(): DataContextType {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used within DataProvider');
    return ctx;
}
