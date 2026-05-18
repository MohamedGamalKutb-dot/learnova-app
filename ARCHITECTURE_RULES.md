# 📐 Learnova App — Architecture Rules & Conventions
> **Stack:** Vite + React + React Router v7 + Firebase + TailwindCSS v4
> **الغرض:** قراءة هذا الملف قبل إنشاء أي صفحة أو مكوّن جديد.

---

## 🗂️ الهيكل الحالي للمشروع

```
learnova_app/
├── src/
│   ├── App.jsx                  ← Router رئيسي (React Router v7)
│   ├── main.jsx
│   ├── index.css
│   ├── api/
│   │   └── geminiAI.js          ← Gemini AI wrapper
│   ├── assets/
│   ├── components/              ← مكونات مشتركة (بين أكثر من صفحة)
│   │   ├── AutismSupportBot.jsx
│   │   ├── ClinicsMap.jsx
│   │   ├── GoogleAuthButton.jsx
│   │   ├── GuestRoute.jsx
│   │   ├── MainNavbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SharedAuthForm.jsx
│   │   ├── dashboard/           ⚠️ يجب نقلها لـ _components داخل الصفحة
│   │   └── doctor/              ⚠️ يجب نقلها لـ _components داخل الصفحة
│   ├── context/
│   │   ├── AppContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── data/                    ← Static/mock data
│   ├── pages/                   ← صفحات التطبيق (كل صفحة ملف واحد حالياً ⚠️)
│   └── utils/
└── ...
```

---

## 📋 القواعد (Rules) — مُكيَّفة لـ Vite + React

---

### ✅ Rule 1 — Page Folder Structure

كل صفحة في **مجلد خاص بها** يحتوي على **3 ملفات أساسية**:

```
src/pages/pagename/
├── PageName.jsx              ← مكوّن الصفحة — يُكوِّن فقط من Components
├── pagename.services.js      ← كل calls لـ Firebase / API
├── pagename.constants.js     ← ثوابت الصفحة، data shapes، labels (اختياري)
└── _components/              ← مكونات خاصة بهذه الصفحة فقط
    ├── HeroSection/
    │   └── HeroSection.jsx
    └── StatsGrid/
        └── StatsGrid.jsx
```

#### شرح كل ملف:

| الملف | المسؤولية |
|-------|-----------|
| `PageName.jsx` | يُكوِّن فقط — لا logic فيه إلا الـ routing وتجميع المكونات |
| `pagename.services.js` | **كل** calls لـ Firebase (get, add, update, delete) — لا Firebase في Components |
| `pagename.constants.js` | ثوابت، بيانات ثابتة، labels بالعربي/الإنجليزي الخاصة بالصفحة *(اختياري إذا كانت في `data/`)* |
| `_components/` | مكونات تُستخدم **فقط** في هذه الصفحة — لا تُضاف لـ `src/components/` |

#### لماذا `_components/` وليس `components/`؟
- `_` بالبداية = اصطلاح واضح "هذا مجلد داخلي مش shared"
- يمنع الفوضى: `src/components/` بس للمكونات الـ **مشتركة فعلاً** بين أكثر من صفحة
- سهولة الحذف: لو حذفت الصفحة، تحذف مجلدها بالكامل بدون خوف

---

### ✅ Rule 2 — Shared Component Structure

كل مكوّن **مشترك** في مجلد PascalCase يحتوي على ملف واحد:

```
src/components/
└── MainNavbar/
    └── MainNavbar.jsx        ← ملف واحد فقط
```

**القواعد:**
- ✅ اسم المجلد = اسم المكوّن بـ PascalCase
- ✅ داخل المجلد: **ملف واحد فقط** (أو ملفان لو Rule 4 مطبّقة)
- ❌ لا تضع أكثر من مكوّن منفصل في نفس الملف
- ❌ لا تضع في `src/components/` مكوّناً يُستخدم في صفحة واحدة فقط

