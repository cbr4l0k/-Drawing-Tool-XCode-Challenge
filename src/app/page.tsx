'use client'

import React, { useState } from 'react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const DrawingApp: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<'brush' | 'blur'>('brush');
  const [selectedColor, setSelectedColor] = useState('#FF4C4C');
  const [brushSize, setBrushSize] = useState(15)
  const [minSlider, setMinSlider] = useState("1")
  const [maxSlider, setMaxSlider] = useState("100")

  const handleToolChange = (tool: 'brush' | 'blur') => {
    setSelectedTool(tool);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
      setBrushSize(size);
  };

  const handleMinSlider = (size: string) => {
      setMinSlider(size)
  }
  const handleMaxSlider = (size: string) => {
      setMaxSlider(size)
  }

  return (
    <div className="">
      <Canvas 
      selectedTool={selectedTool}
      selectedColor={selectedColor}
      brushSize={brushSize}
      />
      <Toolbar
        selectedTool={selectedTool}
        onToolChange={handleToolChange}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        brushSize={brushSize}
        onBrushSizeChange={handleBrushSizeChange}
        setMinSlider={handleMinSlider}
        minSlider={minSlider}
        setMaxSlider={handleMaxSlider}
        maxSlider={maxSlider}
        onUpload={()=>{console.log("onUpload")}}
        onSave={()=>{console.log("onSave")}}
        onUndo={()=>{console.log("onUndo")}}
        onRedo={()=>{console.log("onRedo")}}
      />
    </div>
  );
};

export default DrawingApp;
