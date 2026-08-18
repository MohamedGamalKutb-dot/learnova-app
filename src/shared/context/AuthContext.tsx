import { createContext, useContext, useCallback, ReactNode, useEffect } from 'react';
import { useChildAuth, loadChildren, saveChildren, normalizeId } from '../../features/auth/hooks/useChildAuth';
import { useParentAuth, loadParents, saveParents } from '../../features/auth/hooks/useParentAuth';
import { useDoctorAuth, loadDoctors, saveDoctors } from '../../features/auth/hooks/useDoctorAuth';

const AuthContext = createContext<any>(null);

// Global debug helper
if (typeof window !== 'undefined') {
    (window as any).showHeroes = () => {
        console.table(loadChildren());
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const childAuth = useChildAuth();
    const parentAuth = useParentAuth(childAuth.childAccounts, childAuth.setChildAccounts, loadChildren);
    const doctorAuth = useDoctorAuth(loadChildren);

    // ============ REAL-TIME SYNC POLL ============
    // A fast 1s polling interval to keep localStorage changes in sync across hooks
    useEffect(() => {
        const interval = setInterval(() => {
            const freshChildren = loadChildren();
            childAuth.setChildAccounts((prev: any) => JSON.stringify(prev) !== JSON.stringify(freshChildren) ? freshChildren : prev);
            const freshDoctors = loadDoctors();
            doctorAuth.setDoctorAccounts((prev: any) => JSON.stringify(prev) !== JSON.stringify(freshDoctors) ? freshDoctors : prev);
        }, 1000);
        return () => clearInterval(interval);
    }, [childAuth, doctorAuth]);

    const getChildById = useCallback((childId: string) => {
        if (!childId) return null;
        const existing = loadChildren();
        const normId = normalizeId(childId);
        return existing.find((c: any) => normalizeId(c.childId) === normId) || null;
    }, []);

    const linkedChild = parentAuth.currentParent
        ? (childAuth.childAccounts.find((c: any) => normalizeId(c.childId) === normalizeId(parentAuth.parentActiveChildId)) ||
           childAuth.childAccounts.find((c: any) => (parentAuth.currentParent.childIds || []).includes(c.childId)) ||
           childAuth.childAccounts.find((c: any) => normalizeId(c.childId) === normalizeId(parentAuth.currentParent.childId)))
        : null;

    const deleteAccount = useCallback(async (role: string, id: string) => {
        try {
            const { auth } = await import('../../shared/firebase/config');
            if (auth.currentUser) {
                const { deleteUser } = await import('firebase/auth');
                await deleteUser(auth.currentUser);
            }
        } catch (err) {
            console.error("Firebase delete error:", err);
        }

        if (role === 'child') {
            const existing = loadChildren();
            saveChildren(existing.filter((c: any) => c.childId !== id));
            childAuth.setChildAccounts(loadChildren());
            childAuth.logoutChild();
        } else if (role === 'parent') {
            const existing = loadParents();
            saveParents(existing.filter((p: any) => p.id !== id));
            parentAuth.logoutParent();
            // Need to update parent hook state, handled partially by logout, 
            // but for full sync it will catch via localStorage or reload.
        } else if (role === 'doctor') {
            const existing = loadDoctors();
            saveDoctors(existing.filter((d: any) => d.id !== id));
            doctorAuth.logoutDoctor();
        }
        return { success: true };
    }, [childAuth, parentAuth, doctorAuth]);

    return (
        <AuthContext.Provider value={{
            ...childAuth,
            ...parentAuth,
            ...doctorAuth,
            getChildById,
            linkedChild,
            deleteAccount,
            isChildLoggedIn: !!childAuth.currentChild,
            isParentLoggedIn: !!parentAuth.currentParent,
            isDoctorLoggedIn: !!doctorAuth.currentDoctor,
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
