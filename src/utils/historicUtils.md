# historicUtils.ts

The `historicUtils.ts` file implements the undo/redo functionality for our drawing application. It manages a history of canvas states, allowing users to step backward and forward through their drawing actions.

## HistoryState Interface

This interface defines the structure of a single history state:

```typescript
interface HistoryState {
    canvasState: ImageData;
    timestamp: number;
}
```

Each state includes the canvas image data and a timestamp.

## CanvasHistory Class

This class manages the history of canvas states:

```typescript
import React from 'react';

const MAX_HISTORY_LENGTH = 50;

export class CanvasHistory {
    private undoStack: HistoryState[] = [];
    private redoStack: HistoryState[] = [];

    constructor(private canvasRef: React.RefObject<HTMLCanvasElement>) {}

    saveState(): void {
        const canvas = this.canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
        this.undoStack.push({ canvasState: currentState, timestamp: Date.now() });

        this.redoStack = [];

        if (this.undoStack.length > MAX_HISTORY_LENGTH) {
            this.undoStack.shift();
        }
    }

    undo(): void {
        if (this.undoStack.length <= 1) return;

        const currentState = this.undoStack.pop();
        if (currentState) {
            this.redoStack.push(currentState);
            this.applyState(this.undoStack[this.undoStack.length - 1].canvasState);
        }
    }

    redo(): void {
        const nextState = this.redoStack.pop();
        if (nextState) {
            this.undoStack.push(nextState);
            this.applyState(nextState.canvasState);
        }
    }

    private applyState(state: ImageData): void {
        const canvas = this.canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(state, 0, 0);
    }

    clearHistory(): void {
        this.undoStack = [];
        this.redoStack = [];
        this.saveState();
    }
}
```

Key methods of the CanvasHistory class:

1. `saveState()`: Captures the current canvas state and adds it to the undo stack. It also clears the redo stack and manages the maximum history length.

2. `undo()`: Moves the current state to the redo stack and applies the previous state from the undo stack.

3. `redo()`: Moves the next state from the redo stack to the undo stack and applies it to the canvas.

4. `applyState()`: A private method that applies a given state to the canvas.

5. `clearHistory()`: Resets both undo and redo stacks and saves the current state as the initial state.

## useCanvasHistory Hook

This custom React hook provides an easy way to use the CanvasHistory class in functional components:

```typescript
export function useCanvasHistory(canvasRef: React.RefObject<HTMLCanvasElement>) {
    const [history] = React.useState(() => new CanvasHistory(canvasRef));
    return history;
}
```

This hook creates a CanvasHistory instance and returns it. The use of `useState` with a function ensures that the CanvasHistory instance is only created once for the lifetime of the component.

Usage of this hook allows components to easily integrate undo/redo functionality without managing the complexity of state history themselves.
