import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/context/AppContext';
import { useAuth } from '../../shared/context/AuthContext';
import MainNavbar from '../../shared/components/MainNavbar';
import { Button, useDisclosure } from '@heroui/react';
import { motion } from 'framer-motion';

import { recordPianoNote, saveMelody, getMelodies, getGameStats, deleteMelody, subscribeToMelodies, subscribeToGameStats, syncLocalDataToFirebase, getPianoConfig } from './server/pianoServer';
import PianoHeader from './components/PianoHeader';
import PianoCurrentNote from './components/PianoCurrentNote';
import PianoKeyboard from './components/PianoKeyboard';
import PianoControls from './components/PianoControls';
import PianoMelodiesModal from './components/PianoMelodiesModal';

export default function Piano() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();

    const [activeKeys, setActiveKeys] = useState(new Set());
    const [lastNote, setLastNote] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [savedMelodies, setSavedMelodies] = useState([]);
    const [stats, setStats] = useState({ totalNotes: 0, melodiesSaved: 0 });
    const [octaveShift, setOctaveShift] = useState(0);

    const [pianoConfig, setPianoConfig] = useState({
        notes: [],
        keyColors: {},
        keyToCode: {}
    });

    const { notes: NOTES = [], keyColors: KEY_COLORS = {}, keyToCode: KEY_TO_CODE = {} } = pianoConfig;

    const audioCtxRef = useRef(null);
    const recordStartRef = useRef(null);
    const { isOpen: isMelodiesOpen, onOpen: onMelodiesOpen, onClose: onMelodiesClose } = useDisclosure();
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        getPianoConfig().then(config => {
            if (config && isMountedRef.current) {
                setPianoConfig(config);
            }
        });
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!currentChild?.childId) return;

        syncLocalDataToFirebase(currentChild.childId);

        const gameStats = getGameStats(currentChild.childId);
        setStats({ totalNotes: gameStats.pianoTotalNotes || 0, melodiesSaved: gameStats.pianoMelodiesSaved || 0 });
        setSavedMelodies(getMelodies(currentChild.childId));

        const unsubStats = subscribeToGameStats(currentChild.childId, (freshStats) => {
            if (isMountedRef.current && freshStats) {
                setStats({
                    totalNotes: freshStats.pianoTotalNotes || 0,
                    melodiesSaved: freshStats.pianoMelodiesSaved || 0
                });
            }
        });

        const unsubMelodies = subscribeToMelodies(currentChild.childId, (freshMelodies) => {
            if (isMountedRef.current) {
                setSavedMelodies(freshMelodies);
            }
        });

        return () => {
            unsubStats();
            unsubMelodies();
        };
    }, [currentChild]);

    const getAudioCtx = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtxRef.current;
    };

    const playNote = useCallback((noteObj) => {
        try {
            const ctx = getAudioCtx();
            const freq = noteObj.freq * Math.pow(2, octaveShift);

            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

            const osc1 = ctx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(freq, ctx.currentTime);

            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);
            const gain2 = ctx.createGain();
            gain2.gain.setValueAtTime(0.1, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            const osc3 = ctx.createOscillator();
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(freq * 3, ctx.currentTime);
            const gain3 = ctx.createGain();
            gain3.gain.setValueAtTime(0.05, ctx.currentTime);
            gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            osc1.connect(gainNode);
            osc2.connect(gain2).connect(gainNode);
            osc3.connect(gain3).connect(gainNode);
            gainNode.connect(ctx.destination);

            osc1.start(); osc2.start(); osc3.start();
            osc1.stop(ctx.currentTime + 1.5);
            osc2.stop(ctx.currentTime + 0.8);
            osc3.stop(ctx.currentTime + 0.5);
        } catch { /* */ }

        if (isMountedRef.current) {
            setActiveKeys(prev => new Set([...prev, noteObj.note]));
            setLastNote(noteObj.note);
        }

        setTimeout(() => {
            if (isMountedRef.current) {
                setActiveKeys(prev => {
                    const next = new Set(prev);
                    next.delete(noteObj.note);
                    return next;
                });
            }
        }, 200);

        if (isRecording) {
            const elapsed = Date.now() - recordStartRef.current;
            setRecording(prev => [...prev, { note: noteObj.note, freq: noteObj.freq, time: elapsed }]);
        }

        if (currentChild?.childId) {
            recordPianoNote(currentChild.childId);
            if (isMountedRef.current) {
                setStats(prev => ({ ...prev, totalNotes: prev.totalNotes + 1 }));
            }
        }
    }, [octaveShift, isRecording, currentChild]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.repeat) return;
            const pressedKey = e.key.toLowerCase();
            const pressedCode = e.code;
            const noteObj = NOTES.find(n => n.key === pressedKey || KEY_TO_CODE[n.key] === pressedCode);
            if (noteObj) {
                e.preventDefault();
                playNote(noteObj);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playNote, NOTES, KEY_TO_CODE]);

    const handleStartRecording = () => {
        setIsRecording(true);
        setRecording([]);
        recordStartRef.current = Date.now();
    };

    const handleStopRecording = () => {
        setIsRecording(false);
    };

    const handlePlayRecording = async () => {
        if (recording.length === 0 || isPlaying) return;
        setIsPlaying(true);

        for (let i = 0; i < recording.length; i++) {
            if (!isMountedRef.current) break;
            const note = recording[i];
            const noteObj = NOTES.find(n => n.note === note.note);
            if (!noteObj) continue;

            const delay = i === 0 ? 0 : note.time - recording[i - 1].time;
            await new Promise(resolve => setTimeout(resolve, delay));
            if (!isMountedRef.current) break;
            playNote(noteObj);
        }

        if (isMountedRef.current) {
            setIsPlaying(false);
        }
    };

    const handleSaveMelody = () => {
        if (!currentChild?.childId || recording.length === 0) return;
        const saved = saveMelody(currentChild.childId, recording);
        if (saved && isMountedRef.current) {
            setRecording([]); 
        }
    };

    const handleDeleteMelody = (melodyId) => {
        if (!currentChild?.childId) return;
        deleteMelody(currentChild.childId, melodyId);
    };

    const handlePlaySavedMelody = async (melodyNotes) => {
        if (isPlaying) return;
        setIsPlaying(true);
        onMelodiesClose();

        for (let i = 0; i < melodyNotes.length; i++) {
            if (!isMountedRef.current) break;
            const note = melodyNotes[i];
            const noteObj = NOTES.find(n => n.note === note.note);
            if (!noteObj) continue;

            const delay = i === 0 ? 0 : note.time - melodyNotes[i - 1].time;
            await new Promise(resolve => setTimeout(resolve, Math.min(delay, 2000)));
            if (!isMountedRef.current) break;
            playNote(noteObj);
        }

        if (isMountedRef.current) {
            setIsPlaying(false);
        }
    };

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0C0D17]' : 'bg-[#F0F4FF]'}`}>
                <div className={`w-full max-w-[400px] p-8 rounded-[40px] border text-center space-y-6 shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-7xl animate-pulse">🎹</div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'سجل دخولك أولاً' : 'Please Log In'}</h2>
                    <Button radius="full" size="lg" className="w-full bg-indigo-500 text-white font-black" onPress={() => navigate('/child-login')}>
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-amber-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-amber-600/10' : 'bg-amber-400/20'}`} />
                <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDark ? 'bg-orange-600/10' : 'bg-orange-400/20'}`} />
            </div>

            <MainNavbar userType="child" />

            <main className="relative max-w-[900px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
                <PianoHeader isDark={isDark} isArabic={isArabic} totalNotes={stats.totalNotes} />

                <PianoCurrentNote isDark={isDark} isArabic={isArabic} lastNote={lastNote} KEY_COLORS={KEY_COLORS} />

                <div className="flex justify-center gap-2 mb-4">
                    <Button
                        size="sm" radius="full" variant="bordered"
                        className={`font-bold ${isDark ? 'border-white/20' : 'border-amber-200'}`}
                        onPress={() => setOctaveShift(prev => Math.max(prev - 1, -2))}
                    >
                        ⬇️ {isArabic ? 'أخفض' : 'Lower'}
                    </Button>
                    <div className={`px-4 py-1 rounded-full font-black text-sm flex items-center ${isDark ? 'bg-white/10' : 'bg-amber-100'}`}>
                        {isArabic ? 'الأوكتاف' : 'Octave'}: {octaveShift > 0 ? `+${octaveShift}` : octaveShift}
                    </div>
                    <Button
                        size="sm" radius="full" variant="bordered"
                        className={`font-bold ${isDark ? 'border-white/20' : 'border-amber-200'}`}
                        onPress={() => setOctaveShift(prev => Math.min(prev + 1, 2))}
                    >
                        ⬆️ {isArabic ? 'أعلى' : 'Higher'}
                    </Button>
                </div>

                <PianoKeyboard 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    NOTES={NOTES} 
                    KEY_COLORS={KEY_COLORS} 
                    activeKeys={activeKeys} 
                    playNote={playNote} 
                />

                <PianoControls 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    isRecording={isRecording} 
                    recording={recording} 
                    isPlaying={isPlaying} 
                    handleStartRecording={handleStartRecording} 
                    handleStopRecording={handleStopRecording} 
                    handlePlayRecording={handlePlayRecording} 
                    handleSaveMelody={handleSaveMelody} 
                    onMelodiesOpen={onMelodiesOpen} 
                    savedMelodiesCount={savedMelodies.length} 
                />
            </main>

            <PianoMelodiesModal 
                isMelodiesOpen={isMelodiesOpen} 
                onMelodiesClose={onMelodiesClose} 
                isDark={isDark} 
                isArabic={isArabic} 
                savedMelodies={savedMelodies} 
                handleDeleteMelody={handleDeleteMelody} 
                handlePlaySavedMelody={handlePlaySavedMelody} 
                isPlaying={isPlaying} 
            />
        </div>
    );
}
