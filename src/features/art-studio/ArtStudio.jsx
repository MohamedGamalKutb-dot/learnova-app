import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/context/AppContext';
import { useAuth } from '../../shared/context/AuthContext';
import MainNavbar from '../../shared/components/MainNavbar';
import { Button, useDisclosure } from '@heroui/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { saveDrawing, getDrawings, deleteDrawing, subscribeToDrawings, syncLocalDataToFirebase, getDrawingConfig } from './server/artStudioServer';
import ArtStudioHeader from './components/ArtStudioHeader';
import ArtStudioToolbar from './components/ArtStudioToolbar';
import ArtStudioRightPanel from './components/ArtStudioRightPanel';
import ArtStudioShapesPanel from './components/ArtStudioShapesPanel';
import ArtStudioCanvas from './components/ArtStudioCanvas';
import ArtStudioGalleryModal from './components/ArtStudioGalleryModal';

export default function ArtStudio() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();
    
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const lastSavedDataUrlRef = useRef(null);

    const [activeTool, setActiveTool] = useState('pen');
    const [activeColor, setActiveColor] = useState('#3B82F6');
    const [brushSize, setBrushSize] = useState(4);
    const [isDrawing, setIsDrawing] = useState(false);
    const [undoStack, setUndoStack] = useState([]);
    const [showShapes, setShowShapes] = useState(false);
    const [savedDrawings, setSavedDrawings] = useState([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [customColor, setCustomColor] = useState('#3B82F6');
    const { isOpen: isGalleryOpen, onOpen: onGalleryOpen, onClose: onGalleryClose } = useDisclosure();

    const [drawingConfig, setDrawingConfig] = useState({
        COLORS: [],
        BRUSH_SIZES: [],
        TOOLS: {},
        SHAPES: {}
    });

    useEffect(() => {
        getDrawingConfig().then(config => {
            if (config) {
                setDrawingConfig(config);
                if (config.COLORS && config.COLORS.length > 0) setActiveColor(config.COLORS[0]);
                if (config.BRUSH_SIZES && config.BRUSH_SIZES.length > 0) setBrushSize(config.BRUSH_SIZES[1] || config.BRUSH_SIZES[0]);
            }
        });
    }, []);

    const { COLORS, BRUSH_SIZES, TOOLS, SHAPES } = drawingConfig;

    const [canvasShapes, setCanvasShapes] = useState([]);
    const [selectedShapeId, setSelectedShapeId] = useState(null);
    const stampShapesRef = useRef([]);

    useEffect(() => {
        stampShapesRef.current = canvasShapes;
    }, [canvasShapes]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedShapeId) {
                    setCanvasShapes(prev => prev.filter(s => s.id !== selectedShapeId));
                    setSelectedShapeId(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedShapeId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctxRef.current = ctx;
        saveState();
        lastSavedDataUrlRef.current = canvas.toDataURL('image/png');
    }, []);

    useEffect(() => {
        if (!currentChild?.childId) return;

        syncLocalDataToFirebase(currentChild.childId);
        setSavedDrawings(getDrawings(currentChild.childId));

        const unsub = subscribeToDrawings(currentChild.childId, (freshDrawings) => {
            setSavedDrawings(freshDrawings);
        });

        return () => unsub();
    }, [currentChild]);

    const saveState = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setUndoStack(prev => [...prev.slice(-20), canvas.toDataURL()]);
    };

    const getCoords = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const stampShapesToCanvas = useCallback(() => {
        if (canvasShapes.length === 0) return;
        const ctx = ctxRef.current;
        if (!ctx) return;

        canvasShapes.forEach(shape => {
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;

            ctx.save();
            ctx.strokeStyle = shape.color;
            ctx.fillStyle = shape.color + '33';
            ctx.lineWidth = 4;

            const shapeDef = SHAPES[shape.key];

            if (shapeDef.isCircle || shapeDef.isOval) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, shape.width / 2 - 2, shape.height / 2 - 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else if (shapeDef.path) {
                const scaleX = shape.width / 100;
                const scaleY = shape.height / 100;
                ctx.translate(shape.x, shape.y);
                ctx.scale(scaleX, scaleY);
                const p = new Path2D(shapeDef.path);
                ctx.fill(p);
                ctx.stroke(p);
            }
            ctx.restore();
        });

        setCanvasShapes([]);
        setSelectedShapeId(null);
        saveState();
    }, [canvasShapes, SHAPES]);

    const startDraw = useCallback((e) => {
        e.preventDefault();
        const ctx = ctxRef.current;
        if (!ctx) return;
        const { x, y } = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(x, y);

        if (activeTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushSize * 3;
        } else if (activeTool === 'fill') {
            stampShapesToCanvas();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = activeColor;
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            ctx.fillRect(0, 0, rect.width, rect.height);
            saveState();
            return;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = brushSize;
        }

        setIsDrawing(true);
    }, [activeTool, activeColor, brushSize, stampShapesToCanvas]);

    const draw = useCallback((e) => {
        if (!isDrawing) return;
        e.preventDefault();

        if (stampShapesRef.current && stampShapesRef.current.length > 0) {
            stampShapesToCanvas();
            stampShapesRef.current = [];
        }

        const ctx = ctxRef.current;
        if (!ctx) return;
        const { x, y } = getCoords(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    }, [isDrawing, stampShapesToCanvas]);

    const endDraw = useCallback((e) => {
        if (!isDrawing) return;
        e?.preventDefault();
        const ctx = ctxRef.current;
        if (!ctx) return;
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
        setIsDrawing(false);
        saveState();
    }, [isDrawing]);

    const handleUndo = () => {
        if (canvasShapes.length > 0) {
            setCanvasShapes(prev => {
                const newShapes = [...prev];
                newShapes.pop();
                return newShapes;
            });
            return;
        }

        if (undoStack.length < 2) return;
        const newStack = [...undoStack];
        newStack.pop(); 
        const prevState = newStack[newStack.length - 1];
        setUndoStack(newStack);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.drawImage(img, 0, 0, rect.width, rect.height);
        };
        img.src = prevState;
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, rect.width, rect.height);
        setCanvasShapes([]);
        setSelectedShapeId(null);
        saveState();
    };

    const handleSave = () => {
        stampShapesToCanvas();

        if (!currentChild?.childId || !canvasRef.current) return;
        
        setTimeout(() => {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            
            if (dataUrl === lastSavedDataUrlRef.current) {
                toast(isArabic ? 'لا توجد تغييرات جديدة للحفظ' : 'No new changes to save', { icon: 'ℹ️' });
                return;
            }

            const saved = saveDrawing(currentChild.childId, dataUrl);
            if (saved) {
                lastSavedDataUrlRef.current = dataUrl;
                playSuccessSound();
                toast.success(isArabic ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
            }
        }, 50);
    };

    const handleDrawShape = (shapeKey) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height) * 0.3;

        const newShape = {
            id: Date.now().toString(),
            key: shapeKey,
            x: rect.width / 2 - size / 2,
            y: rect.height / 2 - size / 2,
            width: size,
            height: size,
            color: activeColor,
        };

        setCanvasShapes(prev => [...prev, newShape]);
        setSelectedShapeId(newShape.id);
        setShowShapes(false);
    };

    const handleDeleteDrawing = (drawingId) => {
        if (!currentChild?.childId) return;
        deleteDrawing(currentChild.childId, drawingId);
    };

    const handleLoadDrawing = (drawingData) => {
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.drawImage(img, 0, 0, rect.width, rect.height);
            saveState();
            setCanvasShapes([]);
            lastSavedDataUrlRef.current = drawingData;
        };
        img.src = drawingData;
        onGalleryClose();
    };

    const playSuccessSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [523, 659, 784].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
                gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
                osc.connect(gain).connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.1);
                osc.stop(ctx.currentTime + i * 0.1 + 0.2);
            });
        } catch { /* */ }
    };

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0C0D17]' : 'bg-[#F0F4FF]'}`}>
                <div className={`w-full max-w-[400px] p-8 rounded-[40px] border text-center space-y-6 shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-7xl animate-pulse">🎨</div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'سجل دخولك أولاً' : 'Please Log In'}</h2>
                    <Button radius="full" size="lg" className="w-full bg-indigo-500 text-white font-black" onPress={() => navigate('/child-login')}>
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-pink-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <MainNavbar userType="child" />

            <main className="relative max-w-[1100px] mx-auto px-3 sm:px-6 pt-20 sm:pt-24 pb-10">
                <ArtStudioHeader 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    savedDrawingsCount={savedDrawings.length} 
                    onGalleryOpen={onGalleryOpen} 
                    handleSave={handleSave} 
                />

                <div className="flex flex-col lg:flex-row gap-3">
                    <ArtStudioToolbar 
                        isDark={isDark} 
                        TOOLS={TOOLS} 
                        activeTool={activeTool} 
                        setActiveTool={setActiveTool} 
                        showShapes={showShapes} 
                        setShowShapes={setShowShapes} 
                        handleUndo={handleUndo} 
                        handleClear={handleClear} 
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1"
                    >
                        <ArtStudioShapesPanel 
                            showShapes={showShapes} 
                            isDark={isDark} 
                            isArabic={isArabic} 
                            SHAPES={SHAPES} 
                            handleDrawShape={handleDrawShape} 
                        />

                        <ArtStudioCanvas 
                            isDark={isDark} 
                            isArabic={isArabic} 
                            SHAPES={SHAPES} 
                            canvasShapes={canvasShapes} 
                            selectedShapeId={selectedShapeId} 
                            canvasRef={canvasRef} 
                            startDraw={startDraw} 
                            draw={draw} 
                            endDraw={endDraw} 
                            setCanvasShapes={setCanvasShapes} 
                            setSelectedShapeId={setSelectedShapeId} 
                        />
                    </motion.div>

                    <ArtStudioRightPanel 
                        isDark={isDark} 
                        COLORS={COLORS} 
                        BRUSH_SIZES={BRUSH_SIZES} 
                        activeColor={activeColor} 
                        setActiveColor={setActiveColor} 
                        setActiveTool={setActiveTool} 
                        brushSize={brushSize} 
                        setBrushSize={setBrushSize} 
                        showColorPicker={showColorPicker} 
                        setShowColorPicker={setShowColorPicker} 
                        customColor={customColor} 
                        setCustomColor={setCustomColor} 
                    />
                </div>
            </main>

            <ArtStudioGalleryModal 
                isGalleryOpen={isGalleryOpen} 
                onGalleryClose={onGalleryClose} 
                isDark={isDark} 
                isArabic={isArabic} 
                savedDrawings={savedDrawings} 
                handleLoadDrawing={handleLoadDrawing} 
                handleDeleteDrawing={handleDeleteDrawing} 
            />
        </div>
    );
}
