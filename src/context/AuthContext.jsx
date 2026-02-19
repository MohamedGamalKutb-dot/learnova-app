import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const CHILDREN_KEY = 'learnova_children';
const PARENTS_KEY = 'learnova_parents';
const CURRENT_CHILD_KEY = 'learnova_current_child';
const CURRENT_PARENT_KEY = 'learnova_current_parent';
const DOCTOR_ACCOUNTS_KEY = 'learnova_doctor_accounts';
const CURRENT_DOCTOR_KEY = 'learnova_current_doctor';

function loadChildren() {
    try { const s = localStorage.getItem(CHILDREN_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
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

export function AuthProvider({ children }) {
    const [childAccounts, setChildAccounts] = useState(loadChildren);
    const [parentAccounts, setParentAccounts] = useState(loadParents);
    const [currentChild, setCurrentChild] = useState(() => {
        try { const s = localStorage.getItem(CURRENT_CHILD_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });
    const [currentParent, setCurrentParent] = useState(() => {
        try { const s = localStorage.getItem(CURRENT_PARENT_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });

    // ============ REAL-TIME SYNC ============
    useEffect(() => {
        // 1. Sync across tabs
        const handleStorageChange = (e) => {
            if (e.key === CHILDREN_KEY) setChildAccounts(loadChildren());
            if (e.key === PARENTS_KEY) setParentAccounts(loadParents());
            if (e.key === DOCTOR_ACCOUNTS_KEY) setDoctorAccounts(loadDoctors());

            // Sync Current Session safely
            if (e.key === CURRENT_CHILD_KEY) {
                try {
                    const updated = JSON.parse(e.newValue);
                    setCurrentChild(prev => (prev && updated && prev.childId === updated.childId) ? updated : prev);
                } catch { }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // 2. Polling for same-browser updates (Safety net)
        const interval = setInterval(() => {
            const freshChildren = loadChildren();
            setChildAccounts(prev => JSON.stringify(prev) !== JSON.stringify(freshChildren) ? freshChildren : prev);

            const freshDoctors = loadDoctors();
            setDoctorAccounts(prev => JSON.stringify(prev) !== JSON.stringify(freshDoctors) ? freshDoctors : prev);

            // Sync current child session details
            setCurrentChild(prev => {
                if (!prev) return null;
                const freshChild = freshChildren.find(c => c.childId === prev.childId);
                return (freshChild && JSON.stringify(freshChild) !== JSON.stringify(prev)) ? freshChild : prev;
            });

            // Sync current doctor session details
            setCurrentDoctor(prev => {
                if (!prev) return null;
                const freshDoc = freshDoctors.find(d => d.id === prev.id);
                return (freshDoc && JSON.stringify(freshDoc) !== JSON.stringify(prev)) ? freshDoc : prev;
            });

        }, 2000); // Check every 2 seconds

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []); // Empty dependency array = Runs once on mount

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
            doctorNotes: '', // Added for doctor
            parentPhone: '', // Added for doctor search
            createdAt: new Date().toISOString(),
        };
        const updated = [...existing, child];
        saveChildren(updated);
        setChildAccounts(updated);
        setCurrentChild(child);
        localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(child));
        return { success: true, childId };
    }, []);

    // ============ CHILD LOGIN ============
    const loginChild = useCallback((identifier, password) => {
        const existing = loadChildren();
        // Find by Email OR Child ID
        const child = existing.find(c =>
            c.email.toLowerCase() === identifier.toLowerCase() ||
            c.childId === identifier.toUpperCase()
        );

        if (!child) return { success: false, error: 'not_found' };
        if (child.password !== password) return { success: false, error: 'wrong_password' };

        setCurrentChild(child);
        localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(child));
        return { success: true };
    }, []);

    // ============ CHILD LOGOUT ============
    const logoutChild = useCallback(() => {
        setCurrentChild(null);
        localStorage.removeItem(CURRENT_CHILD_KEY);
    }, []);

    // ============ UPDATE CHILD PROFILE (User) ============
    const updateChildProfile = useCallback((updates) => {
        if (!currentChild) return;
        const existing = loadChildren();
        // Prevent users from updating diagnosisLevel
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

    // ============ PARENT SIGNUP ============
    const registerParent = useCallback(({ name, email, password, phone, childId }) => {
        const existingParents = loadParents();
        if (existingParents.find(p => p.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'email_exists' };
        }
        const existingChildren = loadChildren();
        const linkedChild = existingChildren.find(c => c.childId === childId.toUpperCase());
        if (!linkedChild) {
            return { success: false, error: 'child_not_found' };
        }

        // Link Phone to Child Record
        if (phone) {
            const updatedChildren = existingChildren.map(c =>
                c.childId === childId.toUpperCase() ? { ...c, parentPhone: phone } : c
            );
            saveChildren(updatedChildren);
            setChildAccounts(updatedChildren);
        }

        const parent = {
            id: `P-${Date.now()}`,
            name,
            email: email.toLowerCase(),
            password,
            phone,
            childId: childId.toUpperCase(),
            childName: linkedChild.name,
            createdAt: new Date().toISOString(),
        };
        const updated = [...existingParents, parent];
        saveParents(updated);
        setParentAccounts(updated);
        setCurrentParent(parent);
        localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(parent));
        return { success: true };
    }, []);

    // ============ PARENT LOGIN ============
    const loginParent = useCallback((email, password) => {
        const existing = loadParents();
        const parent = existing.find(p => p.email.toLowerCase() === email.toLowerCase());
        if (!parent) return { success: false, error: 'not_found' };
        if (parent.password !== password) return { success: false, error: 'wrong_password' };
        setCurrentParent(parent);
        localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(parent));
        return { success: true };
    }, []);

    // ============ PARENT LOGOUT ============
    const logoutParent = useCallback(() => {
        setCurrentParent(null);
        localStorage.removeItem(CURRENT_PARENT_KEY);
    }, []);

    // ============ DOCTOR FEATURES ============
    const findChildForDoctor = useCallback((query) => {
        const existing = loadChildren();
        return existing.find(c =>
            c.childId === query.toUpperCase() ||
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

        // Update session if needed
        if (currentChild && currentChild.childId === childId) {
            const updatedChild = { ...currentChild, ...diagnosisData };
            setCurrentChild(updatedChild);
            localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(updatedChild));
        }
    }, [currentChild]);

    // ============ GET CHILD BY ID ============
    const getChildById = useCallback((childId) => {
        const existing = loadChildren();
        return existing.find(c => c.childId === childId.toUpperCase()) || null;
    }, []);

    const linkedChild = currentParent ? getChildById(currentParent.childId) : null;

    // ============ CHILD ROUTINE MANAGEMENT ============
    const updateChildRoutine = useCallback((childId, dateKey, tasksStatus) => {
        const existing = loadChildren();
        const updated = existing.map(c => {
            if (c.childId === childId || c.childId === childId.toUpperCase()) {
                const history = c.routineHistory || {};
                return {
                    ...c,
                    routineHistory: {
                        ...history,
                        [dateKey]: tasksStatus
                    }
                };
            }
            return c;
        });
        saveChildren(updated);
        setChildAccounts(updated);

        // Update current session if applicable
        if (currentChild && (currentChild.childId === childId || currentChild.childId === childId.toUpperCase())) {
            const history = currentChild.routineHistory || {};
            const updatedChild = {
                ...currentChild,
                routineHistory: {
                    ...history,
                    [dateKey]: tasksStatus
                }
            };
            setCurrentChild(updatedChild);
            localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(updatedChild));
        }
    }, [currentChild]);

    // ============ CHILD EMOTION STATS MANAGEMENT ============
    const updateChildEmotionStats = useCallback((childId, dateKey, correctToAdd, totalToAdd) => {
        const existing = loadChildren();
        const updated = existing.map(c => {
            if (c.childId === childId || c.childId === childId.toUpperCase()) {
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

        // Update current session
        if (currentChild && (currentChild.childId === childId || currentChild.childId === childId.toUpperCase())) {
            const history = currentChild.emotionHistory || {};
            const todayStats = history[dateKey] || { correct: 0, total: 0 };
            const updatedChild = {
                ...currentChild,
                emotionHistory: {
                    ...history,
                    [dateKey]: {
                        correct: todayStats.correct + correctToAdd,
                        total: todayStats.total + totalToAdd
                    }
                }
            };
            setCurrentChild(updatedChild);
            localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(updatedChild));
        }
    }, [currentChild]);

    // ============ DOCTOR AUTHENTICATION ============

    const [doctorAccounts, setDoctorAccounts] = useState(() => {
        try { const s = localStorage.getItem(DOCTOR_ACCOUNTS_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
    });

    const [currentDoctor, setCurrentDoctor] = useState(() => {
        try { const s = localStorage.getItem(CURRENT_DOCTOR_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });

    const registerDoctor = useCallback((doctorData) => {
        const existing = loadDoctors();
        if (existing.some(d => d.email.toLowerCase() === doctorData.email.toLowerCase())) {
            return { success: false, error: 'email_exists' };
        }

        const newDoctor = {
            id: `DOC-${Date.now()}`,
            name: doctorData.name,
            age: doctorData.age,
            email: doctorData.email.toLowerCase(),
            gender: doctorData.gender,
            phone: doctorData.phone,
            password: doctorData.password,
            patientIds: [], // Initialize with empty patient list
            createdAt: new Date().toISOString(),
        };

        const updated = [...existing, newDoctor];
        saveDoctors(updated);
        setDoctorAccounts(updated);

        // Auto login
        setCurrentDoctor(newDoctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(newDoctor));

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

    // Manage Doctor's Patients
    const addPatientToDoctor = useCallback((childId) => {
        if (!currentDoctor) return { success: false, error: 'no_doctor' };

        const existingDocs = loadDoctors();
        const updatedDocs = existingDocs.map(d => {
            if (d.id === currentDoctor.id) {
                const pIds = d.patientIds || [];
                // Check if already exists (case insensitive just in case)
                if (pIds.some(id => id.toUpperCase() === childId.toUpperCase())) return d;
                return { ...d, patientIds: [...pIds, childId] };
            }
            return d;
        });

        saveDoctors(updatedDocs);
        setDoctorAccounts(updatedDocs);

        // Update Session
        const updatedCurrentDoctor = updatedDocs.find(d => d.id === currentDoctor.id);
        setCurrentDoctor(updatedCurrentDoctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(updatedCurrentDoctor));

        return { success: true };
    }, [currentDoctor]);

    const removePatientFromDoctor = useCallback((childId) => {
        if (!currentDoctor) return;

        const existingDocs = loadDoctors();
        const updatedDocs = existingDocs.map(d => {
            if (d.id === currentDoctor.id) {
                const pIds = d.patientIds || [];
                return { ...d, patientIds: pIds.filter(id => id !== childId) };
            }
            return d;
        });

        saveDoctors(updatedDocs);
        setDoctorAccounts(updatedDocs);

        // Update Session
        const updatedCurrentDoctor = updatedDocs.find(d => d.id === currentDoctor.id);
        setCurrentDoctor(updatedCurrentDoctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(updatedCurrentDoctor));
    }, [currentDoctor]);


    return (
        <AuthContext.Provider value={{
            currentChild, childAccounts,
            registerChild, loginChild, logoutChild, updateChildProfile, updateChildRoutine, updateChildEmotionStats,
            currentParent, parentAccounts,
            registerParent, loginParent, logoutParent,
            getChildById, linkedChild,
            findChildForDoctor, updateChildDiagnosis,
            doctorAccounts, currentDoctor, registerDoctor, loginDoctor, logoutDoctor,
            addPatientToDoctor, removePatientFromDoctor, // Exported
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
