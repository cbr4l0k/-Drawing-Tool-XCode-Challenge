# drawingUtils.ts

The `drawingUtils.ts` file contains essential functions for handling drawing operations in our application. It includes functionality for both the brush and blur tools.

## Core Drawing Functions

### startDrawing

This function initiates the drawing process when the user starts interacting with the canvas:

```typescript
export const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement>,
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    draw: (e: React.MouseEvent<HTMLCanvasElement>) => void
) => {
    setIsDrawing(true);
    draw(e);
};
```

### stopDrawing

This function ends the drawing process and resets the drawing path:

```typescript
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
```

### draw

The main drawing function that handles both brush and blur tools:

```typescript
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
```

## Blur Tool Implementation

### applyCircularGaussianBlur

This function applies a circular Gaussian blur effect to the canvas:

```typescript
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

    // Blur calculation logic...

    contextRef.current.putImageData(imageData, centerX - radius, centerY - radius);
};
```

This function performs these steps:
1. Extracts a circular region from the canvas.
2. Applies the Gaussian blur kernel to each pixel in the region.
3. Ensures the blur effect is circular by checking the distance from the center.
4. Applies the blurred result back to the canvas.

## Performance Considerations

The blur tool uses a pre-calculated Gaussian kernel for efficiency:

```typescript
const gaussianKernel = useMemo(() => {
    const kernelSize = 15;
    const sigma = 3;
    const kernel = new Float32Array(kernelSize * kernelSize);
    // Kernel calculation logic...
    return kernel;
}, []);
```

By using `useMemo`, we ensure the kernel is only calculated once and reused for all blur operations, significantly improving performance for repeated blur actions.
