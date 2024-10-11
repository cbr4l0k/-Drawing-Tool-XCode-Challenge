# Canvas.tsx 

The `Canvas` component is the heart of our drawing application. It provides the main area where users can draw and create their artwork. Let's break down the key aspects of this component.

## Component Structure

The `Canvas` component is a functional component that uses React's `forwardRef` to allow parent components to access the canvas element directly.

```typescript
const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({
    selectedTool,
    selectedColor,
    brushSize,
    canvasHistory,
}, ref) => {
    // Component logic here
});
```

## State Management

The component uses several state variables to manage drawing:

```typescript
const [isDrawing, setIsDrawing] = useState(false);
const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
const canvasRef = React.useRef<HTMLCanvasElement>(null);
```

- `isDrawing`: Tracks whether the user is currently drawing.
- `contextRef`: Holds a reference to the canvas rendering context.
- `canvasRef`: Holds a reference to the canvas element itself.

## Canvas Setup

The canvas is set up when the component mounts:

```typescript
useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;

    context.lineJoin = 'bevel';
    context.lineCap = 'round';

    contextRef.current = context;

    canvasHistory.clearHistory(); // Initialize history with blank canvas
}, [canvasHistory])
```

This code sets the canvas size, configures the drawing context, and initializes the canvas history.

## Drawing Functionality

The main drawing functionality is handled by three functions:

1. `handleStartDrawing`: Initiates drawing when the user presses the mouse button.
2. `handleStopDrawing`: Stops drawing when the user releases the mouse button.
3. `handleDraw`: Continues drawing as the user moves the mouse.

These functions use utility functions from `drawingUtils.ts`:

```typescript
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
```

## Rendering

The component renders a canvas element with event listeners for mouse interactions:

```typescript
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
```

This setup allows the canvas to respond to user interactions and create drawings based on the selected tool and settings.

## Conclusion

The `Canvas` component manages the core drawing functionality of the application. It handles user interactions, manages the drawing state, and utilizes utility functions to implement different drawing tools. The use of React hooks and refs allows for efficient updates and direct manipulation of the canvas element.
