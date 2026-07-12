/**
 * Games Services Layer
 * ---------------------
 * Handles all game stats persistence (localStorage + Firestore sync).
 * Follows the project's architecture: NO direct Firebase calls from components.
 */
import { 
    doc, 
    updateDoc, 
    getDoc, 
    setDoc, 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';


const GAMES_STORAGE_KEY = 'learnova_games_';
const DRAWINGS_KEY = 'learnova_drawings_';
const MELODIES_KEY = 'learnova_melodies_';

import { 
    pianoConfig as fallbackPiano, 
    drawingConfig as fallbackDrawing, 
    puzzleConfig as fallbackPuzzle, 
    wordGameConfig as fallbackWordGame, 
    wordsEnConfig as fallbackWordsEn, 
    wordsArConfig as fallbackWordsAr 
} from '../../data/gamesFallbackData';

// ============ FIREBASE GETTERS ============

export async function getWordsConfig(isArabic) {
    try {
        const docRef = doc(db, 'game_config', isArabic ? 'words_ar' : 'words_en');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data();
        }
    } catch (err) {
        console.warn(`Error fetching words config (${isArabic ? 'ar' : 'en'}) from Firestore, using local fallback:`, err);
    }
    return isArabic ? fallbackWordsAr : fallbackWordsEn;
}

export async function getPianoConfig() {
    try {
        const pianoRef = doc(db, 'game_config', 'piano');
        const snap = await getDoc(pianoRef);
        if (snap.exists()) return snap.data();
    } catch (err) { 
        console.warn('Error fetching piano config from Firestore, using local fallback:', err); 
    }
    return fallbackPiano;
}

export async function getDrawingConfig() {
    try {
        const snap = await getDoc(doc(db, 'game_config', 'drawing'));
        if (snap.exists()) return snap.data();
    } catch (err) { 
        console.warn('Error fetching drawing config from Firestore, using local fallback:', err); 
    }
    return fallbackDrawing;
}

export async function getPuzzleConfig() {
    try {
        const snap = await getDoc(doc(db, 'game_config', 'puzzle'));
        if (snap.exists()) return snap.data();
    } catch (err) { 
        console.warn('Error fetching puzzle config from Firestore, using local fallback:', err); 
    }
    return fallbackPuzzle;
}

export async function getWordGameConfig() {
    try {
        const snap = await getDoc(doc(db, 'game_config', 'word_game'));
        if (snap.exists()) return snap.data();
    } catch (err) { 
        console.warn('Error fetching word game config from Firestore, using local fallback:', err); 
    }
    return fallbackWordGame;
}

// ============ LOCAL STORAGE HELPERS ============

function loadGameStats(childId) {
    if (!childId) return getDefaultGameStats();
    try {
        const saved = localStorage.getItem(GAMES_STORAGE_KEY + childId);
        if (saved) return { ...getDefaultGameStats(), ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return getDefaultGameStats();
}

function saveGameStats(childId, stats) {
    if (!childId) return;
    try {
        localStorage.setItem(GAMES_STORAGE_KEY + childId, JSON.stringify(stats));
    } catch { /* ignore */ }
}

function getDefaultGameStats() {
    return {
        // Puzzle Game
        puzzleCompleted: 0,
        puzzleAttempts: 0,
        puzzleScore: 0,
        puzzleBestTime: null,
        puzzleLastPlayed: null,

        // Word Game
        wordCorrect: 0,
        wordWrong: 0,
        wordScore: 0,
        wordStreak: 0,
        wordBestStreak: 0,
        wordLastPlayed: null,

        // Drawing
        drawingSaved: 0,
        drawingLastSaved: null,

        // Piano
        pianoMelodiesSaved: 0,
        pianoTotalNotes: 0,
        pianoLastPlayed: null,

        // General
        totalGamePoints: 0,
        dailyPlayTime: {},      // { '2026-06-16': minutesPlayed }
        lastActivity: null,
    };
}

// ============ PUBLIC API ============

export function getGameStats(childId) {
    return loadGameStats(childId);
}

export function updateGameStats(childId, updater) {
    if (!childId) return null;
    const current = loadGameStats(childId);
    const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    updated.lastActivity = new Date().toISOString();
    saveGameStats(childId, updated);

    // Sync to Firestore (fire-and-forget, with setDoc to create child doc if missing)
    try {
        const childRef = doc(db, 'children', childId);
        setDoc(childRef, {
            gameStats: updated,
            updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => console.warn('Firestore game stats sync error:', err));
    } catch (err) {
        console.warn('Firestore doc/updateDoc sync error:', err);
    }

    return updated;
}

// ============ REAL-TIME SUBSCRIPTIONS ============

export function subscribeToGameStats(childId, callback) {
    if (!childId) return () => {};
    try {
        const childRef = doc(db, 'children', childId);
        return onSnapshot(childRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data && data.gameStats) {
                    saveGameStats(childId, data.gameStats);
                    callback(data.gameStats);
                } else {
                    callback(getGameStats(childId));
                }
            } else {
                callback(getGameStats(childId));
            }
        }, (err) => {
            console.warn('Firestore gameStats subscription error:', err);
            callback(getGameStats(childId));
        });
    } catch (err) {
        console.warn('Error setting up firestore subscription:', err);
        return () => {};
    }
}

