import { useState, useCallback, useEffect } from 'react';
import { normalizeId } from './useChildAuth';

const PARENTS_KEY = 'learnova_v2_parents';
const CURRENT_PARENT_KEY = 'learnova_v2_current_parent';
const PARENT_ACTIVE_CHILD_KEY = 'learnova_v2_parent_active_child';

export function loadParents() {
    try { const s = localStorage.getItem(PARENTS_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}
export function saveParents(arr: any[]) { localStorage.setItem(PARENTS_KEY, JSON.stringify(arr)); }

export function useParentAuth(childAccounts: any[], setChildAccounts: (accounts: any[]) => void, loadChildren: () => any[]) {
    const [parentAccounts, setParentAccounts] = useState<any[]>(loadParents);
    const [currentParent, setCurrentParent] = useState<any>(() => {
        try { const s = localStorage.getItem(CURRENT_PARENT_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
    });

    const [parentActiveChildId, setParentActiveChildId] = useState<string | null>(() => {
        try {
            const active = localStorage.getItem(PARENT_ACTIVE_CHILD_KEY);
            if (active) return active;
            const s = localStorage.getItem(CURRENT_PARENT_KEY);
            if (s) {
                const parsed = JSON.parse(s);
                const ids = parsed.childIds || (parsed.childId ? [parsed.childId] : []);
                return ids[0] || null;
            }
        } catch { return null; }
        return null;
    });

    useEffect(() => {
        if (parentActiveChildId) {
            localStorage.setItem(PARENT_ACTIVE_CHILD_KEY, parentActiveChildId);
        } else {
            localStorage.removeItem(PARENT_ACTIVE_CHILD_KEY);
        }
    }, [parentActiveChildId]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === PARENTS_KEY) setParentAccounts(loadParents());
            if (e.key === CURRENT_PARENT_KEY) {
                try {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    if (JSON.stringify(updated) !== JSON.stringify(currentParent)) setCurrentParent(updated);
                } catch { }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [currentParent]);

    const registerParent = useCallback(({ name, email, password, phone }: any) => {
        const existingParents = loadParents();
        if (existingParents.find((p: any) => p.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'email_exists' };
        }

        const parent = {
            id: `P-${Date.now()}`,
            name,
            email: email.toLowerCase(),
            password,
            phone,
            childIds: [],
            avatar: '👤',
            createdAt: new Date().toISOString(),
        };
        const updated = [...existingParents, parent];
        saveParents(updated);
        setParentAccounts(updated);
        return { success: true };
    }, []);

    const loginParent = useCallback((email: string, password?: string, isGoogle = false) => {
        const freshParents = loadParents();
        const parent = freshParents.find((p: any) => p.email.toLowerCase() === email.toLowerCase());
        if (!parent) return { success: false, error: 'not_found' };
        if (!isGoogle && parent.password !== password) return { success: false, error: 'wrong_password' };

        setParentAccounts(freshParents);
        setChildAccounts(loadChildren());
        setCurrentParent(parent);
        localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(parent));

        const ids = parent.childIds || (parent.childId ? [parent.childId] : []);
        const savedActive = localStorage.getItem(PARENT_ACTIVE_CHILD_KEY);
        if (savedActive && ids.includes(savedActive)) {
            setParentActiveChildId(savedActive);
        } else {
            setParentActiveChildId(ids[0] || null);
        }
        return { success: true };
    }, [setChildAccounts, loadChildren]);

    const logoutParent = useCallback(() => {
        setCurrentParent(null);
        setParentActiveChildId(null);
        localStorage.removeItem(CURRENT_PARENT_KEY);
        localStorage.removeItem(PARENT_ACTIVE_CHILD_KEY);
    }, []);

    const addChildToParent = useCallback((childId: string) => {
        if (!currentParent) return { success: false, error: 'no_parent' };
        const existingParents = loadParents();
        const normInputId = normalizeId(childId);
        const existingChildren = loadChildren();
        const linkedChild = existingChildren.find((c: any) => normalizeId(c.childId) === normInputId);
        if (!linkedChild) return { success: false, error: 'child_not_found' };

        const updated = existingParents.map((p: any) => {
            if (p.id === currentParent.id) {
                const childIds = p.childIds || (p.childId ? [p.childId] : []);
                if (childIds.includes(linkedChild.childId)) return p;
                return { ...p, childIds: [...childIds, linkedChild.childId] };
            }
            return p;
        });

        const updatedParent = updated.find((p: any) => p.id === currentParent.id);
        const wasAdded = (updatedParent.childIds || []).length > ((currentParent.childIds || (currentParent.childId ? [currentParent.childId] : [])).length);

        if (wasAdded) {
            saveParents(updated);
            setParentAccounts(updated);
            setCurrentParent(updatedParent);
            localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(updatedParent));
            if (!parentActiveChildId) {
                setParentActiveChildId(linkedChild.childId);
            }
            return { success: true, childName: linkedChild.name };
        }
        return { success: false, error: 'already_exists' };
    }, [currentParent, parentActiveChildId, loadChildren]);

    const removeChildFromParent = useCallback((childId: string) => {
        if (!currentParent) return { success: false, error: 'no_parent' };
        const existingParents = loadParents();
        
        const updated = existingParents.map((p: any) => {
            if (p.id === currentParent.id) {
                const childIds = p.childIds || (p.childId ? [p.childId] : []);
                return { ...p, childIds: childIds.filter((id: string) => id !== childId) };
            }
            return p;
        });

        const updatedParent = updated.find((p: any) => p.id === currentParent.id);
        saveParents(updated);
        setParentAccounts(updated);
        setCurrentParent(updatedParent);
        localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(updatedParent));
        
        if (parentActiveChildId === childId) {
            setParentActiveChildId(updatedParent.childIds?.[0] || null);
        }
        return { success: true };
    }, [currentParent, parentActiveChildId]);

    const updateParentProfile = useCallback((updates: any) => {
        if (!currentParent) return;
        const existing = loadParents();
        const updated = existing.map((p: any) =>
            p.id === currentParent.id ? { ...p, ...updates } : p
        );
        saveParents(updated);
        setParentAccounts(updated);
        const updatedParent = { ...currentParent, ...updates };
        setCurrentParent(updatedParent);
        localStorage.setItem(CURRENT_PARENT_KEY, JSON.stringify(updatedParent));
    }, [currentParent]);

    return {
        parentAccounts,
        setParentAccounts,
        currentParent,
        parentActiveChildId,
        setParentActiveChildId,
        registerParent,
        loginParent,
        logoutParent,
        addChildToParent,
        removeChildFromParent,
        updateParentProfile
    };
}
