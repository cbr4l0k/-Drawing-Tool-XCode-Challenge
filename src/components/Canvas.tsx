'use client'

import React, {useRef, useEffect, useState} from "react"

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return;

        const context = canvas.getContext('2d')
        if (!context) return;
        
        canvas.width = window.innerWidth * 0.5
        canvas.height = window.innerHeight * 0.8

        var bg = new Image();
        bg.src = "https://github.com/cbr4l0k/cbr4l0k/blob/main/Extras/Images/banner.png?raw=true";
            bg.onload = () => {
            context.drawImage(bg,0,0)
        }

        context.lineJoin = 'bevel'
        context.lineCap = 'round'
        context.lineWidth = 7
        context.strokeStyle = '#3bff2b'
    }, [])

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
        if (!isDrawing) return;

        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (!canvas || !context) return;

        const react = canvas.getBoundingClientRect()
        const x = e.clientX - react.left
        const y = e.clientY - react.top

        context.lineTo(x, y)
        context.stroke()
        context.beginPath()
        context.moveTo(x, y)
    }

    return (
        <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        className="border border-gray-300 rounded-lg shadow-lg"
        />
    )
}

export default Canvas