**اختبار سريع:** هل المكوّن ده بيتستخدم في أكثر من صفحة؟
- **نعم** → `src/components/ComponentName/ComponentName.jsx`
- **لا** → `src/pages/pagename/_components/ComponentName/ComponentName.jsx`

---

### ✅ Rule 3 — Services Layer (بديل `action.ts` في Vite)

> في Next.js كان في `pagename.action.ts` بـ `"use server"`.
> في Vite + React، البديل هو **services layer** صريح.

```js
// src/pages/parent-dashboard/parentDashboard.services.js

import { db } from '../../firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

// ✅ كل Firebase calls هنا — مش في الـ Component أو الـ Context
export async function getChildData(childId) {
  const snap = await getDoc(doc(db, 'children', childId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addDailyNote(childId, note) {
  return await addDoc(collection(db, 'children', childId, 'notes'), {
    text: note,
    createdAt: new Date(),
  });
}

export async function linkChildToParent(parentId, childCode) {
  // validation + Firestore update
}
```

**القاعدة:** لا يوجد `firebase/firestore` import مباشر في أي Component أو Context — **كل شيء عبر services**.

---

### ✅ Rule 4 — Logic Separation

في أي Component معقد (state + handlers + effects)، **افصل UI عن Logic**:

```
ComponentName/
├── ComponentName.jsx         ← JSX فقط — لا useState ولا useEffect هنا
└── ComponentName.logic.jsx   ← Custom Hook يرجع كل اللي يحتاجه الـ JSX
```

**المثال:**

```jsx
// ClinicalOverviewTab.logic.jsx
import { useState, useEffect } from 'react';
import { getAssessments } from '../../parentDashboard.services';

export function useClinicalOverview({ childId, isArabic }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    getAssessments(childId).then(data => {
      setAssessments(data);
      setLoading(false);
    });
  }, [childId]);

  return { assessments, loading, activeTab, setActiveTab };
}
```

```jsx
// ClinicalOverviewTab.jsx
import { useClinicalOverview } from './ClinicalOverviewTab.logic';

export default function ClinicalOverviewTab({ childId, isArabic, isDark }) {
  const { assessments, loading, activeTab, setActiveTab } = useClinicalOverview({ childId, isArabic });

  if (loading) return <Spinner />;

  return (
    <div>
      {/* JSX فقط — نظيف وقابل للقراءة */}
    </div>
  );
}
```

**متى تطبق Rule 4؟**
- ✅ المكوّن فيه أكثر من 2 `useState`
- ✅ المكوّن فيه `useEffect` يجلب بيانات
- ✅ المكوّن فيه handlers معقدة (submit, validation, etc.)
- ❌ لا تطبقها على مكوّنات بسيطة (عرض فقط)

---

### ✅ Rule 5 — Extract-to-Component

`PageName.jsx` يجب أن **يُكوِّن فقط** — لا JSX ضخم مضمّن.

**القاعدة:** أي UI block > **5-6 أسطر JSX** → مكوّن مستقل.

```jsx
// ❌ خطأ — LandingPage.jsx بـ 327 سطر inline
export default function LandingPage() {
  return (
    <div>
      {/* 50 سطر Hero */}
      {/* 40 سطر Login cards */}
      {/* 60 سطر About section */}
      {/* ... */}
    </div>
  );
}

// ✅ صح — LandingPage.jsx نظيف
export default function LandingPage() {
  return (
    <div>
      <LandingNavbar />
      <HeroSection />
      <LoginSection />
      <AboutAutismSection />
      <TipsSection />
      <ToolsSection />
      <CTABanner />
      <LandingFooter />
    </div>
  );
}
```

---

## 🎯 الهيكل المستهدف (Target Structure)

