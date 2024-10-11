import React from 'react';

export const uploadImage = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    callback?: () => void
): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file && canvasRef.current) {
            const reader = new FileReader();

            reader.onload = (event: ProgressEvent<FileReader>) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const context = canvas.getContext('2d');
                        if (context) {
                            context.clearRect(0, 0, canvas.width, canvas.height);

                            const scale = Math.min(
                                canvas.width / img.width,
                                canvas.height / img.height
                            );
                            const x = (canvas.width - img.width * scale) / 2;
                            const y = (canvas.height - img.height * scale) / 2;

                            context.drawImage(
                                img,
                                x,
                                y,
                                img.width * scale,
                                img.height * scale
                            );

                            if (callback) callback();
                        }
                    }
                };
                img.src = event.target?.result as string;
            };

            reader.readAsDataURL(file);
        }
    };

    input.click();
};

export const saveCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    fileName: string = 'drawing'
): void => {
    const canvas = canvasRef.current;
    if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
