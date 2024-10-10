import React from 'react';

export const startDrawing = (
  e: React.MouseEvent<HTMLCanvasElement>,
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
  draw: (e: React.MouseEvent<HTMLCanvasElement>) => void
) => {
  setIsDrawing(true);
  draw(e);
};

export const stopDrawing = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsDrawing(false);
  const context = canvasRef.current?.getContext('2d');
  if (context) {
    context.beginPath();
  }
};

export const draw = (
  e: React.MouseEvent<HTMLCanvasElement>,
  isDrawing: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  selectedTool: 'brush' | 'blur',
  applyCircularGaussianBlur: (x: number, y: number) => void
) => {
  if (!isDrawing || !contextRef.current || !canvasRef.current) return;

  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  if (!context) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (selectedTool === 'brush') {
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  } else if (selectedTool === 'blur') {
    applyCircularGaussianBlur(x, y);
  }
};

export const applyCircularGaussianBlur = (
  centerX: number,
  centerY: number,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  brushSize: number,
  gaussianKernel: Float32Array
) => {
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
};
