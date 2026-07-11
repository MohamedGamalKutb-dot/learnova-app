import { Card, CardBody } from '@heroui/react';

export default function ProfileHeaderCard({ isDark, isArabic, userRole, activeUser, setShowAvatarPicker }) {
    return (
        <Card className={`mb-10 relative overflow-hidden rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
            <CardBody className="p-12 text-center pt-8">
                <div onClick={() => userRole === 'child' && setShowAvatarPicker(true)}
                    className={`w-32 h-32 rounded-[40px] mx-auto mb-6 flex items-center justify-center text-6xl cursor-pointer relative z-[1] border-[4px] transition-transform duration-500 hover:scale-110 overflow-hidden shadow-2xl ${isDark ? 'bg-[#0C0D17]/80 border-white/10' : 'bg-white border-indigo-100'}`}
                    style={{ boxShadow: isDark ? '0 10px 40px rgba(99, 102, 241, 0.2)' : '0 10px 40px rgba(99, 102, 241, 0.1)' }}>
                    {activeUser.avatar && (activeUser.avatar.startsWith('data:image') || activeUser.avatar.startsWith('http')) ? (
                        <img src={activeUser.avatar} className="w-full h-full object-cover" alt="Avatar"  loading="lazy" decoding="async"/>
                    ) : activeUser.avatar && activeUser.avatar.length <= 2 ? (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50/10">
                            {activeUser.avatar}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <img src="/icons/profile.png"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                             loading="lazy" decoding="async"/>
                        </div>
                    )}
                </div>
                <h2 className={`text-3xl font-black mb-2 tracking-tighter ${isDark ? 'text-white' : 'text-indigo-900'}`}>{activeUser.name}</h2>
                {userRole === 'child' && (
                    <div className="space-y-3">
                        <div className={`inline-flex items-center gap-1.5 py-2 px-6 rounded-[20px] border backdrop-blur-xl ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                            <span className="font-mono text-lg font-black text-indigo-500 tracking-wider">{activeUser.childId}</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40`}>{isArabic ? 'كود البطل الخاص' : 'Your Hero Code'}</p>
                    </div>
                )}
                {userRole !== 'child' && (
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">{userRole}</p>
                )}
            </CardBody>
        </Card>
    );
}
