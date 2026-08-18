import { useState, useCallback, useEffect } from 'react';

const CHILDREN_KEY = 'learnova_v2_children';
const CURRENT_CHILD_KEY = 'learnova_v2_current_child';

export function loadChildren() {
    try { 
        const s = localStorage.getItem(CHILDREN_KEY); 
        return s ? JSON.parse(s) : []; 
    } catch { return []; }
}
export function saveChildren(arr: any[]) { localStorage.setItem(CHILDREN_KEY, JSON.stringify(arr)); }

export function generateChildId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'LN-';
    for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

export function normalizeId(id: string | null | undefined) {
    if (!id) return '';
    return id.toString().replace(/LN-/gi, '').replace(/[^A-Z0-9]/gi, '').trim().toUpperCase();
}

export function useChildAuth() {
    const [childAccounts, setChildAccounts] = useState<any[]>(loadChildren);
    const [currentChild, setCurrentChild] = useState<any>(() => {
        try { const s = localStorage.getItem(CURRENT_CHILD_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });

    // Storage Event Sync
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CHILDREN_KEY) setChildAccounts(loadChildren());
            if (e.key === CURRENT_CHILD_KEY) {
                try {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    if (JSON.stringify(updated) !== JSON.stringify(currentChild)) setCurrentChild(updated);
                } catch { }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [currentChild]);

    const registerChild = useCallback(({ name, age, email, password, gender, avatar }: any) => {
        const existing = loadChildren();
        if (existing.find((c: any) => c.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'email_exists' };
        }
        let childId: string;
        do { childId = generateChildId(); } while (existing.find((c: any) => c.childId === childId));

        const child = {
            childId,
            name,
            age: parseInt(age) || 5,
            email: email.toLowerCase(),
            password,
            gender,
            avatar: avatar || (gender === 'Male' ? '👦' : '👧'),
            diagnosisLevel: 'Not Set',
            sensoryPreferences: [],
            favoriteColor: '#6C63FF',
            notes: '',
            doctorNotes: '',
            parentPhone: '',
            routineHistory: {},
            emotionHistory: {},
            createdAt: new Date().toISOString(),
        };
        const updated = [...existing, child];
        saveChildren(updated);
        setChildAccounts(updated);
        return { success: true, childId };
    }, []);

    const loginChild = useCallback((identifier: string, password?: string, isGoogle = false) => {
        const freshChildren = loadChildren();
        const normIdentifier = normalizeId(identifier);
        const child = freshChildren.find((c: any) =>
            c.email.toLowerCase() === identifier.toLowerCase() ||
            normalizeId(c.childId) === normIdentifier
        );

        if (!child) return { success: false, error: 'not_found' };
        if (!isGoogle && child.password !== password) return { success: false, error: 'wrong_password' };

        setChildAccounts(freshChildren);
        setCurrentChild(child);
        localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(child));
        return { success: true };
    }, []);

    const logoutChild = useCallback(() => {
        setCurrentChild(null);
        localStorage.removeItem(CURRENT_CHILD_KEY);
    }, []);

    const updateChildProfile = useCallback((updates: any) => {
        if (!currentChild) return;
        const existing = loadChildren();
        const { diagnosisLevel, ...allowedUpdates } = updates;
        const updated = existing.map((c: any) =>
            c.childId === currentChild.childId ? { ...c, ...allowedUpdates } : c
        );
        saveChildren(updated);
        setChildAccounts(updated);
        const updatedChild = { ...currentChild, ...allowedUpdates };
        setCurrentChild(updatedChild);
        localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(updatedChild));
    }, [currentChild]);

    const updateChildRoutine = useCallback((childId: string, dateKey: string, tasksStatus: any) => {
        const existing = loadChildren();
        const updated = existing.map((c: any) => {
            if (c.childId === childId) {
                const history = c.routineHistory || {};
                return { ...c, routineHistory: { ...history, [dateKey]: tasksStatus } };
            }
            return c;
        });
        saveChildren(updated);
        setChildAccounts(updated);
        if (currentChild && currentChild.childId === childId) {
            const history = currentChild.routineHistory || {};
            const updatedChild = { ...currentChild, routineHistory: { ...history, [dateKey]: tasksStatus } };
            setCurrentChild(updatedChild);
            localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(updatedChild));
        }
    }, [currentChild]);

    const updateChildEmotionStats = useCallback((childId: string, dateKey: string, correctToAdd: number, totalToAdd: number) => {
        const existing = loadChildren();
        const updated = existing.map((c: any) => {
            if (c.childId === childId) {
                const history = c.emotionHistory || {};
                const todayStats = history[dateKey] || { correct: 0, total: 0 };
                return {
                    ...c,
                    emotionHistory: {
                        ...history,
                        [dateKey]: {
                            correct: todayStats.correct + correctToAdd,
                            total: todayStats.total + totalToAdd
                        }
                    }
                };
            }
            return c;
        });
        saveChildren(updated);
        setChildAccounts(updated);
    }, []);

    const updateChildDiagnosis = useCallback((childId: string, diagnosisData: any) => {
        const existing = loadChildren();
        const updated = existing.map((c: any) =>
            c.childId === childId ? { ...c, ...diagnosisData } : c
        );
        saveChildren(updated);
        setChildAccounts(updated);
        if (currentChild && currentChild.childId === childId) {
            const updatedChild = { ...currentChild, ...diagnosisData };
            setCurrentChild(updatedChild);
            localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(updatedChild));
        }
    }, [currentChild]);

    return {
        childAccounts,
        setChildAccounts,
        currentChild,
        setCurrentChild,
        registerChild,
        loginChild,
        logoutChild,
        updateChildProfile,
        updateChildRoutine,
        updateChildEmotionStats,
        updateChildDiagnosis
    };
}
