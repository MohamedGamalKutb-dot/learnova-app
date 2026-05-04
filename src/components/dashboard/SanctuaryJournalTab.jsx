import { Card, CardBody, Button, Textarea } from '@heroui/react';

export default function SanctuaryJournalTab({
    isArabic, isDark, auraCard, SectionTitle, hero,
    todayRoutinePct, todayEmotionPct,
    showNoteInput, setShowNoteInput, noteText, setNoteText,
    handleAddNote, removeDailyNote, data
}) {
    return (
        <>
            {/* CHILD SUMMARY HEADER (Aura Signature Hero) */}
            <div className={`relative px-8 py-10 rounded-[50px] border overflow-hidden transition-all duration-700 ${isDark ? 'bg-gradient-to-br from-indigo-950/40 via-[#080912] to-purple-950/40 border-white/10' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-200'} shadow-2xl group`}>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000" />

                <div className="flex flex-col md:flex-row items-center gap-7 relative z-[1]">
                    <div className="w-[110px] h-[110px] rounded-[42px] bg-white/10 flex items-center justify-center backdrop-blur-3xl border-2 border-white/20 overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                        {hero?.avatar && hero.avatar.length > 10 ? (
                            <img src={hero.avatar} className="w-full h-full object-cover" alt={hero?.name} />
                        ) : (
                            <span className="text-5xl leading-none select-none">{hero?.avatar || '👦'}</span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    </div>
                    <div className="flex-1 text-center md:text-start space-y-3">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h2 className="m-0 text-white text-3xl font-black tracking-tighter leading-none">{hero?.name || (isArabic ? 'بطلنا الصغير' : 'Little Hero')}</h2>
                            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-black text-white/90 uppercase tracking-widest border border-white/5">{hero?.gender || '...'}</span>
                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-black text-white/90 uppercase tracking-widest border border-white/5">{hero?.age || '0'} {isArabic ? 'سنوات' : 'Years'}</span>
                            <span className="px-4 py-1.5 rounded-full bg-indigo-500/30 backdrop-blur-md text-[11px] font-black text-white uppercase tracking-widest border border-indigo-400/20">#{hero?.childId || '000'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center px-8 py-5 rounded-[35px] bg-white/5 border border-white/10 backdrop-blur-xl group-hover:bg-white/10 transition-colors">
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mb-1.5">{isArabic ? 'التقدم اليومي' : 'Daily Flow'}</span>
                        <span className="text-3xl font-black text-white">{(todayRoutinePct + todayEmotionPct) / 2}%</span>
                    </div>
                </div>
            </div>

            {/* DAILY NOTES (Sanctuary Journal) */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <SectionTitle icon="/icons/sanctuary_journal.png" title={isArabic ? 'سجل السلوك' : 'Sanctuary Journal'} />
                    <Button size="md" radius="full" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-8 shadow-[0_10px_25px_rgba(99,102,241,0.4)]" onPress={() => setShowNoteInput(!showNoteInput)}>
                        {isArabic ? '+ تدوين ملاحظة' : '+ New Entry'}
                    </Button>
                </div>

                {showNoteInput && (
                    <Card className={`rounded-[45px] border animate-in slide-in-from-top-4 duration-500 ${auraCard}`}>
                        <CardBody className="p-8">
                            <Textarea variant="flat" placeholder={isArabic ? 'كيف كان يوم بطلك؟ شاركنا ملاحظاتك...' : 'Record today\'s observations or milestones...'}
                                value={noteText} onChange={e => setNoteText(e.target.value)} size="lg" radius="3xl"
                                className="text-lg font-bold" classNames={{ input: isDark ? 'text-white' : 'text-slate-800', inputWrapper: 'bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5' }} />
                            <div className="flex justify-end gap-4 mt-5">
                                <Button variant="flat" radius="full" className={`font-black tracking-widest uppercase text-[12px] border border-white/10 ${isDark ? 'text-white/60' : 'text-slate-500'}`} onPress={() => setShowNoteInput(false)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                                <Button className="bg-white text-[#080912] font-black px-10 rounded-full shadow-xl" onPress={handleAddNote}>{isArabic ? 'حفظ' : 'Save'}</Button>
                            </div>
                        </CardBody>
                    </Card>
                )}

                <div className="space-y-5">
                    {data?.dailyNotes && data.dailyNotes.length > 0 ? (
                        [...data.dailyNotes].reverse().map((note, idx) => (
                            <Card key={idx} className={`rounded-[40px] border group transition-all duration-500 hover:border-white/20 ${auraCard}`}>
                                <CardBody className="p-8">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 flex items-center justify-center overflow-hidden">
                                                <img src="/icons/journal_entry.png" alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className={`text-[11px] uppercase font-black tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                                {note.date || new Date().toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Button isIconOnly size="sm" variant="light" radius="full" className="opacity-0 group-hover:opacity-100 transition-opacity" onPress={() => removeDailyNote(data.dailyNotes.length - 1 - idx)}>
                                            <div className="w-5 h-5 overflow-hidden"><img src="/icons/quiz_wrong.png" className="w-full h-full object-contain" /></div>
                                        </Button>
                                    </div>
                                    <p className={`text-[17px] font-black m-0 leading-relaxed ${isDark ? 'text-indigo-100/90' : 'text-slate-700'}`}>{note.note}</p>
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <div className={`text-center py-16 border-2 border-dashed rounded-[50px] ${isDark ? 'border-white/5 text-white/10' : 'border-slate-200 text-slate-300'}`}>
                            <div className="w-20 h-20 mx-auto mb-4 opacity-40">
                                <img src="/icons/empty_state.png" alt="" className="w-full h-full object-contain grayscale" />
                            </div>
                            <p className="font-black text-xl tracking-tighter">{isArabic ? 'السجل فارغ اليوم' : 'The journal is quiet today'}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
