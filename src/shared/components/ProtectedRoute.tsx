import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { ReactNode } from 'react';

/**
 * ProtectedRoute - يمنع الوصول للصفحات المحمية لو اليوزر مش مسجل دخول
 * لو مش مسجل دخول → يتوجه لصفحة تسجيل الدخول المناسبة
 * 
 * @param role - نوع المستخدم المطلوب: 'child' | 'parent' | 'doctor'
 * @param redirectTo - المسار اللي هيتوجه ليه لو مش مسجل دخول
 * @param children - الصفحة المحمية
 */

interface ProtectedRouteProps {
    role?: 'child' | 'parent' | 'doctor';
    redirectTo?: string;
    children: ReactNode;
}

export default function ProtectedRoute({ role, redirectTo, children }: ProtectedRouteProps) {
    const { currentChild, currentParent, currentDoctor } = useAuth();

    let isAuthenticated = false;

    switch (role) {
        case 'child':
            isAuthenticated = !!currentChild;
            break;
        case 'parent':
            isAuthenticated = !!currentParent;
            break;
        case 'doctor':
            isAuthenticated = !!currentDoctor;
            break;
        default:
            isAuthenticated = !!currentChild || !!currentParent || !!currentDoctor;
            break;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo || '/choice'} replace />;
    }

    return children;
}
