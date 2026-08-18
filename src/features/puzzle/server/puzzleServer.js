import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../shared/firebase/config';

const GAMES_STORAGE_KEY = 'learnova_games_';

function getDefaultGameStats() {
    return {
        puzzleCompleted: 0,
        puzzleAttempts: 0,
        puzzleScore: 0,
        puzzleBestTime: null,
        puzzleLastPlayed: null,
    };
}

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

export { getPuzzleConfig } from '../../../shared/services/gamesService';

export function getPuzzleStats(childId) {
    if (!childId) return getDefaultGameStats();
    return loadGameStats(childId);
}

export function recordPuzzleComplete(childId, elapsedSec) {
    if (!childId) return null;
    const stats = loadGameStats(childId);
    
    stats.puzzleCompleted += 1;
    stats.puzzleAttempts += 1;
    stats.puzzleScore += 1; // 1 point per puzzle
    stats.puzzleLastPlayed = new Date().toISOString();
    
    if (!stats.puzzleBestTime || elapsedSec < stats.puzzleBestTime) {
        stats.puzzleBestTime = elapsedSec;
    }

    saveGameStats(childId, stats);

    // Sync to Firestore without awaiting
    const userDocRef = doc(db, 'users', childId);
    updateDoc(userDocRef, {
        gameStats: stats,
        lastActive: new Date().toISOString()
    }).catch(err => {
        if (err.code === 'not-found') {
            setDoc(userDocRef, { gameStats: stats, lastActive: new Date().toISOString() }, { merge: true }).catch(() => {});
        }
    });

    return stats;
}