```
src/
├── pages/
│   ├── landing/
│   │   ├── LandingPage.jsx
│   │   ├── landing.services.js        ← (فارغ أو غير موجود — صفحة static)
│   │   └── _components/
│   │       ├── LandingNavbar/
│   │       │   └── LandingNavbar.jsx
│   │       ├── HeroSection/
│   │       │   └── HeroSection.jsx
│   │       ├── LoginSection/
│   │       │   └── LoginSection.jsx
│   │       ├── AboutAutismSection/
│   │       │   └── AboutAutismSection.jsx
│   │       ├── TipsSection/
│   │       │   └── TipsSection.jsx
│   │       ├── ToolsSection/
│   │       │   └── ToolsSection.jsx
│   │       ├── CTABanner/
│   │       │   └── CTABanner.jsx
│   │       └── LandingFooter/
│   │           └── LandingFooter.jsx
│   │
│   ├── parent-dashboard/
│   │   ├── DashboardPage.jsx
│   │   ├── parentDashboard.services.js   ← Firebase: getChild, addNote, linkChild...
│   │   └── _components/
│   │       ├── DashboardSidebar/
│   │       │   ├── DashboardSidebar.jsx
│   │       │   └── DashboardSidebar.logic.jsx   ← Rule 4 (navigation state)
│   │       ├── LinkChildModal/
│   │       │   ├── LinkChildModal.jsx
│   │       │   └── LinkChildModal.logic.jsx     ← Rule 4 (form state + handler)
│   │       ├── SectionTitle/
│   │       │   └── SectionTitle.jsx             ← مكوّن بسيط، لا .logic
│   │       ├── SanctuaryJournalTab/
│   │       │   └── SanctuaryJournalTab.jsx
│   │       ├── ModuleFocusTab/
│   │       │   └── ModuleFocusTab.jsx
│   │       ├── ClinicalOverviewTab/
│   │       │   ├── ClinicalOverviewTab.jsx
│   │       │   └── ClinicalOverviewTab.logic.jsx  ← Rule 4 (assessments, tabs)
│   │       ├── AssistantAuraTab/
│   │       │   └── AssistantAuraTab.jsx
│   │       └── SupportCirclesTab/
│   │           └── SupportCirclesTab.jsx
│   │
│   ├── doctor-dashboard/
│   │   ├── DoctorPage.jsx
│   │   ├── doctorDashboard.services.js   ← Firebase: getPatients, addAssessment...
│   │   └── _components/
│   │       ├── DoctorSidebar/
│   │       │   └── DoctorSidebar.jsx
│   │       ├── PatientsTab/
│   │       │   ├── PatientsTab.jsx
│   │       │   └── PatientsTab.logic.jsx      ← Rule 4 (search, filter)
│   │       ├── AssessmentTab/
│   │       │   ├── AssessmentTab.jsx
│   │       │   └── AssessmentTab.logic.jsx    ← Rule 4 (form state)
│   │       ├── BehaviorTab/
│   │       │   └── BehaviorTab.jsx
│   │       └── ReportsTab/
│   │           └── ReportsTab.jsx
│   │
│   ├── child-home/
│   │   ├── ChildHomePage.jsx
│   │   └── _components/
│   │       └── ActivityCard/
│   │           └── ActivityCard.jsx
│   │
│   ├── emotions/
│   │   ├── EmotionsPage.jsx
│   │   ├── emotions.services.js          ← Firebase: saveEmotionResult...
│   │   └── _components/
│   │       ├── EmotionCard/
│   │       │   └── EmotionCard.jsx
│   │       └── ResultOverlay/
│   │           └── ResultOverlay.jsx
│   │
│   ├── routine/
│   │   ├── RoutinePage.jsx
│   │   ├── routine.services.js
│   │   └── _components/
│   │       └── TaskCard/
│   │           └── TaskCard.jsx
│   │
│   ├── pecs/
│   │   ├── PecsPage.jsx
│   │   └── pecs.services.js
│   │
│   ├── calming/
│   │   └── CalmingPage.jsx
│   │
│   ├── profile/
│   │   ├── ProfilePage.jsx
│   │   ├── profile.services.js
│   │   └── _components/
│   │       └── AvatarPicker/
│   │           ├── AvatarPicker.jsx
│   │           └── AvatarPicker.logic.jsx
│   │
│   ├── auth/                             ← كل صفحات الـ Login/Signup
│   │   ├── child-login/
│   │   │   ├── ChildLoginPage.jsx
│   │   │   └── _components/
│   │   │       └── LoginForm/
│   │   │           ├── LoginForm.jsx
│   │   │           └── LoginForm.logic.jsx
│   │   ├── parent-login/
│   │   │   └── ParentLoginPage.jsx
│   │   └── doctor-login/
│   │       └── DoctorLoginPage.jsx
│   │
│   └── not-found/
│       └── NotFoundPage.jsx
│
└── components/                           ← مشتركة فعلاً (أكثر من صفحة)
    ├── MainNavbar/
    │   └── MainNavbar.jsx
    ├── ProtectedRoute/
    │   └── ProtectedRoute.jsx
    ├── GuestRoute/
    │   └── GuestRoute.jsx
    ├── SharedAuthForm/
    │   ├── SharedAuthForm.jsx
    │   └── SharedAuthForm.logic.jsx      ← Rule 4 (form state + Firebase auth)
    ├── GoogleAuthButton/
    │   └── GoogleAuthButton.jsx
    ├── AutismSupportBot/
    │   └── AutismSupportBot.jsx
    └── ClinicsMap/
        └── ClinicsMap.jsx
```

