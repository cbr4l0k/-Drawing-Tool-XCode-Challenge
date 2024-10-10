'use client'

import React, {useRef, useEffect, useState, useMemo} from "react"
import { startDrawing, stopDrawing, draw, applyCircularGaussianBlur } from '@/utils/drawingUtils';

interface CanvasProps {
    selectedTool: 'brush' | 'blur';
    selectedColor: string;
    brushSize: number;
}

const Canvas: React.FC<CanvasProps> = ({
    selectedTool,
    selectedColor,
    brushSize,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)

    const gaussianKernel = useMemo(() => {
        const kernelSize = 15; // This as a slider can be implemented as a future improvement
            const sigma = 3; // This as a slider can be implemented as a future improvement
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

        // Normalize the kernel
        for (let i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }

        return kernel;
    }, []);


    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return;

        const context = canvas.getContext('2d')
        if (!context) return;

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight * 0.8

        context.lineJoin = 'bevel'
        context.lineCap = 'round'

        contextRef.current = context

    }, [])

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.lineWidth = brushSize
            contextRef.current.strokeStyle = selectedColor
        }
    }, [selectedColor, brushSize])

        const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        startDrawing(e, setIsDrawing, handleDraw);
    }

    const handleStopDrawing = () => {
        stopDrawing(canvasRef, setIsDrawing);
    }

    const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        draw(e, isDrawing, canvasRef, contextRef, selectedTool, (x, y) => {
            applyCircularGaussianBlur(x, y, contextRef, canvasRef, brushSize, gaussianKernel);
        });
    }



    return (
        <canvas
        ref={canvasRef}
        onMouseDown={handleStartDrawing}
        onMouseUp={handleStopDrawing}
        onMouseOut={handleStopDrawing}
        onMouseMove={handleDraw}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{imageRendering: "pixelated"}}
        />
    )
}

export default Canvas
