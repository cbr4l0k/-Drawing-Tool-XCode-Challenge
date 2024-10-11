'use client'

import React, { useState, useRef } from 'react';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import { uploadImage, saveCanvas } from '@/utils/imageUtils';
import { useCanvasHistory } from '@/utils/historicUtils';

const DrawingApp: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<'brush' | 'blur'>('brush');
    const [selectedColor, setSelectedColor] = useState('#FF4C4C');
    const [brushSize, setBrushSize] = useState(15);
    const [minSlider, setMinSlider] = useState("1");
    const [maxSlider, setMaxSlider] = useState("100");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasHistory = useCanvasHistory(canvasRef);

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
        setMinSlider(size);
    };

    const handleMaxSlider = (size: string) => {
        setMaxSlider(size);
    };

    const handleSave = () => {
        if (canvasRef.current) {
            saveCanvas(canvasRef, 'my-drawing');
            console.log("Canvas saved successfully");
        }
    };

    const handleUpload = () => {
        if (canvasRef.current) {
            uploadImage(canvasRef, () => {
                console.log("Image uploaded successfully");
                canvasHistory.saveState();
            });
        }
    };

    const handleUndo = () => {
        canvasHistory.undo();
    };

    const handleRedo = () => {
        canvasHistory.redo();
    };

    return (
        <div className="">
        <Canvas 
        ref={canvasRef}
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        brushSize={brushSize}
        canvasHistory={canvasHistory}
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
        onUpload={handleUpload}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canvasHistory={canvasHistory}
        />
        </div>
    );
};

export default DrawingApp;
