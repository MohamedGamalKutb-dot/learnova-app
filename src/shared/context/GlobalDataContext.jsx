import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// ── Local data imports (used as fallback when Firebase is unavailable) ──
import { allItems as pecsItems, categories as pecsCategories, categoryIcons, categoryLabels, categoryLabelsAr } from '../../data/pecsData';
import { defaultRoutine, timeOfDayLabels, timeOfDayLabelsAr, availableIcons } from '../../data/routineData';
import { clinicsData, egyptCities, serviceLabels } from '../../data/clinicsData';
import { allEmotions } from '../../data/emotionData';
import { autismKnowledgeBase } from '../../data/autismKnowledgeBase';
import { childBotData } from '../../data/childBotData';
import { getProfileData } from '../../data/profileData';
import { appDataFallback } from '../../data/appDataFallback';

const GlobalDataContext = createContext(null);

function buildLocalFallback() {
    const profileData = getProfileData(false);
    return {
        pecs: { items: pecsItems, categories: pecsCategories, categoryIcons, categoryLabels, categoryLabelsAr },
        routine: { defaultRoutine, timeOfDayLabels, timeOfDayLabelsAr, availableIcons },
        clinics: { data: clinicsData, egyptCities, serviceLabels },
        emotions: { allEmotions },
        knowledgeBase: { data: autismKnowledgeBase, defaultResponse: 'I can help you with autism-related questions.', searchFallback: 'Could you rephrase that?' },
        childBot: { data: childBotData, childDefaultResponse: 'I am your friend! How can I help?', childFallbackResponse: 'Can you say that again?' },
        profile: profileData,
        appData: appDataFallback,
        isLoading: false,
    };
}

