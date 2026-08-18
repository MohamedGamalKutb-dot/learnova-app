import { useState, useCallback, useEffect } from 'react';
import { normalizeId } from './useChildAuth';

const DOCTOR_ACCOUNTS_KEY = 'learnova_v2_doctor_accounts';
const CURRENT_DOCTOR_KEY = 'learnova_v2_current_doctor';

export function loadDoctors() {
    try { const s = localStorage.getItem(DOCTOR_ACCOUNTS_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}
export function saveDoctors(arr: any[]) { localStorage.setItem(DOCTOR_ACCOUNTS_KEY, JSON.stringify(arr)); }

export function useDoctorAuth(loadChildren: () => any[]) {
    const [doctorAccounts, setDoctorAccounts] = useState<any[]>(loadDoctors);
    const [currentDoctor, setCurrentDoctor] = useState<any>(() => {
        try { const s = localStorage.getItem(CURRENT_DOCTOR_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === DOCTOR_ACCOUNTS_KEY) setDoctorAccounts(loadDoctors());
            if (e.key === CURRENT_DOCTOR_KEY) {
                try {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    if (JSON.stringify(updated) !== JSON.stringify(currentDoctor)) setCurrentDoctor(updated);
                } catch { }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [currentDoctor]);

    const registerDoctor = useCallback((doctorData: any) => {
        const existing = loadDoctors();
        if (existing.some((d: any) => d.email.toLowerCase() === doctorData.email.toLowerCase())) {
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

    const loginDoctor = useCallback((email: string, password?: string, isGoogle = false) => {
        const existing = loadDoctors();
        const doctor = existing.find((d: any) => d.email.toLowerCase() === email.toLowerCase());
        if (!doctor) return { success: false, error: 'not_found' };
        if (!isGoogle && doctor.password !== password) return { success: false, error: 'wrong_password' };

        setCurrentDoctor(doctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(doctor));
        return { success: true };
    }, []);

    const logoutDoctor = useCallback(() => {
        setCurrentDoctor(null);
        localStorage.removeItem(CURRENT_DOCTOR_KEY);
    }, []);

    const addPatientToDoctor = useCallback((childId: string) => {
        if (!currentDoctor) return { success: false, error: 'no_doctor' };
        const existing = loadDoctors();
        const updated = existing.map((d: any) => {
            if (d.id === currentDoctor.id) {
                const patients = d.patientIds || [];
                if (patients.includes(childId)) return d;
                return { ...d, patientIds: [...patients, childId] };
            }
            return d;
        });
        
        const updatedDoctor = updated.find((d: any) => d.id === currentDoctor.id);
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

    const updateDoctorProfile = useCallback((updates: any) => {
        if (!currentDoctor) return;
        const existing = loadDoctors();
        const updated = existing.map((d: any) =>
            d.id === currentDoctor.id ? { ...d, ...updates } : d
        );
        saveDoctors(updated);
        setDoctorAccounts(updated);
        const updatedDoctor = { ...currentDoctor, ...updates };
        setCurrentDoctor(updatedDoctor);
        localStorage.setItem(CURRENT_DOCTOR_KEY, JSON.stringify(updatedDoctor));
    }, [currentDoctor]);

    const findChildForDoctor = useCallback((query: string) => {
        const existing = loadChildren();
        const normQuery = normalizeId(query);
        return existing.find((c: any) =>
            normalizeId(c.childId) === normQuery ||
            (c.parentPhone && c.parentPhone === query)
        ) || null;
    }, [loadChildren]);

    return {
        doctorAccounts,
        setDoctorAccounts,
        currentDoctor,
        registerDoctor,
        loginDoctor,
        logoutDoctor,
        addPatientToDoctor,
        updateDoctorProfile,
        findChildForDoctor
    };
}
