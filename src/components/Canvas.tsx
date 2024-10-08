'use client'

import React, {useRef, useEffect, useState, useMemo} from "react"

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
        const kernelSize = 15; // Adjust this for blur quality vs performance
            const sigma = 3; // Adjust this for blur spread
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

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
        draw(e)
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        const context = canvasRef.current?.getContext('2d')
        if (context) {
            context.beginPath()
        }
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !contextRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (!canvas || !context) return;

        const react = canvas.getBoundingClientRect()
        const x = e.clientX - react.left
        const y = e.clientY - react.top

        if ( selectedTool === 'brush' ) {
            context.lineTo(x, y)
            context.stroke()
            context.beginPath()
            context.moveTo(x, y)
        } else if ( selectedTool === 'blur' ) {
            applyCircularGaussianBlur(x, y)
        }


    }

    const applyCircularGaussianBlur = (centerX: number, centerY: number) => {
        if (!contextRef.current || !canvasRef.current) return;

        const radius = brushSize;
        const diameter = radius * 2;
        const kernelSize = Math.sqrt(gaussianKernel.length);
        const halfKernel = Math.floor(kernelSize / 2);

        const imageData = contextRef.current.getImageData(centerX - radius, centerY - radius, diameter, diameter);
        const pixels = imageData.data;
        const tempPixels = new Uint8ClampedArray(pixels.length);

        for (let y = 0; y < diameter; y++) {
            for (let x = 0; x < diameter; x++) {
                const dx = x - radius;
                const dy = y - radius;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= radius) {
                    let r = 0, g = 0, b = 0, a = 0;

                    for (let ky = 0; ky < kernelSize; ky++) {
                        for (let kx = 0; kx < kernelSize; kx++) {
                            const sampleX = Math.min(Math.max(x + kx - halfKernel, 0), diameter - 1);
                            const sampleY = Math.min(Math.max(y + ky - halfKernel, 0), diameter - 1);
                            const sampleIndex = (sampleY * diameter + sampleX) * 4;
                            const kernelValue = gaussianKernel[ky * kernelSize + kx];

                            r += pixels[sampleIndex] * kernelValue;
                            g += pixels[sampleIndex + 1] * kernelValue;
                            b += pixels[sampleIndex + 2] * kernelValue;
                            a += pixels[sampleIndex + 3] * kernelValue;
                        }
                    }

                    const pixelIndex = (y * diameter + x) * 4;
                    tempPixels[pixelIndex] = r;
                    tempPixels[pixelIndex + 1] = g;
                    tempPixels[pixelIndex + 2] = b;
                    tempPixels[pixelIndex + 3] = a;
                } else {
                    const pixelIndex = (y * diameter + x) * 4;
                    tempPixels[pixelIndex] = pixels[pixelIndex];
                    tempPixels[pixelIndex + 1] = pixels[pixelIndex + 1];
                    tempPixels[pixelIndex + 2] = pixels[pixelIndex + 2];
                    tempPixels[pixelIndex + 3] = pixels[pixelIndex + 3];
                }
            }
        }

        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = tempPixels[i];
        }

        contextRef.current.putImageData(imageData, centerX - radius, centerY - radius);
    }

    return (
        <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{imageRendering: "pixelated"}}
        />
    )
}

export default Canvas