export function GlobalDataProvider({ children }) {
    const [globalData, setGlobalData] = useState({
        pecs: { items: [], categories: [], categoryIcons: {}, categoryLabels: {}, categoryLabelsAr: {} },
        routine: { defaultRoutine: [], timeOfDayLabels: {}, timeOfDayLabelsAr: {}, availableIcons: {} },
        clinics: { data: [], egyptCities: [], serviceLabels: {} },
        emotions: { allEmotions: [] },
        knowledgeBase: { data: [], defaultResponse: '', searchFallback: '' },
        childBot: { data: [], childDefaultResponse: '', childFallbackResponse: '' },
        profile: { sensoryOptions: [], avatarOptions: [] },
        appData: null,
        isLoading: true
    });

    useEffect(() => {
        let isMounted = true;
        async function loadAllData() {
            try {
                // 1. PECS
                const pecsItemsDb = (await getDocs(collection(db, 'pecs_items'))).docs.map(d => ({ ...d.data(), id: d.id }));
                const pecsMetaDoc = await getDoc(doc(db, 'pecs_config', 'metadata'));
                const pecsMeta = pecsMetaDoc.exists() ? pecsMetaDoc.data() : { categories: [], categoryIcons: {}, categoryLabels: {}, categoryLabelsAr: {} };

                // 2. Routine
                const routineItems = (await getDocs(collection(db, 'routine_data'))).docs.map(d => ({ ...d.data(), id: d.id }));
                const routineMetaDoc = await getDoc(doc(db, 'routine_config', 'metadata'));
                const routineMeta = routineMetaDoc.exists() ? routineMetaDoc.data() : { timeOfDayLabels: {}, timeOfDayLabelsAr: {}, availableIcons: {} };

                // 3. Clinics
                const clinicsDataDb = (await getDocs(collection(db, 'clinics_data'))).docs.map(d => ({ ...d.data(), id: d.id }));
                const clinicsMetaDoc = await getDoc(doc(db, 'clinics_config', 'metadata'));
                const clinicsMeta = clinicsMetaDoc.exists() ? clinicsMetaDoc.data() : { egyptCities: [], serviceLabels: {} };

                // 4. Emotions
                const emotionsData = (await getDocs(collection(db, 'emotions_data'))).docs.map(d => ({ ...d.data(), id: d.id }));

                // 5. KB
                const kbData = (await getDocs(collection(db, 'knowledge_base'))).docs.map(d => d.data());
                const kbMetaDoc = await getDoc(doc(db, 'knowledge_base_config', 'metadata'));
                const kbMeta = kbMetaDoc.exists() ? kbMetaDoc.data() : { defaultResponse: '', searchFallback: '' };

                // 6. Child Bot
                const childBotDataDb = (await getDocs(collection(db, 'child_bot_data'))).docs.map(d => d.data());
                const childBotMetaDoc = await getDoc(doc(db, 'child_bot_config', 'metadata'));
                const childBotMeta = childBotMetaDoc.exists() ? childBotMetaDoc.data() : { childDefaultResponse: '', childFallbackResponse: '' };

                // 7. Profile Data
                const profileDataDoc = await getDoc(doc(db, 'system', 'profileData'));
                const profileDataDb = profileDataDoc.exists() ? profileDataDoc.data() : { sensoryOptions: [], avatarOptions: [] };

                // 8. App Data
                const appDataRef = doc(db, 'system', 'appData');
                const appDataDoc = await getDoc(appDataRef);
                
                let appData = null;
                if (appDataDoc.exists()) {
                    appData = appDataDoc.data();
                } else {
                    appData = appDataFallback;
                }

                // AUTO FIX HERO CARDS ICONS IN FIREBASE
                if (appData && appData.ar && appData.ar.landingData && appData.ar.landingData.heroCards) {
                    let needsUpdate = false;
                    appData.ar.landingData.heroCards.forEach(c => {
                        if (c.icon && c.icon.includes('upload')) {
                            if (c.t && c.t.includes('طبيب')) c.icon = '/icons/doctor_icon.png';
                            else if (c.t && c.t.includes('ولي')) c.icon = '/icons/parent_icon.png';
                            else if (c.t && c.t.includes('طفل')) c.icon = '/icons/child.png';
                            needsUpdate = true;
                        }
                    });
                    if (appData.en && appData.en.landingData && appData.en.landingData.heroCards) {
                        appData.en.landingData.heroCards.forEach(c => {
                            if (c.icon && c.icon.includes('upload')) {
                                if (c.t && c.t.includes('Doctor')) c.icon = '/icons/doctor_icon.png';
                                else if (c.t && c.t.includes('Parent')) c.icon = '/icons/parent_icon.png';
                                else if (c.t && c.t.includes('Child')) c.icon = '/icons/child.png';
                                needsUpdate = true;
                            }
                        });
                    }
                    if (needsUpdate) {
                        try {
                            await updateDoc(appDataRef, { 
                                'ar.landingData.heroCards': appData.ar.landingData.heroCards,
                                'en.landingData.heroCards': appData.en.landingData.heroCards
                            });
                            console.log('Fixed broken upload icons in Firebase!');
                        } catch (e) { console.error(e); }
                    }
                }

                if (isMounted) {
                    setGlobalData({
                        pecs: { items: pecsItemsDb, ...pecsMeta },
                        routine: { defaultRoutine: routineItems, ...routineMeta },
                        clinics: { data: clinicsDataDb, ...clinicsMeta },
                        emotions: { allEmotions: emotionsData },
                        knowledgeBase: { data: kbData, ...kbMeta },
                        childBot: { data: childBotDataDb, ...childBotMeta },
                        profile: profileDataDb,
                        appData: appData,
                        isLoading: false
                    });
                }
            } catch (err) {
                console.error("Firebase unavailable, loading local data:", err);
                if (isMounted) {
                    setGlobalData(buildLocalFallback());
                }
            }
        }
        loadAllData();
        return () => { isMounted = false; };
    }, []);

    return (
        <GlobalDataContext.Provider value={globalData}>
            {children}
        </GlobalDataContext.Provider>
    );
}

export function useGlobalData() {
    const ctx = useContext(GlobalDataContext);
    if (!ctx) throw new Error('useGlobalData must be used within GlobalDataProvider');
    return ctx;
}
