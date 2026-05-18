/**
 * parent-dashboard.services.js
 * ─────────────────────────────────────────────────────────
 * Rule 3: Services Layer — ALL Firebase/Firestore calls live here.
 * NO direct Firebase imports allowed in DashboardPage.jsx or its _components.
 * Components call these functions instead.
 */

import {
    doc, getDoc, updateDoc, arrayUnion, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Fetch a single child document by childId
 */
export async function fetchChildById(childId) {
    if (!childId) return null;
    const ref = doc(db, 'children', childId);
    const snap = await getDoc(ref);
    return snap.exists() ? { ...snap.data(), childId: snap.id } : null;
}

/**
 * Link a child account to a parent by updating the parent's childrenIds array
 */
export async function linkChildToParent(parentId, childId) {
    const ref = doc(db, 'parents', parentId);
    await updateDoc(ref, {
        childrenIds: arrayUnion(childId),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update child's emotion stats for a given date
 */
export async function updateEmotionStats(childId, dateKey, correct, total) {
    const ref = doc(db, 'children', childId);
    await updateDoc(ref, {
        [`emotionHistory.${dateKey}.correct`]: correct,
        [`emotionHistory.${dateKey}.total`]: total,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update child's routine completion for a given date
 */
export async function saveRoutineCompletion(childId, dateKey, statusMap) {
    const ref = doc(db, 'children', childId);
    await updateDoc(ref, {
        [`routineHistory.${dateKey}`]: statusMap,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update child's diagnosis & treatment fields (doctor managed)
 */
export async function updateChildDiagnosis(childId, updates) {
    const ref = doc(db, 'children', childId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
}