---

## ✅ Checklist قبل إنشاء أي صفحة جديدة

```
[ ] الصفحة في مجلد خاص بها؟  src/pages/pagename/
[ ] ملف PageName.jsx موجود ويُكوِّن فقط من Components؟
[ ] لو فيه Firebase calls → ملف pagename.services.js موجود؟
[ ] كل المكونات الخاصة بها في _components/ داخل مجلدها؟
[ ] كل مكوّن في _components/ في مجلد PascalCase بملف واحد؟
[ ] المكوّن المشترك (أكثر من صفحة) في src/components/PascalCase/؟
[ ] أي مكوّن معقد (state + effects) → .logic.jsx منفصل؟
[ ] PageName.jsx نظيف ولا يحتوي على JSX > 6 أسطر؟
[ ] لا يوجد Firebase import مباشر في أي Component؟
```

---

## 🔬 Verification — الوضع الحالي مقابل القواعد

### 📄 DashboardPage.jsx (401 سطر)

| الـ Rule | الحالة | التفاصيل |
|----------|--------|----------|
| Rule 1 — مجلد خاص | ❌ | ملف واحد في `src/pages/` — لا مجلد `parent-dashboard/` |
| Rule 1 — `services.js` | ❌ | غائب — البيانات تُجلب من Context مباشرة داخل الصفحة |
| Rule 1 — `_components/` | ❌ | التابس في `src/components/dashboard/` لا في `_components/` |
| Rule 2 — PascalCase folder | ❌ | التابس ملفات مباشرة لا في مجلدات |
| Rule 4 — Logic Separation | ❌ | 401 سطر من Logic + UI ممزوجان في نفس الملف |
| Rule 5 — Extract-to-Component | ⚠️ | التابس مستخرجة ✅، لكن: |

**ما يزال inline ❌:**
- `SectionTitle` (سطر 129-143) — function مُعرَّفة داخل الصفحة
- `<aside>` sidebar كاملة (سطر 267-352) — ~85 سطر inline
- Modal ربط الطفل (سطر 355-388) — ~35 سطر inline

---

### 📄 LandingPage.jsx (327 سطر)

| الـ Rule | الحالة | التفاصيل |
|----------|--------|----------|
| Rule 1 — مجلد خاص | ❌ | ملف واحد في `src/pages/` |
| Rule 5 — Extract-to-Component | ❌ | 7 sections كبيرة كلها inline |

