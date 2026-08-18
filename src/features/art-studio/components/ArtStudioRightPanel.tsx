import { motion } from 'framer-motion';

interface ArtStudioRightPanelProps {
    isDark: boolean;
    COLORS: string[];
    BRUSH_SIZES: number[];
    activeColor: string;
    setActiveColor: (color: string) => void;
    setActiveTool: (tool: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    showColorPicker: boolean;
    setShowColorPicker: (show: boolean) => void;
    customColor: string;
    setCustomColor: (color: string) => void;
}

export default function ArtStudioRightPanel({ isDark, COLORS, BRUSH_SIZES, activeColor, setActiveColor, setActiveTool, brushSize, setBrushSize, showColorPicker, setShowColorPicker, customColor, setCustomColor }: ArtStudioRightPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex lg:flex-col gap-3 p-3 rounded-[20px] border backdrop-blur-2xl overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[500px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-pink-100'}`}
        >
            {/* Colors */}
            <div className="flex lg:flex-col gap-1.5 flex-wrap">
                {COLORS.map(color => (
                    <button
                        key={color}
                        onClick={() => { setActiveColor(color); setActiveTool('pen'); }}
                        className={`w-7 h-7 rounded-lg shrink-0 transition-all border-2 ${activeColor === color ? 'scale-110 border-pink-500 shadow-lg' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                    />
                ))}
                {/* Custom color */}
                <div className="relative">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`w-7 h-7 rounded-lg shrink-0 border-2 flex items-center justify-center text-xs ${isDark ? 'border-white/20' : 'border-slate-200'}`}
                        style={{ background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)` }}
                    >
                        🎨
                    </button>
                    {showColorPicker && (
                        <div className="absolute z-50 mt-1 right-0 lg:right-auto lg:left-0">
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => { setCustomColor(e.target.value); setActiveColor(e.target.value); setActiveTool('pen'); }}
                                className="w-8 h-8 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className={`w-full h-px lg:w-px lg:h-auto ${isDark ? 'bg-white/10' : 'bg-pink-100'}`} />

            {/* Brush sizes */}
            <div className="flex lg:flex-col gap-1.5 items-center">
                {BRUSH_SIZES.map(size => (
                    <button
                        key={size}
                        onClick={() => setBrushSize(size)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${brushSize === size ? 'bg-pink-500' : isDark ? 'hover:bg-white/10' : 'hover:bg-pink-50'}`}
                    >
                        <div className="rounded-full bg-current" style={{ width: Math.min(size, 20), height: Math.min(size, 20), backgroundColor: brushSize === size ? 'white' : activeColor }} />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
