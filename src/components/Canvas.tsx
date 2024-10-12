'use client'

import React, { useEffect, useState, useMemo, forwardRef, useImperativeHandle } from "react"
import { startDrawing, stopDrawing, draw, applyCircularGaussianBlur } from '@/utils/drawingUtils';
import { CanvasHistory } from '@/utils/historicUtils';

interface CanvasProps {
    selectedTool: 'brush' | 'blur';
    selectedColor: string;
    brushSize: number;
    canvasHistory: CanvasHistory;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({
    selectedTool,
    selectedColor,
    brushSize,
    canvasHistory,
}, ref) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const cursorCanvasRef = React.useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    const gaussianKernel = useMemo(() => {
        const kernelSize = 15;
        const sigma = 3;
        const kernel = new Float32Array(kernelSize * kernelSize);
        const twoSigmaSquare = 2 * sigma * sigma;
        let sum = 0;

        for (let y = 0; y < kernelSize; y++) {
            for (let x = 0; x < kernelSize; x++) {
                const dx = x - (kernelSize - 1) / 2;
                const dy = y - (kernelSize - 1) / 2;
                const exponent = -(dx * dx + dy * dy) / twoSigmaSquare;
                const value = Math.exp(exponent) / (Math.PI * twoSigmaSquare);
                kernel[y * kernelSize + x] = value;
                sum += value;
            }
        }

        for (let i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }

        return kernel;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const cursorCanvas = cursorCanvasRef.current;
        if (!canvas || !cursorCanvas) return;

        const context = canvas.getContext('2d');
        const cursorContext = cursorCanvas.getContext('2d');
        if (!context || !cursorContext) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.8;
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight * 0.8;

        context.lineJoin = 'bevel';
        context.lineCap = 'round';

        contextRef.current = context;

        canvasHistory.clearHistory();
    }, [canvasHistory])

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.lineWidth = brushSize;
            contextRef.current.strokeStyle = selectedColor;
        }
    }, [selectedColor, brushSize]);

    const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        startDrawing(e, setIsDrawing, handleDraw);
    }

    const handleStopDrawing = () => {
        stopDrawing(canvasRef, setIsDrawing);
        canvasHistory.saveState(); 
    }

    const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        draw(e, isDrawing, canvasRef, contextRef, selectedTool, (x, y) => {
            applyCircularGaussianBlur(x, y, contextRef, canvasRef, brushSize, gaussianKernel);
        });
    }

    const updateCursorPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        setCursorPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }

    useEffect(() => {
        const cursorCanvas = cursorCanvasRef.current;
        if (!cursorCanvas) return;

        const cursorContext = cursorCanvas.getContext('2d');
        if (!cursorContext) return;

        cursorContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        cursorContext.beginPath();
        cursorContext.arc(cursorPosition.x, cursorPosition.y, selectedTool === 'brush' ? brushSize / 2 : brushSize, 0, Math.PI * 2);
        cursorContext.strokeStyle = selectedTool === 'brush' ? selectedColor : 'rgba(255, 255, 255, 0.5)';
        cursorContext.stroke();
    }, [cursorPosition, brushSize, selectedColor, selectedTool]);

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                onMouseDown={handleStartDrawing}
                onMouseUp={handleStopDrawing}
                onMouseOut={handleStopDrawing}
                onMouseMove={(e) => {
                    handleDraw(e);
                    updateCursorPosition(e);
                }}
                className="border border-gray-300 rounded-lg shadow-lg"
                style={{imageRendering: "pixelated"}}
            />
            <canvas
                ref={cursorCanvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none'
                }}
            />
        </div>
    )
})

Canvas.displayName = 'Canvas';

export default Canvas
