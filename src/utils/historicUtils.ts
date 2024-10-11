import React from 'react';

const MAX_HISTORY_LENGTH = 50;

interface HistoryState {
    canvasState: ImageData;
    timestamp: number;
}

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

export function useCanvasHistory(canvasRef: React.RefObject<HTMLCanvasElement>) {
    const [history] = React.useState(() => new CanvasHistory(canvasRef));
    return history;
}
