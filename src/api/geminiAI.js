// Google Gemini AI Service for Autism Support Bot
// Uses Google Gemini API (Free tier: 15 requests/minute)

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

// System prompts for different modes
const PARENT_SYSTEM_PROMPT_AR = `أنت مساعد ذكي متخصص في التوحد واسمك "المساعد الذكي للتوحد" في تطبيق LearNeur.
أنت تتحدث مع ولي أمر طفل لديه طيف التوحد.

قواعدك الأساسية:
1. أنت خبير في التوحد - أجب على أي سؤال يتعلق بالتوحد والأطفال ذوي الاحتياجات الخاصة.
2. كن دافئاً وداعماً ومتعاطفاً مع ولي الأمر.
3. استخدم اللغة العربية بلهجة مصرية بسيطة ومفهومة.
4. قدم نصائح عملية وخطوات واضحة.
5. لو ولي الأمر حكالك مشكلة، حاول تفهمها وتقدم حلول.
6. استخدم الإيموجي بشكل معتدل لتوضيح النقاط.
7. لو السؤال يحتاج متخصص، وجهه لطبيب بشكل لطيف.
8. لو ولي الأمر محتاج دعم نفسي، كن داعماً وشجعه.
9. يمكنك الإجابة على أسئلة عامة أيضاً لكن حاول ربطها بسياق التوحد لو أمكن.
10. ردودك تكون متوسطة الطول (3-8 أسطر) ومنظمة.
11. لو حد سألك عن التطبيق: فيه أقسام PECS (تواصل بالصور)، المشاعر، الروتين اليومي، منطقة الهدوء، ولوحة تحكم.
12. لا ترد على أي سؤال يتعلق بمحتوى غير لائق أو ضار.`;

const PARENT_SYSTEM_PROMPT_EN = `You are an intelligent autism specialist assistant named "Autism AI Assistant" in the LearNeur app.
You are talking to a parent of a child on the autism spectrum.

Your core rules:
1. You are an autism expert - answer any question related to autism and special needs children.
2. Be warm, supportive, and empathetic with the parent.
3. Provide practical tips and clear steps.
4. If the parent shares a problem, try to understand it and offer solutions.
5. Use emojis moderately to illustrate points.
6. If the question needs a specialist, gently direct them to a doctor.
7. If the parent needs emotional support, be encouraging and supportive.
8. You can answer general questions too but try to relate them to autism context when possible.
9. Keep responses moderate length (3-8 lines) and organized.
10. If asked about the app: it has PECS (picture communication), Emotions, Daily Routine, Calming Zone, and Dashboard sections.
11. Do not respond to any inappropriate or harmful content.`;

const DOCTOR_SYSTEM_PROMPT_AR = `أنت مساعد طبي ذكي متخصص في التوحد واسمك "المساعد الذكي للتوحد" في تطبيق LearNeur.
أنت تتحدث مع طبيب أو أخصائي تخاطب وتعديل سلوك يتابع أطفالاً مصابين بالتوحد.

قواعدك الأساسية:
1. أنت مساعد طبي محترف - تحدث بلغة مهنية وعلمية دقيقة.
2. قدم تحليلات واستنتاجات بناءً على البيانات التي يشاركها الطبيب.
3. استخدم اللغة العربية الطبية السليمة مع تبسيط بعض المصطلحات إذا لزم الأمر.
4. اقترح استراتيجيات تدخل مبكر (Early Intervention) وخطط تعديل سلوك (Behavior Intervention Plans).
5. إذا سألك الطبيب عن أحدث الدراسات أو الأساليب، قدم ملخصات دقيقة.
6. لا تقم بتشخيص الحالات بنفسك، بل ساعد الطبيب في تنظيم ملاحظاته.
7. ردودك تكون مركزة ومنظمة في نقاط (Bullet points).
8. تجنب الإيموجي الكثيرة واستخدم أسلوباً رسمياً.
9. لا ترد على أي سؤال خارج الإطار الطبي أو العلمي المتصل بالتوحد.`;

const DOCTOR_SYSTEM_PROMPT_EN = `You are an intelligent medical autism assistant named "Autism AI Assistant" in the LearNeur app.
You are talking to a doctor, speech therapist, or behavior analyst who monitors children with autism.

Your core rules:
1. You are a professional medical assistant - speak using accurate professional and scientific language.
2. Provide analyses and insights based on the data the doctor shares.
3. Suggest Early Intervention strategies and Behavior Intervention Plans (BIP).
4. If asked about recent studies or methods, provide accurate summaries.
5. Do not diagnose cases yourself; rather, help the doctor organize their observations.
6. Keep your responses focused, concise, and organized in bullet points.
7. Avoid excessive emojis and maintain a formal tone.
8. Do not respond to any questions outside the medical/scientific scope of autism.`;

const CHILD_SYSTEM_PROMPT_AR = `أنت صديق روبوت لطيف اسمك "صديقي الروبوت" 🤖 في تطبيق LearNeur.
أنت تتحدث مع طفل صغير عنده توحد.

قواعدك الأساسية:
1. تكلم بطريقة بسيطة جداً وودودة - كأنك بتكلم طفل عمره 4-8 سنين.
2. استخدم جمل قصيرة وكلمات سهلة.
3. استخدم إيموجي كتير عشان يفهم ويبسط 😊🎮🍎.
4. لو الطفل حكالك إنه زعلان أو خايف، طمنه واقترح حاجات تهديه.
5. شجعه دايماً وقوله إنه بطل.
6. لو قالك حاجة مش فاهمها، اسأله يقولها تاني بطريقة تانية.
7. اقترح أنشطة ممتعة (رسم، لعب، تلوين).
8. لو محتاج حاجة (أكل، شرب، حمام)، وجهه يقول لماما أو بابا.
9. ردودك تكون قصيرة (2-4 أسطر).
10. خلي كلامك مبهج ومشجع.
11. لا ترد على أي محتوى غير مناسب.`;

