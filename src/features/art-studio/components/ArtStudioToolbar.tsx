import { motion } from 'framer-motion';

interface ArtStudioToolbarProps {
    isDark: boolean;
    TOOLS: Record<string, { icon: string }>;
    activeTool: string;
    setActiveTool: (tool: string) => void;
    showShapes: boolean;
    setShowShapes: (show: boolean) => void;
    handleUndo: () => void;
    handleClear: () => void;
}

export default function ArtStudioToolbar({ isDark, TOOLS, activeTool, setActiveTool, showShapes, setShowShapes, handleUndo, handleClear }: ArtStudioToolbarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex lg:flex-col gap-2 p-3 rounded-[20px] border backdrop-blur-2xl overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[500px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-pink-100'}`}
        >
            {/* Tools */}
            {Object.entries(TOOLS).map(([key, tool]) => (
                <button
                    key={key}
                    onClick={() => setActiveTool(key)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${activeTool === key ? 'bg-pink-500 text-white shadow-lg' : isDark ? 'hover:bg-white/10' : 'hover:bg-pink-50'}`}
                    title={key}
                >
                    {tool.icon}
                </button>
            ))}
            <div className={`w-full h-px lg:w-px lg:h-auto ${isDark ? 'bg-white/10' : 'bg-pink-100'}`} />

            {/* Shapes toggle */}
            <button
                onClick={() => setShowShapes(!showShapes)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${showShapes ? 'bg-purple-500 text-white shadow-lg' : isDark ? 'hover:bg-white/10' : 'hover:bg-pink-50'}`}
            >
                🔷
            </button>

            {/* Undo / Clear */}
            <button onClick={handleUndo} className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-pink-50'}`}>↩️</button>
            <button onClick={handleClear} className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-pink-50'}`}>🗑️</button>
        </motion.div>
    );
}
