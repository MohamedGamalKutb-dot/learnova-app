import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * GuestRoute - يمنع اليوزر المسجل دخول من الوصول لصفحات Login/Signup
 * لو مسجل دخول → يتوجه للصفحة الرئيسية بتاعته
 * 
 * مثال: لو الطفل مسجل دخول وكتب /child-login في الـ URL → يروح /child-home
 * 
 * @param {string} role - نوع المستخدم: 'child' | 'parent' | 'doctor'
 * @param {React.ReactNode} children - صفحة الـ Login/Signup
 */
export default function GuestRoute({ role, children }) {
    const { currentChild, currentParent, currentDoctor } = useAuth();

    switch (role) {
        case 'child':
            if (currentChild) return <Navigate to="/child-home" replace />;
            break;
        case 'parent':
            if (currentParent) return <Navigate to="/parent-dashboard" replace />;
            break;
        case 'doctor':
            if (currentDoctor) return <Navigate to="/doctor-dashboard" replace />;
            break;
        default:
            // لو أي حد مسجل دخول، وجهه للصفحة المناسبة
            if (currentChild) return <Navigate to="/child-home" replace />;
            if (currentParent) return <Navigate to="/parent-dashboard" replace />;
            if (currentDoctor) return <Navigate to="/doctor-dashboard" replace />;
            break;
    }

    return children;
}