export function subscribeToDrawings(childId, callback) {
    if (!childId) return () => {};
    try {
        const drawingsColRef = collection(db, 'children', childId, 'drawings');
        const q = query(drawingsColRef, orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach(docSnap => {
                list.push({ ...docSnap.data(), id: docSnap.id });
            });
            localStorage.setItem(DRAWINGS_KEY + childId, JSON.stringify(list));
            callback(list);
        }, (err) => {
            console.warn('Firestore drawings subscription error:', err);
            callback(getDrawings(childId));
        });
    } catch (err) {
        console.warn('Error setting up firestore drawings subscription:', err);
        return () => {};
    }
}

export function subscribeToMelodies(childId, callback) {
    if (!childId) return () => {};
    try {
        const melodiesColRef = collection(db, 'children', childId, 'melodies');
        const q = query(melodiesColRef, orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach(docSnap => {
                list.push({ ...docSnap.data(), id: docSnap.id });
            });
            localStorage.setItem(MELODIES_KEY + childId, JSON.stringify(list));
            callback(list);
        }, (err) => {
            console.warn('Firestore melodies subscription error:', err);
            callback(getMelodies(childId));
        });
    } catch (err) {
        console.warn('Error setting up firestore melodies subscription:', err);
        return () => {};
    }
}

// ============ LOCAL TO FIREBASE AUTO SYNC ============