**Sections يجب استخراجها:**
- Hero Section (سطر 97–140) — 44 سطر
- Login Section (سطر 143–166) — 24 سطر
- About Autism (سطر 168–215) — 48 سطر
- Tips (سطر 217–238) — 22 سطر
- Tools (سطر 240–274) — 35 سطر
- CTA Banner (سطر 276–283) — 8 سطر
- Footer (سطر 285–323) — 39 سطر

---

### 📄 مكونات src/components/

| المكوّن | Rule 2 | Rule 4 |
|---------|--------|--------|
| `AutismSupportBot.jsx` | ❌ لا مجلد | — |
| `ClinicsMap.jsx` | ❌ لا مجلد | — |
| `GoogleAuthButton.jsx` | ❌ لا مجلد | — |
| `GuestRoute.jsx` | ❌ لا مجلد | — |
| `MainNavbar.jsx` | ❌ لا مجلد | — |
| `ProtectedRoute.jsx` | ❌ لا مجلد | — |
| `SharedAuthForm.jsx` | ❌ لا مجلد | ❌ Logic + UI مدمجان |
| `dashboard/*.jsx` | ❌ | يجب نقلها لـ `_components/` داخل صفحة dashboard |
| `doctor/*.jsx` | ❌ | يجب نقلها لـ `_components/` داخل صفحة doctor |

---

### 📄 بقية الصفحات — فحص سريع

| الصفحة | السطور | الحالة |
|--------|--------|--------|
| `EmotionsPage.jsx` | 327 | ❌ Logic + UI ممزوجان، لا services |
| `ProfilePage.jsx` | ~350 | ❌ Logic + UI ممزوجان |
| `ChildHomePage.jsx` | ~400 | ❌ Logic + UI ممزوجان |
| `RoutinePage.jsx` | ~300 | ❌ Logic + UI ممزوجان، لا services |
| `PecsPage.jsx` | ~200 | ⚠️ مقبول — يحتاج services فقط |
| `CalmingPage.jsx` | ~200 | ⚠️ مقبول |
| `SettingsPage.jsx` | ~100 | ✅ بسيط وكافي |
| `NotFoundPage.jsx` | ~150 | ✅ بسيط وكافي |

---

## 🏁 ملخص نتائج المراجعة

```
Rule 1 (Page Folder Structure):  ❌ 0/17 صفحة في مجلد خاص
Rule 2 (Component PascalCase):   ❌ 0/9 مكوّن في مجلد
Rule 3 (Services Layer):         ❌ 0 صفحة لديها services.js
Rule 4 (Logic Separation):       ❌ 0 مكوّن مفصول
Rule 5 (Extract-to-Component):   ⚠️ جزئي — التابس مستخرجة لكن الـ sections لا
```

---

## 🚀 خطة التطبيق التدريجي

### المرحلة 1 — أي صفحة جديدة (فوري)
> طبّق القواعد كاملة على كل صفحة تُنشئها من الصفر. لا استثناءات.

### المرحلة 2 — إصلاح الصفحات الكبيرة (أهم مرحلة)
1. **`LandingPage`** — استخرج 7 sections لـ `_components/`
2. **`DashboardPage`** — استخرج `DashboardSidebar`، `SectionTitle`، `LinkChildModal`

### المرحلة 3 — إضافة Services Layer
1. `parentDashboard.services.js` — نقل Firebase calls من Context
2. `emotions.services.js` — نقل Firebase calls من الصفحة
3. `routine.services.js` — نقل Firebase calls من الصفحة

### المرحلة 4 — إعادة هيكلة components/
- نقل كل مكوّن لمجلد PascalCase
- نقل `dashboard/` و`doctor/` لـ `_components/` داخل صفحاتهم

### المرحلة 5 — فصل Logic عن UI
- `SharedAuthForm` → `SharedAuthForm.jsx` + `SharedAuthForm.logic.jsx`
- `ClinicalOverviewTab` → tab.jsx + tab.logic.jsx
- `PatientsTab` → tab.jsx + tab.logic.jsx

---

*آخر تحديث: 2026-05-18*
