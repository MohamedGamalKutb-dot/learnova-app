import { Button } from '@heroui/react';

export default function PecsCategories({ isDark, isArabic, categories, selectedCategory, setSelectedCategory, categoryIcons, categoryLabels, categoryLabelsAr }) {
    return (
        <div className="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar px-2">
            {categories.map(cat => (
                <Button 
                    key={cat} 
                    radius="full" 
                    onPress={() => setSelectedCategory(cat)}
                    variant={selectedCategory === cat ? "solid" : "bordered"}
                    className={`h-12 px-10 min-w-fit font-black text-[12px] uppercase tracking-widest transition-all ${
                        selectedCategory === cat
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-xl'
                        : `${isDark ? 'border-white/10 text-white/50' : 'border-indigo-100 text-indigo-900/40'}`
                    }`}
                    startContent={
                        <div className="w-8 h-8 overflow-hidden flex items-center justify-center rounded-lg">
                            <img src={categoryIcons[cat]} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                        </div>
                    }>
                    {isArabic ? categoryLabelsAr[cat] : categoryLabels[cat]}
                </Button>
            ))}
        </div>
    );
}
