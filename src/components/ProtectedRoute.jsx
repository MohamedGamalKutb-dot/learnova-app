import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - يمنع الوصول للصفحات المحمية لو اليوزر مش مسجل دخول
 * لو مش مسجل دخول → يتوجه لصفحة تسجيل الدخول المناسبة
 * 
 * @param {string} role - نوع المستخدم المطلوب: 'child' | 'parent' | 'doctor'
 * @param {string} redirectTo - المسار اللي هيتوجه ليه لو مش مسجل دخول
 * @param {React.ReactNode} children - الصفحة المحمية
 */
export default function ProtectedRoute({ role, redirectTo, children }) {
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
