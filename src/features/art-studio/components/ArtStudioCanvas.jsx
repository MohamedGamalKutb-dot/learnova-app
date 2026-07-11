import { Rnd } from 'react-rnd';

export default function ArtStudioCanvas({ isDark, isArabic, SHAPES, canvasShapes, selectedShapeId, canvasRef, startDraw, draw, endDraw, setCanvasShapes, setSelectedShapeId }) {
    return (
        <div 
            className={`relative rounded-[20px] border overflow-hidden shadow-2xl ${isDark ? 'border-white/10' : 'border-pink-100'}`}
            onClick={(e) => {
                // Deselect shape if clicking directly on canvas container background (not the shape)
                if (e.target === canvasRef.current) {
                    setSelectedShapeId(null);
                }
            }}
        >
            {/* Floating Shapes */}
            {canvasShapes.map(shape => (
                <Rnd
                    key={shape.id}
                    size={{ width: shape.width, height: shape.height }}
                    position={{ x: shape.x, y: shape.y }}
                    onDragStop={(e, d) => {
                        setCanvasShapes(prev => prev.map(s => s.id === shape.id ? { ...s, x: d.x, y: d.y } : s));
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        setCanvasShapes(prev => prev.map(s => s.id === shape.id ? {
                            ...s,
                            width: ref.offsetWidth,
                            height: ref.offsetHeight,
                            ...position
                        } : s));
                    }}
                    onClick={() => setSelectedShapeId(shape.id)}
                    bounds="parent"
                    className={`absolute z-10 ${selectedShapeId === shape.id ? 'ring-2 ring-pink-500 ring-dashed cursor-move' : 'cursor-pointer'}`}
                >
                    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
                        {SHAPES[shape.key].isCircle || SHAPES[shape.key].isOval ? (
                            <ellipse cx="50" cy="50" rx="45" ry="45" fill={`${shape.color}33`} stroke={shape.color} strokeWidth="4" />
                        ) : (
                            <path d={SHAPES[shape.key].path} fill={`${shape.color}33`} stroke={shape.color} strokeWidth="4" />
                        )}
                    </svg>

                    {/* Visual Resizing Handles (only shown when selected) */}
                    {selectedShapeId === shape.id && (
                        <>
                            {/* Corners */}
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            {/* Edges */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-pink-500 rounded-full border border-white z-20 pointer-events-none" />
                            
                            {/* Delete Shape Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCanvasShapes(prev => prev.filter(s => s.id !== shape.id));
                                    setSelectedShapeId(null);
                                }}
                                className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg border border-white z-30 cursor-pointer pointer-events-auto"
                                title={isArabic ? 'حذف الشكل' : 'Delete Shape'}
                            >
                                ❌
                            </button>
                        </>
                    )}
                </Rnd>
            ))}

            <canvas
                ref={canvasRef}
                className="w-full aspect-[16/9] sm:aspect-[16/10] cursor-crosshair touch-none bg-white block"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
            />
        </div>
    );
}
