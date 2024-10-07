'use client'

import React, { useState } from 'react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const DrawingApp: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<'brush' | 'blur'>('brush');
  const [selectedColor, setSelectedColor] = useState('#FF4C4C');
  const [brushSize, setBrushSize] = useState(15)

  const handleToolChange = (tool: 'brush' | 'blur') => {
    setSelectedTool(tool);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
      setBrushSize(size);
  };

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
      />
    </div>
  );
};

export default DrawingApp;