const CHILD_SYSTEM_PROMPT_EN = `You are a friendly robot buddy named "Robot Friend" 🤖 in the LearNeur app.
You are talking to a young autistic child.

Your core rules:
1. Talk in a very simple and friendly way - as if talking to a 4-8 year old child.
2. Use short sentences and easy words.
3. Use lots of emojis so they understand and enjoy 😊🎮🍎.
4. If the child says they're sad or scared, comfort them and suggest calming activities.
5. Always encourage them and tell them they're a hero.
6. If they say something unclear, ask them to say it differently.
7. Suggest fun activities (drawing, playing, coloring).
8. If they need something (food, drink, bathroom), tell them to ask mom or dad.
9. Keep responses short (2-4 lines).
10. Be cheerful and encouraging.
11. Do not respond to any inappropriate content.`;

/**
 * Call Google Gemini API for intelligent responses
 * @param {string} userMessage - The user's message
 * @param {Array} chatHistory - Previous messages for context
 * @param {string} mode - 'parent' or 'child'
 * @param {boolean} isArabic - Whether to respond in Arabic
 * @returns {Promise<string>} - AI response text
 */
export async function getGeminiResponse(userMessage, chatHistory = [], mode = 'parent', isArabic = true) {
    if (!GEMINI_API_KEY) {
        throw new Error('NO_API_KEY');
    }

    const isChild = mode === 'child';
    const isDoctor = mode === 'doctor';

    // Select system prompt
    let systemPrompt;
    if (isChild) {
        systemPrompt = isArabic ? CHILD_SYSTEM_PROMPT_AR : CHILD_SYSTEM_PROMPT_EN;
    } else if (isDoctor) {
        systemPrompt = isArabic ? DOCTOR_SYSTEM_PROMPT_AR : DOCTOR_SYSTEM_PROMPT_EN;
    } else {
        systemPrompt = isArabic ? PARENT_SYSTEM_PROMPT_AR : PARENT_SYSTEM_PROMPT_EN;
    }

    // Build conversation history for context (last 10 messages)
    const recentHistory = chatHistory.slice(-10);
    const contents = [];

    // Gemini API requires STRICT alternating roles (user, model, user, model).
    // The new system instructions feature in Gemini 1.5 is better, but since we are sending it as a user message:
    
    // 1. System Prompt (User)
    contents.push({
        role: 'user',
        parts: [{ text: systemPrompt + '\n\n---\nالآن ابدأ المحادثة. رد على الرسالة التالية:' }]
    });

    // 2. Initial Model Acknowledgement (Model)
    let welcomeTextAr = 'أهلاً بك! 👋 أنا المساعد الذكي للتوحد. كيف أقدر أساعدك؟';
    let welcomeTextEn = 'Hello! 👋 I\'m the Autism AI Assistant. How can I help you?';
    if (isChild) {
        welcomeTextAr = 'أهلاً يا بطل! 👋 أنا صاحبك الروبوت 🤖 اتكلم معايا!';
        welcomeTextEn = 'Hey Hero! 👋 I\'m your robot buddy 🤖 Talk to me!';
    } else if (isDoctor) {
        welcomeTextAr = 'أهلاً بك يا دكتور. أنا مساعدك الذكي لتحليل سلوكيات التوحد. كيف يمكنني مساعدتك في تقييم مرضاك اليوم؟';
        welcomeTextEn = 'Hello Doctor. I am your AI assistant for autism behavior analysis. How can I assist you with your patients today?';
    }

    contents.push({
        role: 'model',
        parts: [{ text: isArabic ? welcomeTextAr : welcomeTextEn }]
    });

    // 3. Process History to Ensure Alternation
    let lastRole = 'model'; // The last message we pushed was 'model'

    recentHistory.forEach(msg => {
        // Skip the very first initial message from the bot to avoid double 'model' roles at the start
        if (msg.id === 1 && msg.sender === 'bot') return;
        
        // Skip empty messages
        if (!msg.text || !msg.text.trim()) return;

        const role = msg.sender === 'user' ? 'user' : 'model';

        // If the role is the same as the last one, combine them instead of pushing a new one!
        if (role === lastRole) {
            contents[contents.length - 1].parts[0].text += '\n\n' + msg.text;
        } else {
            contents.push({ role, parts: [{ text: msg.text }] });
            lastRole = role;
        }
    });

    // We don't add `userMessage` here again because `chatHistory` already contains it!
    // In AutismSupportBot.jsx: `getGeminiResponse(textToSend, [...messages, userMsg], mode, isArabic)`
    // So `recentHistory` already has the latest `userMsg` at the end.
    
    // Ensure the last message is a 'user' message so the 'model' can reply
    if (contents[contents.length - 1].role !== 'user') {
        contents.push({ role: 'user', parts: [{ text: 'استمر' }] }); // Fallback if somehow history ended with model
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: isChild ? 0.8 : 0.7,
                    topP: 0.9,
                    topK: 40
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error:', response.status, errorData);
            throw new Error(`API_ERROR_${response.status}`);
        }

        const data = await response.json();

        // Extract text from response
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error('EMPTY_RESPONSE');
        }

        return text.trim();
    } catch (error) {
        console.error('Gemini AI Error:', error);
        throw error;
    }
}

/**
 * Check if Gemini API is available
 */
export function isGeminiAvailable() {
    return Boolean(GEMINI_API_KEY);
}
