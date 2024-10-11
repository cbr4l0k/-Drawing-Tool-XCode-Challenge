# Toolbar.tsx

The `Toolbar` component provides the user interface for selecting drawing tools, colors, and adjusting brush sizes in our drawing application. It also includes buttons for image upload, saving, and undo/redo functionality.

## Component Structure

The `Toolbar` is a functional component that takes several props to manage its state and interact with the main application:

```typescript
interface ToolbarProps {
    selectedTool: 'brush' | 'blur';
    onToolChange: (tool: 'brush' | 'blur') => void;
    selectedColor: string;
    onColorChange: (color: string) => void;
    brushSize: number;
    onBrushSizeChange: (size: number) => void;
    onUpload: () => void;
    onSave: () => void;
    onUndo: () => void;
    onRedo: () => void;
    minSlider: string;
    setMinSlider: (size: string) => void;
    maxSlider: string;
    setMaxSlider: (size: string) => void;
}
```

## Tool Selection

The toolbar allows users to switch between brush and blur tools:

```typescript
<div className="flex space-x-3">
    <button
    className={`p-2 rounded ${
        selectedTool === 'brush' ? 'bg-gray-700 text-gray-200 font-bold' : 'bg-gray-800'
    }`}
    onClick={() => onToolChange('brush')}
    >
    Brush
    </button>
    <button
    className={`p-2 rounded ${
        selectedTool === 'blur' ? 'bg-gray-700 text-gray-200 font-bold' : 'bg-gray-800'
    }`}
    onClick={() => onToolChange('blur')}
    >
    Blur
    </button>
</div>
```

## Color Selection

When the brush tool is selected, users can choose from a predefined set of colors:

```typescript
const colors = ['#FF4C4C', '#FFE629', '#10F549', '#35A4FF', '#A467FF', '#000000', '#FFFFFF'];

{selectedTool === 'brush' && (
    <div>
    <h3 className="text-md font-semibold mb-3 text-gray-300">Color</h3>
    <div className="flex space-x-3">
    {colors.map((color) => (
        <button
        key={color}
        className={`w-8 h-8 rounded-xl border-2 ${
            selectedColor === color ? (color === '#FFFFFF' ? 'border-black': 'border-white') : 'border-transparent'
        }`}
        style={{ backgroundColor: color }}
        onClick={() => onColorChange(color)}
        />
    ))}
    </div> 
    </div>
)}
```

## Brush Size Adjustment

Users can adjust the brush size using a range input:

```typescript
<div className="flex items-center space-x-3">
    <input
    type="range"
    min={minSlider}
    max={maxSlider}
    value={brushSize}
    onChange={(e) => onBrushSizeChange(Number(e.target.value))}
    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
    />
    <span className="text-gray-300 w-8 text-center">{brushSize}</span>
</div>
```

## Additional Functionality

The toolbar includes buttons for uploading images, saving the canvas, and undo/redo operations:

```typescript
<div className="flex space-x-2">
    <button
    className="p-2 bg-blue-700 rounded active:bg-blue-800 active:text-gray-200 font-bold transition-colors text-gray-300 text-sm flex-1/2"
    onClick={onUpload}
    >
    Upload
    </button>
    <button
    className="p-2 bg-blue-700 rounded active:bg-blue-800 active:text-gray-200 font-bold transition-colors text-gray-300 text-sm flex-1/2"
    onClick={onSave}
    >
    Save
    </button>
    <button
    className="p-2 bg-gray-700 rounded active:bg-gray-800 active:text-gray-200 font-bold transition-colors text-gray-300 text-sm flex-1/2"
    onClick={onUndo}
    >
    <svg><!-- Undo icon SVG --></svg>
    </button>
    <button
    className="p-2 bg-gray-700 rounded active:bg-gray-800 active:text-gray-200 font-bold transition-colors text-gray-300 text-sm flex-1/2"
    onClick={onRedo}
    >
    <svg><!-- Redo icon SVG --></svg>
    </button>
</div>
```

## Dynamic Behavior

The toolbar dynamically adjusts its behavior based on the selected tool. For example, it changes the brush size range and hides the color selection when the blur tool is active:

```typescript
useEffect(() =>{
    if (selectedTool === 'brush') {
        setMinSlider("1");
        setMaxSlider("100");
    } else if (selectedTool === 'blur') {
        setMinSlider("1");
        setMaxSlider("20");
        if (brushSize > 20) onBrushSizeChange(20)
    }
}, [selectedTool, brushSize, setMinSlider, setMaxSlider, onBrushSizeChange]);
```

This effect ensures that the brush size is appropriate for each tool and adjusts the slider range accordingly.
