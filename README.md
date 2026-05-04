# 🧠 LearnNeur — Autism Support Platform

> منصة رقمية شاملة لدعم أطفال طيف التوحد وأسرهم والأطباء المتخصصين  
> A comprehensive digital platform supporting autism spectrum children, their families, and medical specialists

---

## 📋 جدول المحتويات | Table of Contents

- [نبذة عن المشروع | About](#-نبذة-عن-المشروع--about)
- [التقنيات المستخدمة | Tech Stack](#-التقنيات-المستخدمة--tech-stack)
- [هيكل المشروع | Project Structure](#-هيكل-المشروع--project-structure)
- [الصفحات | Pages](#-الصفحات--pages)
- [المكونات | Components](#-المكونات--components)
- [إدارة الحالة | State Management](#-إدارة-الحالة--state-management)
- [البيانات | Data Layer](#-البيانات--data-layer)
- [الذكاء الاصطناعي | AI Integration](#-الذكاء-الاصطناعي--ai-integration)
- [نظام الـ Routing والتوثيق | Routing & Auth](#-نظام-الـ-routing-والتوثيق--routing--auth)
- [التصميم | Design System](#-التصميم--design-system)
- [التشغيل | Getting Started](#-التشغيل--getting-started)
- [النشر | Deployment](#-النشر--deployment)

---

## 🌟 نبذة عن المشروع | About

**LearnNeur** هو تطبيق ويب تفاعلي مبني بـ React يخدم ثلاثة أنواع من المستخدمين:

| الدور | الوصف |
|-------|-------|
| 🧒 **الطفل** | ألعاب تعليمية تفاعلية (PECS – المشاعر – الروتين – الهدوء) مع تتبع تلقائي |
| 👨‍👩‍👦 **ولي الأمر** | لوحة تحكم شاملة لمتابعة تقدم الطفل + خريطة مراكز التوحد + شات بوت ذكي |
| 👨‍⚕️ **الطبيب** | إدارة المرضى + التقييمات السلوكية + كتابة التقارير الطبية |

### ✨ المميزات الرئيسية

- 🌐 **دعم لغتين** (عربي / إنجليزي) مع دعم RTL كامل
- 🌗 **وضع ليلي / نهاري** (Dark / Light Mode)
- 🤖 **شات بوت ذكي** مدعوم بـ Google Gemini AI
- 🗺️ **خريطة تفاعلية** لمراكز التوحد في مصر (Leaflet)
- 🔊 **نطق صوتي** باستخدام Web Speech API
- 📊 **تتبع وإحصائيات** في الوقت الفعلي
- 🔐 **نظام مصادقة متعدد الأدوار** (طفل / ولي أمر / طبيب)
- 📱 **تصميم متجاوب** يعمل على جميع الأجهزة

---

## 🛠️ التقنيات المستخدمة | Tech Stack

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| **React** | `^19.2.0` | مكتبة واجهة المستخدم الأساسية |
| **Vite** | `^7.3.1` | أداة البناء والتطوير (Build Tool) |
| **TailwindCSS** | `^4.2.1` | تنسيق الـ CSS باستخدام الـ Utility Classes |
| **HeroUI** | `^2.8.10` | مكتبة مكونات UI جاهزة (Navbar, Card, Modal, Button, Input...) |
| **React Router DOM** | `^7.13.0` | التوجيه والتنقل بين الصفحات |
| **Framer Motion** | `^12.36.0` | الأنيميشن والحركات |
| **Leaflet / React-Leaflet** | `^1.9.4 / ^5.0.0` | خريطة تفاعلية لمراكز التوحد |
| **Google Gemini AI** | `gemini-2.0-flash` | الذكاء الاصطناعي للشات بوت |
| **ESLint** | `^9.39.1` | فحص جودة الكود |
| **gh-pages** | `^6.3.0` | النشر على GitHub Pages |

### الخطوط المستخدمة (Fonts)

- **Inter** — الخط الأساسي للتطبيق (الأوزان: 300–900)
- **Plus Jakarta Sans** — خط صفحة الهبوط (Landing Page)
- **Cairo** — الخط العربي (للنصوص العربية و RTL)

---

## 📁 هيكل المشروع | Project Structure

```
learnova_app/
├── .env                        # متغيرات البيئة (Gemini API Key)
├── .gitignore                  # الملفات المتجاهلة من Git
├── index.html                  # نقطة الدخول HTML
├── package.json                # إعدادات المشروع والتبعيات
├── vite.config.js              # إعدادات Vite + TailwindCSS + React
├── eslint.config.js            # إعدادات ESLint
├── vercel.json                 # إعدادات النشر على Vercel (SPA Rewrites)
│
├── public/
│   └── vite.svg                # أيقونة التطبيق
│
├── src/
│   ├── main.jsx                # ★ نقطة الدخول — يلف App بـ HeroUIProvider
│   ├── App.jsx                 # ★ جميع الـ Routes و Context Providers
│   ├── index.css               # ★ الستايلات العامة + Tailwind + Custom Theme
│   ├── hero.ts                 # إعدادات HeroUI Plugin لـ Tailwind
│   │
│   ├── api/
│   │   └── geminiAI.js         # خدمة Google Gemini AI
│   │
│   ├── assets/
│   │   └── react.svg           # شعار React
│   │
│   ├── components/
│   │   ├── AutismSupportBot.jsx    # شات بوت ذكي (AI + Local KB)
│   │   ├── ClinicsMap.jsx          # خريطة مراكز التوحد (Leaflet)
│   │   ├── MainNavbar.jsx          # شريط التنقل الرئيسي الموحد لكافة الأدوار
│   │   ├── ProtectedRoute.jsx      # حماية الصفحات المحمية
│   │   └── GuestRoute.jsx          # منع المسجلين من صفحات Login
│   │
│   ├── context/
│   │   ├── AppContext.jsx      # إعدادات التطبيق (Dark Mode + Language)
│   │   ├── AuthContext.jsx     # نظام المصادقة الكامل (3 أدوار)
│   │   └── DataContext.jsx     # تتبع بيانات الاستخدام والإحصائيات
│   │
│   ├── data/
│   │   ├── autismKnowledgeBase.js  # قاعدة معرفة التوحد (شات بوت ولي الأمر)
│   │   ├── childBotData.js         # قاعدة معرفة الطفل (شات بوت الطفل)
│   │   ├── clinicsData.js          # بيانات مراكز التوحد في مصر
│   │   ├── emotionData.js          # بيانات المشاعر (3 مستويات)
│   │   ├── pecsData.js             # بيانات بطاقات PECS
│   │   └── routineData.js          # بيانات الروتين اليومي
│   │
│   └── pages/
│       ├── LandingPage.jsx         # صفحة الهبوط الرئيسية
│       ├── ChoicePage.jsx          # صفحة اختيار الدور + Quick Login
│       ├── ChildLoginPage.jsx      # تسجيل دخول الطفل
│       ├── ChildSignupPage.jsx     # تسجيل حساب طفل جديد
│       ├── LoginPage.jsx           # تسجيل دخول ولي الأمر
│       ├── SignupPage.jsx          # تسجيل حساب ولي أمر
│       ├── DoctorAuthPage.jsx      # تسجيل دخول / حساب الطبيب
│       ├── ChildHomePage.jsx       # الصفحة الرئيسية للطفل
│       ├── PecsPage.jsx           # نظام التواصل بالصور (PECS)
│       ├── EmotionsPage.jsx       # تعلم المشاعر + اختبار
│       ├── RoutinePage.jsx        # الجدول البصري اليومي
│       ├── CalmingPage.jsx        # منطقة الهدوء (تنفس + تأمل)
│       ├── DashboardPage.jsx      # لوحة تحكم ولي الأمر
│       ├── ParentProfilePage.jsx  # الملف الشخصي لولي الأمر
│       ├── DoctorPage.jsx         # بوابة الطبيب
│       ├── DoctorProfilePage.jsx  # الملف الشخصي للطبيب
│       ├── SettingsPage.jsx       # صفحة الإعدادات (التبديل بين اللغات والمظهر)
│       └── NotFoundPage.jsx       # صفحة 404 المتحركة
```

---

## 📄 الصفحات | Pages

### 🏠 Landing Page (`LandingPage.jsx`)
الصفحة الرئيسية العامة — تتكون من أقسام:
- **Hero Section** — عنوان رئيسي + بطاقات تعريفية متحركة (staggered animation)
- **Login Section** — 3 بطاقات لاختيار الدور (طفل / ولي أمر / طبيب)
- **About Autism** — معلومات تثقيفية عن التوحد + إحصائيات + أنواع التوحد
- **Tips Section** — نصائح عملية للتعامل مع أطفال التوحد
- **Tools Section** — عرض أدوات المنصة مع أنيميشن hover
- **CTA Banner** — دعوة للتسجيل
- **Footer** — روابط سريعة + معلومات التواصل

> يستخدم مكونات HeroUI: `Navbar`, `Button`, `Card`, `CardBody`, `Chip`, `Divider`

### 🚪 Choice Page (`ChoicePage.jsx`)
صفحة اختيار الدور مع إمكانية **Quick Registration / Login** مباشرة:
- 3 بطاقات أدوار (طفل / ولي أمر / طبيب) مع تأثيرات تفاعلية
- **Modal سريع** للتسجيل/الدخول بالإيميل
- **Google Sign-In Simulation** — محاكاة تسجيل دخول جوجل بخطوتين
- شريط "الأكثر استخداماً" (Most Used) على بطاقة ولي الأمر

### 🧒 Child Home (`ChildHomePage.jsx`)
الصفحة الرئيسية للطفل بعد تسجيل الدخول — تعرض:
- بطاقة ترحيبية بالطفل
- 4 أقسام رئيسية: PECS / المشاعر / الروتين / الهدوء
- شات بوت وضع الأطفال (Robot Friend)

### 🗣️ PECS Page (`PecsPage.jsx`)
نظام التواصل بالصور (Picture Exchange Communication System):
- **شريط بناء الجملة** — بطاقات قابلة للإزالة + زر نطق
- **تصنيفات** — طعام / مشروبات / أنشطة / أشخاص / مشاعر / أماكن
- **نطق صوتي** — عند اختيار بطاقة (Web Speech API)
- **تتبع** — الكلمات الأكثر استخداماً + عدد النقرات

### 😊 Emotions Page (`EmotionsPage.jsx`)
وحدة تعلم المشاعر:
- **وضع التعلم** — عرض المشاعر واحدة تلو الأخرى مع الوصف والنطق
- **3 مستويات صعوبة** — سهل / متوسط / صعب
- **اختبار (Quiz)** — 6 أسئلة عشوائية مع تتبع النتائج
- **سجل الأداء** — عرض آخر 5 أيام من النتائج

### 📅 Routine Page (`RoutinePage.jsx`)
الجدول البصري اليومي:
- **فترات زمنية** — صباح / ظهر / مساء / ليل
- **إنجاز المهام** — نقر لإتمام مع checkbox متحرك
- **إضافة نشاط مخصص** — FAB button + Modal
- **سجل الأيام السابقة** — آخر 5 أيام مع النسب المئوية
- **حفظ تلقائي** — يحفظ في `routineHistory` الخاص بالطفل

### 🧘 Calming Page (`CalmingPage.jsx`)
منطقة الهدوء والاسترخاء:
- **تمرين التنفس** — دائرة متحركة (شهيق ← انتظار ← زفير) بدورة 4 ثواني
- **مؤقت الجلسة** — اختيار 3/5/10/15 دقيقة مع عد تنازلي
- **تأمل بصري** — كرات ملونة متحركة (ambient animation)

### 📊 Parent Dashboard Page (`DashboardPage.jsx`)
لوحة تحكم ولي الأمر (الأكبر والأكثر تعقيداً):
- **بطاقة الطفل** — معلومات أساسية بتدرج لوني
- **إحصائيات سريعة** — التفاعلات / دقة المشاعر / نسبة الروتين
- **تقرير طبي** — بـ 3 تبويبات (عام / تقييمات / سلوك)
- **متتبع الروتين** — آخر 7 أيام + شريط تقدم
- **تطور المشاعر** — آخر 7 أيام + شريط تقدم
- **استخدام الأقسام** — رسم بياني أفقي
- **النشاط الأسبوعي** — رسم بياني عمودي (Bar Chart)
- **الكلمات الأكثر استخداماً** — ترتيب تنازلي
- **ملاحظات يومية** — إضافة وحذف
- **خريطة المراكز** — مكون `ClinicsMap` مدمج
- **شات بوت** — مكون `AutismSupportBot` مدمج
- **توصيات ذكية** — اقتراحات بناءً على الاستخدام

### 👨‍⚕️ Doctor Page (`DoctorPage.jsx`)
بوابة الطبيب المتخصص — 4 تبويبات:
1. **المرضى (Patients)** — قائمة المرضى + إضافة مريض جديد بالكود أو الهاتف
2. **التقييم (Assessment)** — 10 أسئلة تقييم سلوكي + حفظ النتيجة + سجل سابق
3. **السلوك (Behavior)** — تسجيل 8 أنواع سلوكية مع شدة 1–5 + ملاحظات
4. **التقارير (Reports)** — ملخص شامل للمريض + التشخيص

### 👤 Profile Pages (`ParentProfilePage.jsx`, `DoctorProfilePage.jsx`, `ProfilePage.jsx`)
الملفات الشخصية المنفصلة (تم تحويلها من Modals إلى صفحات مستقلة لتحسين مسار التنقل):
- تعديل بيانات الحساب الأساسية والـ Avatar.
- واجهة موحدة ومتسقة مع نظام الـ Routing الجديد.
- مستوى التشخيص في صفحة الطفل (يحدده الطبيب فقط — read-only).
- التفضيلات الحسية وملاحظات نصية حرة (للطفل).

### ⚙️ Settings Page (`SettingsPage.jsx`)
صفحة إعدادات التطبيق المركزية:
- تبديل اللغة (عربي / إنجليزي).
- تبديل المظهر (Light / Dark Mode).
- إزالة أزرار الإعدادات من شريط التنقل (Navbar) لتبسيط واجهة المستخدم.

### 🚫 Not Found Page (`NotFoundPage.jsx`)
صفحة 404 متحركة ومصممة بشكل احترافي:
- رقم 404 بتدرج لوني مع animation
- جزيئات متحركة (Particles)
- روابط مقترحة للتوجيه

---

## 🧩 المكونات | Components

### `AutismSupportBot.jsx`
شات بوت ذكي يدعم **وضعين**:
- **وضع ولي الأمر** (`mode='parent'`) — إجابات متخصصة في التوحد
- **وضع الطفل** (`mode='child'`) — أسلوب بسيط ومشجع مع إيموجي

**آلية العمل:**
1. يحاول أولاً استخدام **Google Gemini AI** (إذا كان API Key متاحاً)
2. إذا فشل → يبحث في **قاعدة المعرفة المحلية** (keyword matching بالنقاط)
3. إذا لم يجد → يعرض **رابط بحث جوجل** (للآباء) أو **رد افتراضي** (للأطفال)

**مميزات:**
- أسئلة سريعة جاهزة (Quick Suggestions)
- مؤشر كتابة (Typing Indicator)
- شارة "✨ Gemini AI" عند تفعيل الذكاء الاصطناعي
- دعم RTL كامل

### `ClinicsMap.jsx`
خريطة تفاعلية لمراكز التوحد في مصر:
- **بحث** — بالمدينة أو المنطقة (عربي + إنجليزي)
- **فلاتر المدن** — Cairo, Giza, Alexandria, Dakahlia, Gharbia...
- **فلاتر الخدمات** — علاج نطق، تأهيل حسي، ABA...
- **خريطة Leaflet** — مع Markers و Popups
- **قائمة النتائج** — مرتبة بالمسافة مع تقييمات + رقم هاتف
- **تكامل Google Maps** — رابط مباشر لفتح الموقع

### `ProtectedRoute.jsx`
حارس (Guard) يمنع الوصول للصفحات المحمية:
- يأخذ `role` (child / parent / doctor) و `redirectTo`
- يتحقق من تسجيل الدخول حسب الدور
- يعيد التوجيه لصفحة Login المناسبة

### `GuestRoute.jsx`
عكس ProtectedRoute — يمنع المستخدم المسجل من الوصول لصفحات Login/Signup:
- إذا الطفل مسجل → يوجهه لـ `/child-home`
- إذا الوالد مسجل → يوجهه لـ `/dashboard`
- إذا الطبيب مسجل → يوجهه لـ `/doctor-dashboard`

---

## 🔄 إدارة الحالة | State Management

يستخدم المشروع **3 Context Providers** متداخلة:

```
<BrowserRouter>
  <AppProvider>         ← إعدادات التطبيق
    <AuthProvider>      ← نظام المصادقة
      <DataProvider>    ← بيانات الاستخدام
        <Routes>...</Routes>
      </DataProvider>
    </AuthProvider>
  </AppProvider>
</BrowserRouter>
```

### `AppContext.jsx` — إعدادات التطبيق
| الحقل | النوع | الوصف |
|-------|------|------|
| `isDark` | `boolean` | الوضع الليلي |
| `isArabic` | `boolean` | اللغة العربية |
| `toggleTheme()` | `function` | تبديل الوضع |
| `toggleLanguage()` | `function` | تبديل اللغة |

> يحفظ في `localStorage` بمفاتيح: `learnova_dark`, `learnova_arabic`  
> يتحكم في `class="dark"` على `<html>` و `dir="rtl"`

### `AuthContext.jsx` — نظام المصادقة
نظام مصادقة كامل يدعم **3 أدوار** مع تخزين في `localStorage`:

**مفاتيح التخزين:**
| المفتاح | الوصف |
|---------|------|
| `learnova_children` | مصفوفة حسابات الأطفال |
| `learnova_parents` | مصفوفة حسابات أولياء الأمور |
| `learnova_doctor_accounts` | مصفوفة حسابات الأطباء |
| `learnova_current_child` | جلسة الطفل الحالية |
| `learnova_current_parent` | جلسة ولي الأمر الحالية |
| `learnova_current_doctor` | جلسة الطبيب الحالية |

**الوظائف المتاحة:**

| الوظيفة | الوصف |
|---------|------|
| `registerChild()` | تسجيل طفل جديد (يولد كود فريد `LN-XXXXXX`) |
| `loginChild()` | دخول بالإيميل أو الكود + كلمة المرور |
| `logoutChild()` | تسجيل خروج الطفل |
| `updateChildProfile()` | تعديل بيانات الطفل (ما عدا مستوى التشخيص) |
| `updateChildRoutine()` | تحديث سجل الروتين اليومي |
| `updateChildEmotionStats()` | تحديث إحصائيات المشاعر |
| `registerParent()` | تسجيل ولي أمر (يربط بكود الطفل) |
| `loginParent()` / `logoutParent()` | دخول / خروج ولي الأمر |
| `registerDoctor()` | تسجيل طبيب جديد |
| `loginDoctor()` / `logoutDoctor()` | دخول / خروج الطبيب |
| `findChildForDoctor()` | بحث عن طفل بالكود أو رقم الهاتف |
| `updateChildDiagnosis()` | الطبيب يحدث مستوى التشخيص |
| `addPatientToDoctor()` | إضافة مريض لقائمة الطبيب |
| `removePatientFromDoctor()` | حذف مريض من القائمة |
| `getChildById()` | جلب بيانات طفل بالكود |

**المزامنة:**
- `storage` event — مزامنة بين التبويبات
- Polling كل **2 ثانية** — مزامنة داخل نفس المتصفح

### `DataContext.jsx` — بيانات الاستخدام
يتتبع كل تفاعلات الطفل مع التطبيق:

| الفئة | البيانات المتتبعة |
|-------|------------------|
| **PECS** | الكلمات المستخدمة + عدد الجمل + إجمالي النقرات |
| **المشاعر** | المحاولات + الإجابات الصحيحة + مشاهدات التعلم |
| **الروتين** | المهام المكتملة + الإجمالي + عدد إعادة التعيين |
| **الهدوء** | الجلسات المكتملة + إجمالي الدقائق + تمارين التنفس |
| **عام** | إجمالي التفاعلات + الاستخدام الأسبوعي + استخدام الأقسام |
| **ملاحظات** | ملاحظات يومية (إضافة / حذف) |

> يحفظ في `localStorage` بمفتاح: `lLearnNeur_data`

---

## 📦 البيانات | Data Layer

### `pecsData.js`
بيانات بطاقات PECS:
- **6 تصنيفات:** food, drinks, activities, people, feelings, places
- كل بطاقة تحتوي: `id`, `emoji`, `label`, `labelAr`, `category`
- دوال مساعدة: `getItemsByCategory()`, `categories`, `categoryEmojis`...

### `emotionData.js`
بيانات المشاعر:
- **3 مستويات:** Level 1 (أساسي) → Level 2 (متوسط) → Level 3 (متقدم)
- كل مشاعر تحتوي: `id`, `name`, `nameAr`, `emoji`, `description`, `descriptionAr`, `level`
- دالة: `getUpToLevel(n)` — تجلب المشاعر حتى المستوى المحدد

### `routineData.js`
بيانات الروتين اليومي الافتراضي:
- أنشطة مقسمة حسب الفترة: `morning`, `afternoon`, `evening`, `night`
- قوائم إيموجي متاحة للإضافة: `availableEmojis`
- تسميات الفترات بالعربي والإنجليزي

### `clinicsData.js`
بيانات مراكز التوحد في مصر:
- مراكز في: القاهرة، الجيزة، الإسكندرية، الدقهلية، الغربية، الشرقية، أسيوط، الأقصر، السويس
- كل مركز يحتوي: `name`, `nameAr`, `area`, `areaAr`, `lat`, `lng`, `phone`, `rating`, `services`
- بيانات المدن مع الإحداثيات: `egyptCities`
- تسميات الخدمات: `serviceLabels`

### `autismKnowledgeBase.js`
قاعدة معرفة الشات بوت لولي الأمر:
- مواضيع متنوعة مع `keywords` + `answerAr` + `answerEn`
- يغطي: التوحد، العلاج، النطق، السلوك، الحمية، النوم...

### `childBotData.js`
قاعدة معرفة الشات بوت للأطفال:
- ردود بسيطة ومشجعة مع إيموجي كثير
- يغطي: المشاعر، الطعام، اللعب، الخوف، الفرح...

---

## 🤖 الذكاء الاصطناعي | AI Integration

### `geminiAI.js`
خدمة Google Gemini AI:

```
API: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

**الإعدادات:**
| الإعداد | وضع الطفل | وضع ولي الأمر |
|---------|----------|-------------|
| `temperature` | 0.8 | 0.7 |
| `maxOutputTokens` | 200 | 500 |
| `topP` | 0.9 | 0.9 |
| `topK` | 40 | 40 |

**System Prompts:**
- 4 prompts مختلفة: (عربي + إنجليزي) × (طفل + ولي أمر)
- **ولي الأمر:** متخصص في التوحد، داعم ومتعاطف، يقدم نصائح عملية
- **الطفل:** صديق روبوت لطيف، جمل قصيرة، إيموجي كثير

**حماية المحتوى:**
- `HARM_CATEGORY_HARASSMENT` → `BLOCK_MEDIUM_AND_ABOVE`
- `HARM_CATEGORY_HATE_SPEECH` → `BLOCK_MEDIUM_AND_ABOVE`
- `HARM_CATEGORY_SEXUALLY_EXPLICIT` → `BLOCK_LOW_AND_ABOVE`
- `HARM_CATEGORY_DANGEROUS_CONTENT` → `BLOCK_MEDIUM_AND_ABOVE`

> **المفتاح** يُخزن في `.env` كـ `VITE_GEMINI_API_KEY`

---

## 🔐 نظام الـ Routing والتوثيق | Routing & Auth

### خريطة الـ Routes

| المسار | الصفحة | الحماية |
|--------|--------|---------|
| `/` | `LandingPage` | عام |
| `/choice` | `ChoicePage` | عام |
| `/child-login` | `ChildLoginPage` | `GuestRoute (child)` |
| `/child-signup` | `ChildSignupPage` | `GuestRoute (child)` |
| `/login` | `LoginPage` | `GuestRoute (parent)` |
| `/signup` | `SignupPage` | `GuestRoute (parent)` |
| `/doctor-auth` | `DoctorAuthPage` | `GuestRoute (doctor)` |
| `/child-home` | `ChildHomePage` | `ProtectedRoute (child)` → `/child-login` |
| `/pecs` | `PecsPage` | `ProtectedRoute (child)` → `/child-login` |
| `/emotions` | `EmotionsPage` | `ProtectedRoute (child)` → `/child-login` |
| `/routine` | `RoutinePage` | `ProtectedRoute (child)` → `/child-login` |
| `/calming` | `CalmingPage` | `ProtectedRoute (child)` → `/child-login` |
| `/parent-dashboard` | `DashboardPage` | `ProtectedRoute (parent)` → `/login` |
| `/parent-dashboard/profile` | `ParentProfilePage` | `ProtectedRoute (parent)` → `/login` |
| `/doctor-dashboard` | `DoctorPage` | `ProtectedRoute (doctor)` → `/doctor-auth` |
| `/doctor-dashboard/profile` | `DoctorProfilePage` | `ProtectedRoute (doctor)` → `/doctor-auth` |
| `/settings` | `SettingsPage` | عام |
| `*` | `NotFoundPage` | عام |

---

## 🎨 التصميم | Design System

### Color Palette

**ألوان عامة:**
| المتغير | القيمة | الاستخدام |
|---------|--------|-----------|
| `--color-accent` | `#6C63FF` | اللون الأساسي (أرجواني) |
| `--color-accent2` | `#FF6584` | اللون الثانوي (وردي) |
| `--color-accent3` | `#4ECDC4` | اللون الثالث (تركواز) |
| `--color-accent4` | `#B8A9E8` | اللون الرابع (بنفسجي فاتح) |
| `--color-bg` | `#F7F9FC` | خلفية الوضع النهاري |
| `--color-bg-dark` | `#0D1117` | خلفية الوضع الليلي |
| `--color-card` | `#FFFFFF` | خلفية البطاقات (نهاري) |
| `--color-card-dark` | `#161B22` | خلفية البطاقات (ليلي) |

**ألوان صفحة الهبوط (Landing):**
- سلسلة `p50`–`p700` (أزرق متدرج)
- سلسلة `a400`–`a500` (سماوي)
- ألوان الأسطح والنصوص والحدود لكلا الوضعين

### Custom Animations

| الأنيميشن | الوصف |
|-----------|------|
| `fadeIn` | ظهور تدريجي |
| `fadeInUp` | ظهور من الأسفل (الأكثر استخداماً) |
| `pulse` | نبض متكرر |
| `float` | حركة عائمة |
| `floatIn` | ظهور من اليمين (Hero Cards) |
| `cardIn` | ظهور بطاقات ChoicePage |

### Custom CSS Classes

| الكلاس | الوصف |
|--------|------|
| `.font-jakarta` | خط Plus Jakarta Sans |
| `.font-cairo` | خط Cairo (العربي) |
| `.toolcard-bar` | أنيميشن الشريط السفلي في بطاقات الأدوات |
| `.hcard-1/2/3` | أنيميشن متسلسل لبطاقات Hero |
| `.dot-grid` | خلفية نقطية |

### Dark Mode
- يعتمد على `class="dark"` على `<html>`
- Custom variant: `@custom-variant dark (&:is(.dark *))`
- كل مكون يتحقق من `isDark` ويطبق الستايلات المناسبة

### RTL Support
- يتحقق من `isArabic` ويغير `dir="rtl"` على `<html>`
- جميع المكونات تدعم RTL
- الخطوط تتبدل تلقائياً (Inter ↔ Cairo)
- `.toolcard-bar` يغير `transform-origin` حسب الاتجاه

---

## 🚀 التشغيل | Getting Started

### المتطلبات
- **Node.js** >= 18
- **npm** >= 9

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/MohamedGamalKutb-dot/learnova-app.git

# الدخول للمجلد
cd learnova_app

# تثبيت التبعيات
npm install
```

### إعداد المتغيرات البيئية

أنشئ ملف `.env` في جذر المشروع:

```env
# Google Gemini AI API Key
# احصل على مفتاح مجاني من: https://aistudio.google.com/apikey
VITE_GEMINI_API_KEY=your_api_key_here
```

### التشغيل

```bash
# تشغيل بيئة التطوير
npm run dev

# بناء نسخة الإنتاج
npm run build

# معاينة نسخة الإنتاج
npm run preview

# فحص الكود
npm run lint
```

---

## 🌐 النشر | Deployment

### Vercel
المشروع معد للنشر على Vercel مع إعداد SPA Rewrites:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### GitHub Pages

```bash
npm run deploy
```

> يستخدم `gh-pages` مع `base: '/'` في `vite.config.js`

---

## ⚙️ ملفات الإعدادات | Configuration Files

### `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
})
```

### `eslint.config.js`
- يستخدم ESLint v9 Flat Config
- يدعم `.js` و `.jsx`
- Plugins: `react-hooks`, `react-refresh`
- Rule مخصص: `no-unused-vars` يتجاهل المتغيرات بحرف كبير أو `_`

### `hero.ts`
ملف Plugin لـ HeroUI يدمجه مع Tailwind CSS v4:
```ts
import { heroui } from "@heroui/react";
export default heroui();
```

---

## 📝 ملاحظات مهمة | Important Notes

1. **البيانات محلية بالكامل (Local-First)** — تم الاستغناء عن Firebase تماماً، وجميع البيانات تُخزن الآن بأمان في `localStorage` لضمان الخصوصية والعمل بدون إنترنت.
2. **محاكاة جوجل الذكية** — ميزة تسجيل الدخول بجوجل تعمل الآن بنظام محاكاة محلي (Local Simulation) يحاكي تجربة جوجل الحقيقية ويخزن الجلسات محلياً.
3. **الذكاء الاصطناعي اختياري** — التطبيق يعمل بذكاء حتى بدون API Key بالاعتماد على قواعد البيانات المحلية المتكاملة.
4. **دقة البيانات** — مستوى التشخيص والتقييمات لا يمكن تغييرها إلا من خلال حساب الطبيب لضمان الدقة الطبية.
5. **المزامنة والسرعة** — تم تحسين نظام المزامنة والـ Polling لضمان تحديث البيانات فورياً بين كافة النوافذ المفتوحة.

---

## 🚀 التحديثات الأخيرة | Recent Updates (May 2026)

- 🧭 **نظام تنقل موحد (Unified Navigation)**: إنشاء `MainNavbar.jsx` ليعمل كشريط تنقل ذكي وموحد بين كافة الأدوار (Child, Parent, Doctor) مع إزالة النوافذ المنبثقة (Modals) من التنقل الأساسي.
- ⚙️ **صفحة إعدادات مستقلة**: نقل خيارات تبديل اللغة والمظهر (Light/Dark Mode) إلى `SettingsPage.jsx` لتبسيط واجهة شريط التنقل وجعل تجربة المستخدم أنظف.
- 🗂️ **إعادة هيكلة المسارات**: تغيير مسار لوحة تحكم ولي الأمر إلى `/parent-dashboard` ليتناسق منطقياً مع `/doctor-dashboard` و `/child-home`.
- 🎨 **توحيد التصميم (Design Consistency)**: توحيد عرض القائمة الجانبية (Sidebar) وتنسيقات الألوان الخاصة بـ Profile Header بين لوحة تحكم الطبيب ولوحة تحكم ولي الأمر.
- 👤 **صفحات شخصية مستقلة**: تحويل الملفات الشخصية (Profile) إلى صفحات مستقلة (`ParentProfilePage.jsx`, `DoctorProfilePage.jsx`) بدلاً من النوافذ المنبثقة لتحسين الـ Routing وتجربة المستخدم.

---

## 📅 التحديثات السابقة | Previous Updates (April 2026)

- 🔒 **الاستغناء عن Firebase**: تحويل المشروع بالكامل ليعمل بنظام `Local-First` لحماية الخصوصية وتبسيط البنية.
- 🎯 **إصلاحات الاستقرار**: حل مشكلة "الشاشة البيضاء" (White Screen) في لوحة التحكم وصفحة الاختيار عبر معالجة البيانات غير المعرّفة.
- 🧩 **محاكاة تسجيل دخول جوجل**: إضافة واجهة منبثقة تفاعلية لمحاكاة تسجيل الدخول بجوجل محلياً بخطوات انسيابية.
- 🛠️ **تحسين الأداء**: تقليل حجم الكود وحذف التبعيات غير المستخدمة لضمان أسرع وقت استجابة للصفحات.
- 🛡️ **تأمين البيانات**: إضافة طبقات حماية للمصفوفات والسجلات لمنع أي انهيار برمجي عند التعامل مع حسابات المستخدمين الجدد.

---

<div align="center">

**© 2025 LearnNeur — جميع الحقوق محفوظة**

🧠 *Supporting autism spectrum children and their families with science-backed tools*

</div>
