import { Card, CardBody, Input, Button } from '@heroui/react';

interface ProfileIdentityCardProps {
    isDark: boolean;
    isArabic: boolean;
    userRole: string;
    activeUser: any;
    editingField: string | null;
    editValue: string;
    setEditValue: (val: string) => void;
    setEditingField: (field: string | null) => void;
    startEdit: (field: string, value: any) => void;
    saveEdit: () => void;
}

export default function ProfileIdentityCard({ isDark, isArabic, userRole, activeUser, editingField, editValue, setEditValue, setEditingField, startEdit, saveEdit }: ProfileIdentityCardProps) {
    const fields = [
        { key: 'name', label: isArabic ? 'الاسم' : 'Name', value: activeUser.name, emoji: '📛', show: true },
        { key: 'age', label: isArabic ? 'العمر' : 'Age', value: activeUser.age ? `${activeUser.age} ${isArabic ? 'سنوات' : 'years'}` : '--', emoji: '🎂', show: userRole === 'child' },
        { key: 'email', label: isArabic ? 'البريد الإلكتروني' : 'Email Address', value: activeUser.email || '--', emoji: '📧', show: true },
        { key: 'gender', label: isArabic ? 'الجنس' : 'Gender', value: activeUser.gender === 'Male' ? (isArabic ? 'ذكر' : 'Male') : (isArabic ? 'أنثى' : 'Female'), emoji: activeUser.gender === 'Male' ? '👦' : '👧', editable: false, show: userRole === 'child' },
    ].filter(f => f.show);

    return (
        <Card className={`mb-10 rounded-[40px] border transition-all duration-700 backdrop-blur-3xl shadow-xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
            <CardBody className="p-10 space-y-8">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-1000 ${isDark ? 'opacity-30 text-white' : 'opacity-50 text-indigo-900'}`}>{isArabic ? 'بيانات الهوية' : 'Identity Hub'}</h3>
                <div className="flex flex-col gap-6">
                    {fields.map(field => (
                        <div key={field.key} className={`flex items-start gap-4 group py-4 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-indigo-50'}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all duration-500 overflow-hidden ${isDark ? 'bg-white/5 border border-white/10' : 'bg-indigo-50 border border-indigo-100'}`}>
                                <img src={`/icons/profile_${field.key}.png`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                                <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">{field.emoji}</span>
                            </div>
                            <div className="flex-1">
                                <div className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-1`}>{field.label}</div>
                                {editingField === field.key ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={editValue}
                                            onChange={e => setEditValue(e.target.value)}
                                            type={field.key === 'age' ? 'number' : 'text'}
                                            variant="flat"
                                            radius="full"
                                            autoFocus
                                            className="max-w-[400px]"
                                            classNames={{ inputWrapper: `${isDark ? 'bg-white/10 border border-indigo-500/30' : 'bg-white border border-indigo-200'}` }}
                                        />
                                        <Button isIconOnly size="sm" radius="full" className="bg-indigo-500 text-white font-black" onPress={saveEdit}>✓</Button>
                                        <Button isIconOnly size="sm" radius="full" color="danger" variant="flat" onPress={() => setEditingField(null)}>✕</Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-bold">{field.value}</span>
                                        {userRole === 'child' && field.editable !== false && (
                                            <Button isIconOnly size="sm" variant="light" radius="full" className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/10"
                                                onPress={() => startEdit(field.key, field.key === 'age' ? activeUser.age : activeUser[field.key])}>
                                                ✏️
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
