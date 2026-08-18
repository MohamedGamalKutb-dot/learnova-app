import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@heroui/react';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { ROUTES } from '../../../constants/routes';

interface SidebarTab {
    key: string;
    label: string;
    icon: string | React.ReactNode;
}

interface ParentSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    activeSidebarTab: string;
    sidebarTabs: SidebarTab[];
    isDark: boolean;
    isArabic: boolean;
    currentParent: any;
    parentChildren: any[];
    activeChildId: string | undefined;
    setParentActiveChildId: (id: string) => void;
    removeChildFromParent: (id: string) => Promise<any>;
    setShowAddChildModal: (show: boolean) => void;
    onRemoveChildSuccess: (msg: string) => void;
    onRemoveChildError: (msg: string) => void;
}

export default function ParentSidebar({
    sidebarOpen,
    setSidebarOpen,
    activeSidebarTab,
    sidebarTabs,
    isDark,
    isArabic,
    currentParent,
    parentChildren,
    activeChildId,
    setParentActiveChildId,
    removeChildFromParent,
    setShowAddChildModal,
    onRemoveChildSuccess,
    onRemoveChildError
}: ParentSidebarProps) {
    const navigate = useNavigate();
    const [deletingChildId, setDeletingChildId] = useState<string | null>(null);

    const handleRemoveChild = async (e: React.MouseEvent, childId: string) => {
        e.stopPropagation();
        setDeletingChildId(childId);
        try {
            const res = await removeChildFromParent(childId);
            if (res.success) {
                onRemoveChildSuccess(isArabic ? 'تم إزالة الطفل بنجاح' : 'Child removed successfully');
            } else {
                onRemoveChildError(isArabic ? 'حدث خطأ أثناء الإزالة' : 'Error removing child');
            }
        } catch (error) {
            onRemoveChildError(isArabic ? 'حدث خطأ أثناء الإزالة' : 'Error removing child');
        } finally {
            setDeletingChildId(null);
        }
    };

    return (
        <aside className={`fixed left-0 top-[72px] bottom-0 w-[270px] flex flex-col py-6 z-40 border-r transition-transform duration-300 ${isDark ? 'bg-[#080912]/98 border-white/10' : 'bg-white/98 border-slate-200'} backdrop-blur-2xl overflow-y-auto scrollbar-hide shadow-[10px_0_30px_rgba(0,0,0,0.08)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

            {/* Profile Header */}
            <div 
                onClick={() => navigate(ROUTES.PARENT_PROFILE)}
                className={`px-8 mb-6 pb-6 border-b cursor-pointer group transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform">
                        {currentParent?.avatar && currentParent.avatar.length > 10 ? (
                            <img src={currentParent.avatar} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async"/>
                        ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-xl">👨</div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h3 className={`font-bold text-[15px] leading-tight mb-0.5 ${isDark ? 'text-indigo-400' : 'text-[#2B52D0]'}`}>
                            {currentParent?.name || (isArabic ? 'ولي الأمر' : 'Parent')}
                        </h3>
                        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isArabic ? 'تعديل البيانات' : 'Edit Profile'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Children List & Add Button */}
            <div className="px-6 mb-6 pb-6 border-b">
                <div className="flex justify-between items-center mb-3.5">
                    <span className={`text-[12px] font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isArabic ? 'أطفالي المتابعون' : 'My Children'}
                    </span>
                    <Button size="sm" isIconOnly variant="light" radius="full" 
                        className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 w-7 h-7 min-w-0"
                        onPress={() => setShowAddChildModal(true)}>
                        +
                    </Button>
                </div>
                
                <div className="flex flex-col gap-2">
                    {parentChildren.map((c: any) => {
                        const isActive = c.childId === activeChildId;
                        return (
                            <div 
                                key={c.childId}
                                onClick={() => {
                                    setParentActiveChildId(c.childId);
                                    setSidebarOpen(false); // Close sidebar on mobile after selection
                                }}
                                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-all duration-300 ${isActive ? (isDark ? 'bg-indigo-500/10 border-indigo-500/35 text-white' : 'bg-indigo-50 border-indigo-200 text-[#2B52D0]') : (isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-400' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-600')}`}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-indigo-100 flex items-center justify-center text-lg">
                                    {c.avatar && (c.avatar.startsWith('data:image') || c.avatar.startsWith('http')) ? (
                                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                    ) : (
                                        <span>{c.avatar || '👶'}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[13px] truncate">{c.name}</div>
                                    <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{c.childId}</div>
                                </div>
                                {isActive && <div className="text-emerald-500 text-sm">●</div>}
                                <button
                                    className="min-w-0 w-8 h-8 opacity-60 hover:opacity-100 flex items-center justify-center text-danger rounded-full hover:bg-danger/10 transition-colors"
                                    onClick={(e) => handleRemoveChild(e, c.childId)}
                                    disabled={deletingChildId === c.childId}
                                >
                                    {deletingChildId === c.childId ? <Spinner size="sm" color="danger" /> : <FaTrash size={12} />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1 w-full">
                {sidebarTabs.map(tab => {
                    const isActive = activeSidebarTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => {
                                navigate(`${ROUTES.PARENT_DASHBOARD}/${tab.key.replace('_', '-')}`);
                                setSidebarOpen(false);
                            }}
                            className={`flex items-center gap-4 px-8 py-4 w-full transition-all duration-300 relative ${isActive ? (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-[#F2F6FE] text-[#2B52D0]') : (isDark ? 'text-slate-400 hover:bg-white/5' : 'text-[#6B7280] hover:bg-slate-50')} group`}
                        >
                            {/* Active Right Border */}
                            {isActive && (
                                <div className={`absolute right-0 top-0 bottom-0 w-1.5 rounded-l-lg ${isDark ? 'bg-indigo-500' : 'bg-[#2B52D0]'}`} />
                            )}

                            <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'scale-110 drop-shadow-md' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                                {typeof tab.icon === 'string' ? <img src={tab.icon} alt="" className="w-full h-full object-contain" loading="lazy" decoding="async"/> : <span className="text-xl">{tab.icon}</span>}
                            </div>
                            <span className={`text-[14px] font-semibold tracking-wide ${isArabic ? 'text-right flex-1' : 'text-left flex-1'}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
