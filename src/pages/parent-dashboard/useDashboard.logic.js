/**
 * useDashboard.logic.js
 * ─────────────────────────────────────────────────────────
 * Rule 4: Logic Separation — Custom hook for DashboardPage.
 * Keeps all state management, effects, and handlers away from the JSX.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function useDashboardLogic() {
    const { isDark, isArabic } = useApp();
    const { currentParent, childAccounts, linkChild } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [linkChildCode, setLinkChildCode] = useState('');
    const [linkError, setLinkError] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [activeReportTab, setActiveReportTab] = useState('general');
    const [viewingAssessment, setViewingAssessment] = useState(null);

    const linkedChildren = childAccounts.filter(c =>
        currentParent?.childrenIds?.some(id => id.toUpperCase() === c.childId.toUpperCase())
    );

    const handleLinkChild = async () => {
        setLinkError('');
        if (!linkChildCode.trim()) return;
        const res = await linkChild(linkChildCode.trim().toUpperCase());
        if (res.success) {
            setShowLinkModal(false);
            setLinkChildCode('');
        } else {
            setLinkError(res.message || 'Child not found');
        }
    };

    return {
        isDark, isArabic,
        currentParent, linkedChildren,
        sidebarOpen, setSidebarOpen,
        linkChildCode, setLinkChildCode,
        linkError, setLinkError,
        showLinkModal, setShowLinkModal,
        activeReportTab, setActiveReportTab,
        viewingAssessment, setViewingAssessment,
        handleLinkChild,
    };
}
