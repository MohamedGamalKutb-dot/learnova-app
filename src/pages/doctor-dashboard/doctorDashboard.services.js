/**
 * doctorDashboard.services.js
 * ─────────────────────────────────────────────────────────
 * Rule 3: Services Layer — ALL Firebase calls for DoctorPage live here.
 */

import {
    doc, getDoc, updateDoc, arrayUnion, query, collection, where, getDocs, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Find a child by their childId code or parent phone number
 */
export async function searchChildByCode(searchQuery) {
    if (!searchQuery) return null;
    // Try exact childId match first
    const snap = await getDoc(doc(db, 'children', searchQuery.toUpperCase()));
    if (snap.exists()) return { ...snap.data(), childId: snap.id };
    // Try phone lookup on parent
    const q = query(collection(db, 'parents'), where('phone', '==', searchQuery));
    const res = await getDocs(q);
    if (!res.empty) {
        const parent = res.docs[0].data();
        if (parent.childrenIds?.length) {
            const childSnap = await getDoc(doc(db, 'children', parent.childrenIds[0]));
            if (childSnap.exists()) return { ...childSnap.data(), childId: childSnap.id };
        }
    }
    return null;
}

/**
 * Add a patient to the doctor's patientIds list
 */
export async function addPatientToDoctor(doctorId, childId) {
    const ref = doc(db, 'doctors', doctorId);
    await updateDoc(ref, {
        patientIds: arrayUnion(childId),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Save an assessment result for a child
 */
export async function saveAssessmentResult(childId, result) {
    const ref = doc(db, 'children', childId);
    await updateDoc(ref, {
        assessments: arrayUnion(result),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Save a behavior log for a child
 */
export async function saveBehaviorLog(childId, log) {
    const ref = doc(db, 'children', childId);
    await updateDoc(ref, {
        behaviorLogs: arrayUnion(log),
        updatedAt: serverTimestamp(),
    });
}