export async function syncLocalDataToFirebase(childId) {
    if (!childId) return;
    try {
        // 1. Sync Stats
        const localStats = loadGameStats(childId);
        const childRef = doc(db, 'children', childId);
        const childSnap = await getDoc(childRef);

        let mergedStats = { ...localStats };
        if (childSnap.exists()) {
            const remoteData = childSnap.data();
            if (remoteData && remoteData.gameStats) {
                const remoteStats = remoteData.gameStats;
                mergedStats = {
                    puzzleCompleted: Math.max(localStats.puzzleCompleted || 0, remoteStats.puzzleCompleted || 0),
                    puzzleAttempts: Math.max(localStats.puzzleAttempts || 0, remoteStats.puzzleAttempts || 0),
                    puzzleScore: Math.max(localStats.puzzleScore || 0, remoteStats.puzzleScore || 0),
                    puzzleBestTime: (localStats.puzzleBestTime && remoteStats.puzzleBestTime)
                        ? Math.min(localStats.puzzleBestTime, remoteStats.puzzleBestTime)
                        : (localStats.puzzleBestTime || remoteStats.puzzleBestTime || null),
                    puzzleLastPlayed: localStats.puzzleLastPlayed || remoteStats.puzzleLastPlayed || null,

                    wordCorrect: Math.max(localStats.wordCorrect || 0, remoteStats.wordCorrect || 0),
                    wordWrong: Math.max(localStats.wordWrong || 0, remoteStats.wordWrong || 0),
                    wordScore: Math.max(localStats.wordScore || 0, remoteStats.wordScore || 0),
                    wordStreak: Math.max(localStats.wordStreak || 0, remoteStats.wordStreak || 0),
                    wordBestStreak: Math.max(localStats.wordBestStreak || 0, remoteStats.wordBestStreak || 0),
                    wordLastPlayed: localStats.wordLastPlayed || remoteStats.wordLastPlayed || null,

                    drawingSaved: Math.max(localStats.drawingSaved || 0, remoteStats.drawingSaved || 0),
                    drawingLastSaved: localStats.drawingLastSaved || remoteStats.drawingLastSaved || null,

                    pianoMelodiesSaved: Math.max(localStats.pianoMelodiesSaved || 0, remoteStats.pianoMelodiesSaved || 0),
                    pianoTotalNotes: Math.max(localStats.pianoTotalNotes || 0, remoteStats.pianoTotalNotes || 0),
                    pianoLastPlayed: localStats.pianoLastPlayed || remoteStats.pianoLastPlayed || null,

                    totalGamePoints: Math.max(localStats.totalGamePoints || 0, remoteStats.totalGamePoints || 0),
                    dailyPlayTime: { ...(remoteStats.dailyPlayTime || {}), ...(localStats.dailyPlayTime || {}) },
                    lastActivity: new Date().toISOString()
                };
            }
        }

        saveGameStats(childId, mergedStats);
        await setDoc(childRef, {
            gameStats: mergedStats,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        // 2. Sync Drawings
        const localDrawings = getDrawings(childId);
        for (const drawing of localDrawings) {
            const drawingRef = doc(db, 'children', childId, 'drawings', drawing.id);
            await setDoc(drawingRef, drawing, { merge: true });
        }

        // 3. Sync Melodies
        const localMelodies = getMelodies(childId);
        for (const melody of localMelodies) {
            const melodyRef = doc(db, 'children', childId, 'melodies', melody.id);
            await setDoc(melodyRef, melody, { merge: true });
        }

        console.log(`Successfully synced local game data to Firestore for child: ${childId}`);
    } catch (err) {
        console.error('Error syncing local data to Firebase:', err);
    }
}

// ============ PUZZLE SPECIFIC ============

export function recordPuzzleComplete(childId, completionTimeSec) {
    return updateGameStats(childId, prev => {
        const bestTime = prev.puzzleBestTime
            ? Math.min(prev.puzzleBestTime, completionTimeSec)
            : completionTimeSec;
        return {
            ...prev,
            puzzleCompleted: prev.puzzleCompleted + 1,
            puzzleAttempts: prev.puzzleAttempts + 1,
            puzzleScore: prev.puzzleScore + 1,
            puzzleBestTime: bestTime,
            puzzleLastPlayed: new Date().toISOString(),
            totalGamePoints: prev.totalGamePoints + 1,
        };
    });
}

// ============ WORD GAME SPECIFIC ============

export function recordWordAnswer(childId, isCorrect) {
    return updateGameStats(childId, prev => {
        const newStreak = isCorrect ? prev.wordStreak + 1 : 0;
        return {
            ...prev,
            wordCorrect: prev.wordCorrect + (isCorrect ? 1 : 0),
            wordWrong: prev.wordWrong + (isCorrect ? 0 : 1),
            wordScore: prev.wordScore + (isCorrect ? 1 : 0),
            wordStreak: newStreak,
            wordBestStreak: Math.max(prev.wordBestStreak, newStreak),
            wordLastPlayed: new Date().toISOString(),
            totalGamePoints: prev.totalGamePoints + (isCorrect ? 1 : 0),
        };
    });
}

// ============ DRAWING SPECIFIC ============

export function recordDrawingSave(childId) {
    return updateGameStats(childId, prev => ({
        ...prev,
        drawingSaved: prev.drawingSaved + 1,
        drawingLastSaved: new Date().toISOString(),
    }));
}

export function saveDrawing(childId, drawingData) {
    if (!childId) return;
    try {
        const key = DRAWINGS_KEY + childId;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const drawingId = `d-${Date.now()}`;
        const newDrawing = {
            id: drawingId,
            data: drawingData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        existing.unshift(newDrawing);
        if (existing.length > 50) existing.pop();
        localStorage.setItem(key, JSON.stringify(existing));
        recordDrawingSave(childId);

        // Sync to Firestore drawings subcollection
        const drawingRef = doc(db, 'children', childId, 'drawings', drawingId);
        setDoc(drawingRef, newDrawing).catch(err => console.warn('Firestore save drawing error:', err));

        return newDrawing;
    } catch { return null; }
}

export function updateDrawing(childId, drawingId, drawingData) {
    if (!childId) return;
    try {
        const key = DRAWINGS_KEY + childId;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.map(d =>
            d.id === drawingId ? { ...d, data: drawingData, updatedAt: new Date().toISOString() } : d
        );
        localStorage.setItem(key, JSON.stringify(updated));

        // Sync to Firestore drawings subcollection
        const drawingRef = doc(db, 'children', childId, 'drawings', drawingId);
        updateDoc(drawingRef, {
            data: drawingData,
            updatedAt: new Date().toISOString()
        }).catch(err => console.warn('Firestore update drawing error:', err));

        return updated.find(d => d.id === drawingId);
    } catch { return null; }
}

export function getDrawings(childId) {
    if (!childId) return [];
    try {
        return JSON.parse(localStorage.getItem(DRAWINGS_KEY + childId) || '[]');
    } catch { return []; }
}

export function deleteDrawing(childId, drawingId) {
    if (!childId) return;
    try {
        const key = DRAWINGS_KEY + childId;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify(existing.filter(d => d.id !== drawingId)));

        // Sync to Firestore drawings subcollection
        const drawingRef = doc(db, 'children', childId, 'drawings', drawingId);
        deleteDoc(drawingRef).catch(err => console.warn('Firestore delete drawing error:', err));
    } catch { /* ignore */ }
}

// ============ PIANO SPECIFIC ============

export function recordPianoNote(childId) {
    return updateGameStats(childId, prev => ({
        ...prev,
        pianoTotalNotes: prev.pianoTotalNotes + 1,
        pianoLastPlayed: new Date().toISOString(),
    }));
}

export function saveMelody(childId, melodyData) {
    if (!childId) return null;
    try {
        const key = MELODIES_KEY + childId;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const melodyId = `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const melody = {
            id: melodyId,
            notes: [...melodyData],
            createdAt: new Date().toISOString(),
        };
        existing.unshift(melody);
        localStorage.setItem(key, JSON.stringify(existing));
        updateGameStats(childId, prev => ({
            ...prev,
            pianoMelodiesSaved: prev.pianoMelodiesSaved + 1,
        }));

        // Sync to Firestore melodies subcollection
        const melodyRef = doc(db, 'children', childId, 'melodies', melodyId);
        setDoc(melodyRef, melody).catch(err => console.warn('Firestore save melody error:', err));

        return melody;
    } catch { return null; }
}

export function getMelodies(childId) {
    if (!childId) return [];
    try {
        return JSON.parse(localStorage.getItem(MELODIES_KEY + childId) || '[]');
    } catch { return []; }
}

export function deleteMelody(childId, melodyId) {
    if (!childId) return;
    try {
        const key = MELODIES_KEY + childId;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify(existing.filter(m => m.id !== melodyId)));
        updateGameStats(childId, prev => ({
            ...prev,
            pianoMelodiesSaved: Math.max(0, prev.pianoMelodiesSaved - 1),
        }));

        // Sync to Firestore melodies subcollection
        const melodyRef = doc(db, 'children', childId, 'melodies', melodyId);
        deleteDoc(melodyRef).catch(err => console.warn('Firestore delete melody error:', err));
    } catch { /* ignore */ }
}

