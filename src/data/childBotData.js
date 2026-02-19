// Simplified Knowledge Base for Children
export const childBotData = [
    // --- Feelings / المشاعر ---
    {
        keywords: ['sad', 'cry', 'upset', 'hate', 'bad', 'زعلان', 'حزين', 'بعيط', 'وحش', 'مخنوق', 'متضايق'],
        answerAr: "يا خبر! 😟 ليه زعلان يا بطل؟ \nتحب نعمل تمارين تنفس مع بعض؟ 🧘‍♂️\nولا تحكيلي مالك؟",
        answerEn: "Oh no! 😟 Why are you sad, my friend? \nWant to do some breathing exercises? 🧘‍♂️\nOr tell me what happened?"
    },
    {
        keywords: ['happy', 'fun', 'good', 'joy', 'smile', 'سعيد', 'فرحان', 'مبسوط', 'حلو', 'ضحك', 'لعبت'],
        answerAr: "يا سلام! 🎉 أنا كمان فرحان إنك مبسوط! \nاستمر في الابتسامة الجميلة دي! 😄",
        answerEn: "Yay! 🎉 I'm so happy you're happy! \nKeep that beautiful smile! 😄"
    },
    {
        keywords: ['angry', 'mad', 'shout', 'hit', 'غضبان', 'متعصب', 'هضرب', 'صراخ', 'زعيق'],
        answerAr: "أنا فاهم إنك متضايق. 😤 \nبس إحنا مش بنضرب. \nتعال نعد لحد 5 مع بعض.. 1.. 2.. 3.. 🥣",
        answerEn: "I understand you're mad. 😤 \nBut we don't hit. \nLet's count to 5 together.. 1.. 2.. 3.. 🥣"
    },

    // --- Needs / احتياجات ---
    {
        keywords: ['hungry', 'food', 'eat', 'snack', 'جعان', 'أكل', 'طعام', 'بطني'],
        answerAr: "بطنك بتصوصو؟ 😋 \nقول لماما أو بابا: 'أنا جعان' أو استخدم كارت 'أكل' من الصور. 🍎",
        answerEn: "Tummy rumbling? 😋 \nTell mom or dad: 'I'm hungry' or use the 'Food' card. 🍎"
    },
    {
        keywords: ['thirsty', 'water', 'drink', 'juice', 'عطشان', 'ميه', 'شرب', 'عصير'],
        answerAr: "الميه مفيدة جداً! 💧 \nروح اشرب كوباية ميه كبيرة وارجعلي. 🥤",
        answerEn: "Water is great! 💧 \nGo drink a big glass of water and come back. 🥤"
    },
    {
        keywords: ['tired', 'sleep', 'bed', 'nap', 'تعبان', 'نام', 'سرير', 'نعسان', 'اجهاد'],
        answerAr: "شكلك بذلت مجهود كبير النهاردة! 😴 \nيلا نريح شوية أو ننام في السرير الدافي. 🛌",
        answerEn: "You worked hard today! 😴 \nLet's rest a bit or go to your cozy bed. 🛌"
    },

    // --- Sensory / حسي ---
    {
        keywords: ['loud', 'noise', 'ear', 'sound', 'صوت عالي', 'دوشة', 'ازعاج', 'ودني'],
        answerAr: "الصوت عالي؟ 🙉 \nممكن تحط السماعات بتاعتك 🎧 أو تروح أوضة هادية شوية.",
        answerEn: "Is it too loud? 🙉 \nYou can put on your headphones 🎧 or go to a quiet room."
    },
    {
        keywords: ['light', 'bright', 'sun', 'eye', 'ضوء', 'نور', 'شمس', 'عيني'],
        answerAr: "النور قوي؟ 😎 \nممكن نلبس النظارة الشمسية أو نوطي النور شوية.",
        answerEn: "Too bright? 😎 \nWe can wear sunglasses or dim the lights."
    },

    // --- Play / لعب ---
    {
        keywords: ['bored', 'play', 'game', 'toy', 'زهقان', 'ملل', 'العب', 'لعبة', 'ألعاب'],
        answerAr: "زهقان؟ 🤔 \nإيه رأيك نرسم؟ 🎨 أو نلعب بالمكعبات؟ 🧱 أو نشوف صور؟",
        answerEn: "Bored? 🤔 \nHow about we draw? 🎨 Or play with blocks? 🧱 Or look at pictures?"
    },

    // --- Social / اجتماعي ---
    {
        keywords: ['friend', 'hello', 'hi', 'name', 'صاحبي', 'أهلا', 'اسمك', 'مرحبا'],
        answerAr: "أهلاً يا صديقي! 👋 \nأنا الروبوت صاحبك، بحب ألعب وأتكلم معاك! 🤖",
        answerEn: "Hello friend! 👋 \nI'm your robot buddy, I love playing and talking with you! 🤖"
    }
];

export const childDefaultResponse = {
    ar: "أهلاً يا بطل! 👋 \nأنا صاحبك الروبوت 🤖\n\nممكن تقولي:\n- أنا فرحان 😄\n- أنا جعان 🍎\n- عايز ألعب 🎮\n\nحاسس بإيه دلوقتي؟",
    en: "Hey Hero! 👋 \nI'm your robot buddy 🤖\n\nTell me:\n- I'm happy 😄\n- I'm hungry 🍎\n- I want to play 🎮\n\nHow do you feel?"
};

export const childFallbackResponse = {
    ar: "أنا لسه بتعلم كلام جديد! 😅 \nممكن تقولي حاجة تانية؟ زي 'أنا مبسوط' أو 'عايز أنام'؟",
    en: "I'm still learning new words! 😅 \nCan you say something else? Like 'I'm happy' or 'I want to sleep'?"
};
