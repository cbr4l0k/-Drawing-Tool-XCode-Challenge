# Canvas

## V1.0

### Goal

This component should handle user interactions with the image, specifically:

- Start painting on click
- Cease painting when not clicked
- Detect mouse movement to match the user's stroke

The brush stroke should accurately follow the mouse cursor, creating a seamless
painting experience.

### Work Steps

1. Start with a Component

    In React.js, components are the building blocks for developing larger
    applications. Since this application uses TypeScript, it's good practice to
    explicitly declare that a function is a component. This is done by using `:
    React.FC` (React Function Component) between the function name and its
    definition.

   ```typescript
   const Canvas: React.FC = () => {
     // Component logic goes here
   }
   ```

2. Hooks Implementation

    As components, hooks are also a programmatic feature of React that let the
    developer tap into state and lifecycle features from functional components.
    By this logic, when using `useState`, or `useRef`, we are essentially
    connecting our component to React's internal state management and reference
    systems, allowing us to leverage these core functionalities without the
    need for class-based components.

   ```typescript
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
	```

3. Define the behaviour 

   The core functionality of the Canvas component is defined through several methods:

   ```typescript
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
     // Drawing logic
   }
   ```
   These methods control the drawing state and process, responding to user
   interactions with the canvas.

   The draw function is particularly crucial as it handles the actual drawing
   logic:


   ```typescript
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      context.lineTo(x, y)
      context.stroke()
      context.beginPath()
      context.moveTo(x, y)
    }
   ```

    This function first checks if drawing is active, then calculates the mouse
    position relative to the canvas. It uses the canvas context to draw a line to
    the new position, stroke it (make it visible), and then begin a new path from
    the current position. This creates a continuous line as the user moves the
    mouse, effectively simulating a drawing action.

4. Render the Canvas Element

    Finally, the component returns the actual canvas element, with event
    listeners attached to handle user interactions:

    ```typescript
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
    ```

    This defines how the canvas should be rendered and how it should respond to
    mouse events.

### Sources

- [HTML5 Canvas background image - Stack Overflow](https://stackoverflow.com/questions/14012768/html5-canvas-background-image)
