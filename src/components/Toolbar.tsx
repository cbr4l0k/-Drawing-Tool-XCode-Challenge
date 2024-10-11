import { CanvasHistory } from '@/utils/historicUtil';
import React, { useEffect } from 'react';

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
    canvasHistory: CanvasHistory,
}

const Toolbar: React.FC<ToolbarProps> = ({ 
    selectedTool, 
    onToolChange, 
    selectedColor, 
    onColorChange,
    brushSize,
    onBrushSizeChange,
    onUpload,
    onSave,
    onUndo,
    onRedo,
    minSlider,
    setMinSlider,
    maxSlider,
    setMaxSlider,
    canvasHistory,
}) => {
    const colors = ['#FF4C4C', '#FFE629', '#10F549', '#35A4FF', '#A467FF', '#000000', '#FFFFFF'];

    useEffect(() =>{
        if (selectedTool === 'brush') {
            setMinSlider("1");
            setMaxSlider("100");
        } else if (selectedTool === 'blur') {
            setMinSlider("1");
            setMaxSlider("20");
            if (brushSize > 20) onBrushSizeChange(20)
        }
    }, [selectedTool, brushSize])

    return (
        <div 
        className="flex flex-col space-y-6 p-6 bg-gray-750 rounded-lg shadow-lg"
        style={{ backgroundColor: "#23252a" }}
        >
        {/* Tool floor */}
        <div>
        <h3 className="text-md font-semibold mb-3 text-gray-300">Tool</h3>
        <div className="flex space-x-3">
        <button
        className={`p-2 rounded ${
            selectedTool === 'brush' ? 'bg-gray-800 text-gray-200 font-bold' : 'bg-gray-700'
        }`}
        onClick={() => onToolChange('brush')}
        >
        Brush
        </button>
        <button
        className={`p-2 rounded ${
            selectedTool === 'blur' ? 'bg-gray-800 text-gray-200 font-bold' : 'bg-gray-700'
        }`}
        onClick={() => onToolChange('blur')}
        >
        Blur
        </button>
        </div>
        </div>

        {/* Color floor */}
        {
            selectedTool === 'brush' ? (
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
            ) : null
        }

        {/* Size floor */}
        <div>
        <div className='mb-3'>
        <h3 className='text-md font-semibold text-gray-300'>Size
        </h3>
          <span className="text-gray-300 w-8 text-center text-xs"> {brushSize} px</span>
        </div>
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
        </div>

        {/* Size floor */}
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
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.33333 13.6667L6 10.3333L9.33333 7M6 10.3333H15.1667C16.0507 10.3333 16.8986 10.6845 17.5237 11.3096C18.1488 11.9348 18.5 12.7826 18.5 13.6667C18.5 14.5507 18.1488 15.3986 17.5237 16.0237C16.8986 16.6488 16.0507 17 15.1667 17H14.3333"/></svg>
        </button>
        <button
          className="p-2 bg-gray-700 rounded active:bg-gray-800 active:text-gray-200 font-bold transition-colors text-gray-300 text-sm flex-1/2"
          onClick={onRedo}
        >
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.6667 13.6667L18 10.3333L14.6667 7M18 10.3333H8.83333C7.94928 10.3333 7.10143 10.6845 6.47631 11.3096C5.85119 11.9348 5.5 12.7826 5.5 13.6667C5.5 14.5507 5.85119 15.3986 6.47631 16.0237C7.10143 16.6488 7.94928 17 8.83333 17H9.66667"/></svg>
        </button>
      </div>
        </div>
    );
};

export default Toolbar;
