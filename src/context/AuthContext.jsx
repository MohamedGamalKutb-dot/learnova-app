import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const CHILDREN_KEY = 'learnova_v2_children';
const PARENTS_KEY = 'learnova_v2_parents';
const CURRENT_CHILD_KEY = 'learnova_v2_current_child';
const CURRENT_PARENT_KEY = 'learnova_v2_current_parent';
const DOCTOR_ACCOUNTS_KEY = 'learnova_v2_doctor_accounts';
const CURRENT_DOCTOR_KEY = 'learnova_v2_current_doctor';

// Global debug helper (Run window.showHeroes() in console)
if (typeof window !== 'undefined') {
    window.showHeroes = () => {
        console.table(loadChildren());
    };
}

function loadChildren() {
    try { 
        const s = localStorage.getItem(CHILDREN_KEY); 
        return s ? JSON.parse(s) : []; 
    } catch { return []; }
}
function saveChildren(arr) { localStorage.setItem(CHILDREN_KEY, JSON.stringify(arr)); }

function loadParents() {
    try { const s = localStorage.getItem(PARENTS_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}
function saveParents(arr) { localStorage.setItem(PARENTS_KEY, JSON.stringify(arr)); }

function loadDoctors() {
    try { const s = localStorage.getItem(DOCTOR_ACCOUNTS_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}
function saveDoctors(arr) { localStorage.setItem(DOCTOR_ACCOUNTS_KEY, JSON.stringify(arr)); }

function generateChildId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'LN-';
    for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

// Utility for deep matching child IDs
function normalizeId(id) {
    if (!id) return '';
    // Strip "LN-", spaces, and non-alphanumeric characters, then uppercase
    return id.toString().replace(/LN-/gi, '').replace(/[^A-Z0-9]/gi, '').trim().toUpperCase();
}

export function AuthProvider({ children }) {
    const [childAccounts, setChildAccounts] = useState(loadChildren);
    const [parentAccounts, setParentAccounts] = useState(loadParents);
    const [currentChild, setCurrentChild] = useState(() => {
        try { const s = localStorage.getItem(CURRENT_CHILD_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });
    const [currentParent, setCurrentParent] = useState(() => {
        try { const s = localStorage.getItem(CURRENT_PARENT_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });
    const [doctorAccounts, setDoctorAccounts] = useState(loadDoctors);
    const [currentDoctor, setCurrentDoctor] = useState(() => {
        try { const s = localStorage.getItem(CURRENT_DOCTOR_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });

    // ============ REAL-TIME SYNC ============
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === CHILDREN_KEY) setChildAccounts(loadChildren());
            if (e.key === PARENTS_KEY) setParentAccounts(loadParents());
            if (e.key === DOCTOR_ACCOUNTS_KEY) setDoctorAccounts(loadDoctors());
            if (e.key === CURRENT_CHILD_KEY) {
                try {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    if (JSON.stringify(updated) !== JSON.stringify(currentChild)) setCurrentChild(updated);
                } catch { }
            }
            if (e.key === CURRENT_PARENT_KEY) {
                try {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    if (JSON.stringify(updated) !== JSON.stringify(currentParent)) setCurrentParent(updated);
                } catch { }
            }
            if (e.key === CURRENT_DOCTOR_KEY) {
                try {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    if (JSON.stringify(updated) !== JSON.stringify(currentDoctor)) setCurrentDoctor(updated);
                } catch { }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(() => {
            const freshChildren = loadChildren();
            setChildAccounts(prev => JSON.stringify(prev) !== JSON.stringify(freshChildren) ? freshChildren : prev);
            const freshDoctors = loadDoctors();
            setDoctorAccounts(prev => JSON.stringify(prev) !== JSON.stringify(freshDoctors) ? freshDoctors : prev);
        }, 1000); // Super fast 1s polling
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [currentChild, currentParent, currentDoctor]);

    // ============ CHILD SIGNUP ============
    const registerChild = useCallback(({ name, age, email, password, gender, avatar }) => {
        const existing = loadChildren();
        if (existing.find(c => c.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'email_exists' };
        }
        let childId;
        do { childId = generateChildId(); } while (existing.find(c => c.childId === childId));

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

    const loginChild = useCallback((identifier, password) => {
        const freshChildren = loadChildren();
        const normIdentifier = normalizeId(identifier);
        const child = freshChildren.find(c =>
            c.email.toLowerCase() === identifier.toLowerCase() ||
            normalizeId(c.childId) === normIdentifier
        );

        if (!child) return { success: false, error: 'not_found' };
        if (child.password !== password) return { success: false, error: 'wrong_password' };

        setChildAccounts(freshChildren);
        setCurrentChild(child);
        localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(child));
        return { success: true };
    }, []);

    const logoutChild = useCallback(() => {
        setCurrentChild(null);
        localStorage.removeItem(CURRENT_CHILD_KEY);
    }, []);

    const updateChildProfile = useCallback((updates) => {
        if (!currentChild) return;
        const existing = loadChildren();
        const { diagnosisLevel, ...allowedUpdates } = updates;
        const updated = existing.map(c =>
            c.childId === currentChild.childId ? { ...c, ...allowedUpdates } : c
        );
        saveChildren(updated);
        setChildAccounts(updated);
        const updatedChild = { ...currentChild, ...allowedUpdates };
        setCurrentChild(updatedChild);
        localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(updatedChild));
    }, [currentChild]);

    // ============ PARENT MANAGEMENT ============
    const registerParent = useCallback(({ name, email, password, phone, childId }) => {
        const existingParents = loadParents();
        if (existingParents.find(p => p.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'email_exists' };
        }
        const normInputId = normalizeId(childId);
        const existingChildren = loadChildren();
        const linkedChild = existingChildren.find(c => normalizeId(c.childId) === normInputId);
        if (!linkedChild) return { success: false, error: 'child_not_found' };

        const parent = {
            id: `P-${Date.now()}`,
            name,
            email: email.toLowerCase(),
            password,
            phone,
            childId: linkedChild.childId,
            childName: linkedChild.name,
            avatar: '👤',
            createdAt: new Date().toISOString(),
        };
        const updated = [...existingParents, parent];
        saveParents(updated);
        setParentAccounts(updated);
        return { success: true };
    }, []);

    const loginParent = useCallback((email, password) => {
        const freshParents = loadParents();
        const parent = freshParents.find(p => p.email.toLowerCase() === email.toLowerCase());
        if (!parent) return { success: false, error: 'not_found' };
        if (parent.password !== password) return { success: false, error: 'wrong_password' };
        setParentAccounts(freshParents);
        setChildAccounts(loadChildren());
        setCurrentParent(parent);
        localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(parent));
        return { success: true };
    }, []);

    const logoutParent = useCallback(() => {
        setCurrentParent(null);
        localStorage.removeItem(CURRENT_PARENT_KEY);
    }, []);

    const updateParentProfile = useCallback((updates) => {
        if (!currentParent) return;
        const existing = loadParents();
        const updated = existing.map(p =>
            p.id === currentParent.id ? { ...p, ...updates } : p
        );
        saveParents(updated);
        setParentAccounts(updated);
        const updatedParent = { ...currentParent, ...updates };
        setCurrentParent(updatedParent);
        localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(updatedParent));
    }, [currentParent]);

    // ============ DOCTOR FEATURES ============
    const findChildForDoctor = useCallback((query) => {
        const existing = loadChildren();
        const normQuery = normalizeId(query);
        return existing.find(c =>
            normalizeId(c.childId) === normQuery ||
            (c.parentPhone && c.parentPhone === query)
        ) || null;
    }, []);

    const updateChildDiagnosis = useCallback((childId, diagnosisData) => {
        const existing = loadChildren();
        const updated = existing.map(c =>
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

    const getChildById = useCallback((childId) => {
        if (!childId) return null;
        const existing = loadChildren();
        const normId = normalizeId(childId);
        return existing.find(c => normalizeId(c.childId) === normId) || null;
    }, []);

    const linkedChild = currentParent ? childAccounts.find(c => normalizeId(c.childId) === normalizeId(currentParent.childId)) : null;

    const updateChildRoutine = useCallback((childId, dateKey, tasksStatus) => {
        const existing = loadChildren();
        const updated = existing.map(c => {
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

    const updateChildEmotionStats = useCallback((childId, dateKey, correctToAdd, totalToAdd) => {
        const existing = loadChildren();
        const updated = existing.map(c => {
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

    const registerDoctor = useCallback((doctorData) => {
        const existing = loadDoctors();
        if (existing.some(d => d.email.toLowerCase() === doctorData.email.toLowerCase())) {
            return { success: false, error: 'email_exists' };
        }
        const newDoctor = {
            id: `DOC-${Date.now()}`,
            name: doctorData.name,
            email: doctorData.email.toLowerCase(),
            password: doctorData.password,
            patientIds: [],
            createdAt: new Date().toISOString(),
        };
        const updated = [...existing, newDoctor];
        saveDoctors(updated);
        setDoctorAccounts(updated);
        return { success: true };
    }, []);

    const loginDoctor = useCallback((email, password) => {
        const existing = loadDoctors();
        const doctor = existing.find(d => d.email.toLowerCase() === email.toLowerCase());
        if (!doctor) return { success: false, error: 'not_found' };
        if (doctor.password !== password) return { success: false, error: 'wrong_password' };
        setCurrentDoctor(doctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(doctor));
        return { success: true };
    }, []);

    const logoutDoctor = useCallback(() => {
        setCurrentDoctor(null);
        localStorage.removeItem(CURRENT_DOCTOR_KEY);
    }, []);

    const addPatientToDoctor = useCallback((childId) => {
        if (!currentDoctor) return { success: false, error: 'no_doctor' };
        const existing = loadDoctors();
        const updated = existing.map(d => {
            if (d.id === currentDoctor.id) {
                const patients = d.patientIds || [];
                if (patients.includes(childId)) return d;
                return { ...d, patientIds: [...patients, childId] };
            }
            return d;
        });
        
        const updatedDoctor = updated.find(d => d.id === currentDoctor.id);
        const wasAdded = updatedDoctor.patientIds.length > (currentDoctor.patientIds?.length || 0);

        if (wasAdded) {
            saveDoctors(updated);
            setDoctorAccounts(updated);
            setCurrentDoctor(updatedDoctor);
            localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(updatedDoctor));
            return { success: true };
        }
        return { success: false, error: 'already_exists' };
    }, [currentDoctor]);

    const updateDoctorProfile = useCallback((updates) => {
        if (!currentDoctor) return;
        const existing = loadDoctors();
        const updated = existing.map(d =>
            d.id === currentDoctor.id ? { ...d, ...updates } : d
        );
        saveDoctors(updated);
        setDoctorAccounts(updated);
        const updatedDoctor = { ...currentDoctor, ...updates };
        setCurrentDoctor(updatedDoctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(updatedDoctor));
    }, [currentDoctor]);

    return (
        <AuthContext.Provider value={{
            currentChild, childAccounts,
            registerChild, loginChild, logoutChild, updateChildProfile, updateChildRoutine, updateChildEmotionStats,
            currentParent, parentAccounts,
            registerParent, loginParent, logoutParent, updateParentProfile,
            getChildById, linkedChild,
            findChildForDoctor, updateChildDiagnosis, addPatientToDoctor,
            doctorAccounts, currentDoctor, registerDoctor, loginDoctor, logoutDoctor, updateDoctorProfile,
            isChildLoggedIn: !!currentChild,
            isParentLoggedIn: !!currentParent,
            isDoctorLoggedIn: !!currentDoctor,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
