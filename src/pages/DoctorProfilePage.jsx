import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardBody, Input, Avatar } from '@heroui/react';
import MainNavbar from '../components/MainNavbar';

export default function DoctorProfilePage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentDoctor, updateDoctorProfile } = useAuth();
    const fileInputRef = useRef(null);

    const [editData, setEditData] = useState({
        name: currentDoctor?.name || '',
        email: currentDoctor?.email || '',
        specialty: currentDoctor?.specialty || (isArabic ? 'أخصائي توحد' : 'Autism Specialist'),
        avatar: currentDoctor?.avatar || '🩺'
    });

    if (!currentDoctor) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditData(prev => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        updateDoctorProfile(editData);
        navigate('/doctor-dashboard');
    };

    const auraBg = isDark ? 'bg-[#080912]' : 'bg-slate-50';

    return (
        <div className={`min-h-screen relative ${isArabic ? 'font-[Cairo,sans-serif]' : "font-['Plus_Jakarta_Sans',sans-serif]"} ${auraBg} transition-colors duration-1000`} dir={isArabic ? 'rtl' : 'ltr'}>
            <MainNavbar userType="doctor" />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-12">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight">{isArabic ? 'الملف الشخصي للطبيب' : 'Clinical Identity'}</h1>
                        <p className={`text-[11px] uppercase font-black tracking-[0.3em] ${isDark ? 'text-emerald-300/30' : 'text-emerald-600/40'}`}>
                            {isArabic ? 'إدارة البيانات المهنية' : 'Professional Record Management'}
                        </p>
                    </div>
                    <Button 
                        variant="flat" 
                        onPress={() => navigate('/doctor-dashboard')}
                        className="font-bold rounded-2xl"
                    >
                        {isArabic ? 'رجوع' : 'Back'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Sidebar: Profile Photo */}
                    <div className="lg:col-span-1">
                        <Card className={`border-none shadow-2xl ${isDark ? 'bg-[#111322]' : 'bg-white'} rounded-[40px] overflow-hidden`}>
                            <CardBody className="p-10 flex flex-col items-center text-center">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                    <div className="w-40 h-40 rounded-[50px] border-4 border-emerald-500/30 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                        <Avatar
                                            className="w-full h-full text-5xl"
                                            src={editData.avatar?.length > 10 ? editData.avatar : undefined}
                                            icon={editData.avatar?.length <= 2 ? <span className="text-5xl font-black">{editData.avatar}</span> : undefined}
                                            radius="none"
                                        />
                                        <div className="absolute inset-0 bg-emerald-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white font-black text-xs tracking-widest uppercase">{isArabic ? 'تعديل' : 'Modify'}</span>
                                        </div>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                                <h2 className="mt-8 text-2xl font-black">{editData.name}</h2>
                                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-2">{editData.specialty}</p>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Main Content: Form */}
                    <div className="lg:col-span-2">
                        <Card className={`border-none shadow-2xl ${isDark ? 'bg-[#111322]' : 'bg-white'} rounded-[40px] overflow-hidden`}>
                            <CardBody className="p-12 space-y-8">
                                <div className="space-y-3">
                                    <label className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-300/50' : 'text-slate-500'}`}>{isArabic ? 'اسم الطبيب' : 'Clinical Name'}</label>
                                    <Input
                                        variant="flat"
                                        radius="2xl"
                                        size="lg"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        classNames={{
                                            input: "font-bold text-lg",
                                            inputWrapper: isDark ? "bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5 h-16" : "bg-slate-50 border-slate-200 h-16"
                                        }}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-300/50' : 'text-slate-500'}`}>{isArabic ? 'التخصص' : 'Specialization'}</label>
                                    <Input
                                        variant="flat"
                                        radius="2xl"
                                        size="lg"
                                        value={editData.specialty}
                                        onChange={(e) => setEditData({ ...editData, specialty: e.target.value })}
                                        classNames={{
                                            input: "font-bold text-lg",
                                            inputWrapper: isDark ? "bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5 h-16" : "bg-slate-50 border-slate-200 h-16"
                                        }}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-300/50' : 'text-slate-500'}`}>{isArabic ? 'البريد المهني' : 'Professional Email'}</label>
                                    <Input
                                        variant="flat"
                                        radius="2xl"
                                        size="lg"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        classNames={{
                                            input: "font-bold text-lg",
                                            inputWrapper: isDark ? "bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5 h-16" : "bg-slate-50 border-slate-200 h-16"
                                        }}
                                    />
                                </div>

                                <div className="pt-6">
                                    <Button 
                                        className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-black h-16 rounded-[24px] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                                        onPress={handleSave}
                                    >
                                        {isArabic ? 'حفظ البيانات المهنية' : 'Save Clinical Record'}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
