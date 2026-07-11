import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const GlobalDataContext = createContext(null);

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
                const pecsItems = (await getDocs(collection(db, 'pecs_items'))).docs.map(d => ({ ...d.data(), id: d.id }));
                const pecsMetaDoc = await getDoc(doc(db, 'pecs_config', 'metadata'));
                const pecsMeta = pecsMetaDoc.exists() ? pecsMetaDoc.data() : { categories: [], categoryIcons: {}, categoryLabels: {}, categoryLabelsAr: {} };

                // 2. Routine
                const routineItems = (await getDocs(collection(db, 'routine_data'))).docs.map(d => ({ ...d.data(), id: d.id }));
                const routineMetaDoc = await getDoc(doc(db, 'routine_config', 'metadata'));
                const routineMeta = routineMetaDoc.exists() ? routineMetaDoc.data() : { timeOfDayLabels: {}, timeOfDayLabelsAr: {}, availableIcons: {} };

                // 3. Clinics
                const clinicsData = (await getDocs(collection(db, 'clinics_data'))).docs.map(d => ({ ...d.data(), id: d.id }));
                const clinicsMetaDoc = await getDoc(doc(db, 'clinics_config', 'metadata'));
                const clinicsMeta = clinicsMetaDoc.exists() ? clinicsMetaDoc.data() : { egyptCities: [], serviceLabels: {} };

                // 4. Emotions
                const emotionsData = (await getDocs(collection(db, 'emotions_data'))).docs.map(d => ({ ...d.data(), id: d.id }));

                // 5. KB
                const kbData = (await getDocs(collection(db, 'knowledge_base'))).docs.map(d => d.data());
                const kbMetaDoc = await getDoc(doc(db, 'knowledge_base_config', 'metadata'));
                const kbMeta = kbMetaDoc.exists() ? kbMetaDoc.data() : { defaultResponse: '', searchFallback: '' };

                // 6. Child Bot
                const childBotData = (await getDocs(collection(db, 'child_bot_data'))).docs.map(d => d.data());
                const childBotMetaDoc = await getDoc(doc(db, 'child_bot_config', 'metadata'));
                const childBotMeta = childBotMetaDoc.exists() ? childBotMetaDoc.data() : { childDefaultResponse: '', childFallbackResponse: '' };

                // 7. Profile Data
                const profileDataDoc = await getDoc(doc(db, 'system', 'profileData'));
                const profileData = profileDataDoc.exists() ? profileDataDoc.data() : { sensoryOptions: [], avatarOptions: [] };

                // 8. App Data
                const appDataRef = doc(db, 'system', 'appData');
                const appDataDoc = await getDoc(appDataRef);
                
                let appData = null;
                if (appDataDoc.exists()) {
                    appData = appDataDoc.data();
                } else {
                    const { appDataFallback } = await import('../../data/appDataFallback.js');
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
                        pecs: { items: pecsItems, ...pecsMeta },
                        routine: { defaultRoutine: routineItems, ...routineMeta },
                        clinics: { data: clinicsData, ...clinicsMeta },
                        emotions: { allEmotions: emotionsData },
                        knowledgeBase: { data: kbData, ...kbMeta },
                        childBot: { data: childBotData, ...childBotMeta },
                        profile: profileData,
                        appData: appData,
                        isLoading: false
                    });
                }
            } catch (err) {
                console.error("Failed to fetch global data:", err);
                if (isMounted) {
                    try {
                        const { appDataFallback } = await import('../../data/appDataFallback.js');
                        setGlobalData(prev => ({ ...prev, appData: appDataFallback, isLoading: false }));
                    } catch (fallbackErr) {
                        console.error("Failed to load fallback data:", fallbackErr);
                        setGlobalData(prev => ({ ...prev, isLoading: false }));
                    }
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
