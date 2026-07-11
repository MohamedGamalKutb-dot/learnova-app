import { Button, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Input } from '@heroui/react';

export default function RoutineAddModal({ isDark, isArabic, showAddModal, setShowAddModal, newItem, setNewItem, addItem, availableIcons, timeOfDayLabels, timeOfDayLabelsAr }) {
    return (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md" backdrop="blur" 
            classNames={{ 
                base: `backdrop-blur-3xl border rounded-[50px] overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-indigo-100'}`,
                backdrop: 'bg-emerald-950/40 backdrop-blur-sm'
            }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className={`flex flex-col gap-1 text-center justify-center w-full mt-6 font-black text-xl ${isDark ? 'text-emerald-100' : 'text-emerald-900'}`}>
                            {isArabic ? 'نشاط جديد' : 'New Activity'}
                        </ModalHeader>
                        <ModalBody className="pb-8 pt-4 px-8 space-y-6">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 ml-2`}>{isArabic ? 'اختر رمز' : 'CHOOSE ICON'}</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableIcons.map(iconObj => (
                                        <Button key={iconObj.id} isIconOnly radius="xl" variant={newItem.iconId === iconObj.id ? "flat" : "bordered"} onPress={() => setNewItem(p => ({ ...p, iconId: iconObj.id, emoji: iconObj.emoji }))}
                                            className={`h-12 w-12 p-1 overflow-hidden transition-all ${newItem.iconId === iconObj.id ? 'scale-110 bg-emerald-500/20 border-emerald-500' : `opacity-40 ${isDark ? 'border-white/10' : 'border-indigo-100'}`}`}>
                                            <img src={`/icons/${iconObj.id}.png`} 
                                                alt="" 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                            <span style={{ display: 'none' }} className="text-xl">{iconObj.emoji}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Input variant="underlined" label={isArabic ? 'اسم النشاط' : 'Activity Name'} value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                                    classNames={{ label: "font-black text-[10px] opacity-40 uppercase tracking-widest" }} />
                                <Input variant="underlined" label={isArabic ? 'الوقت (اختياري)' : 'Time (Optional)'} placeholder="08:00 AM" value={newItem.startTime} onChange={e => setNewItem(p => ({ ...p, startTime: e.target.value }))}
                                    classNames={{ label: "font-black text-[10px] opacity-40 uppercase tracking-widest" }} />
                            </div>

                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 ml-2`}>{isArabic ? 'فترة اليوم' : 'DAY PERIOD'}</p>
                                <div className="flex gap-2">
                                    {['morning', 'afternoon', 'evening', 'night'].map(tod => (
                                        <Button key={tod} radius="full" size="sm" onPress={() => setNewItem(p => ({ ...p, timeOfDay: tod }))}
                                            variant={newItem.timeOfDay === tod ? "solid" : "bordered"}
                                            className={`flex-1 font-black text-[9px] tracking-widest uppercase transition-all ${newItem.timeOfDay === tod ? 'bg-indigo-500 text-white shadow-lg' : 'opacity-40'}`}>
                                            {(isArabic ? timeOfDayLabelsAr[tod] : timeOfDayLabels[tod]).split(' ')[0]}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="pb-10 pt-4 px-8 flex gap-3">
                            <Button radius="full" size="lg" onPress={addItem} className="flex-1 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-black text-sm shadow-xl shadow-emerald-500/20">
                                {isArabic ? 'إضافة للجدول' : 'ADD TO SCHEDULE'}
                            </Button>
                            <Button radius="full" size="lg" variant="light" onPress={onClose} className="font-black text-xs opacity-40">
                                {isArabic ? 'إلغاء' : 'CANCEL'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
