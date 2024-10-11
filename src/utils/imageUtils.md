# imageUtils.ts

The `imageUtils.ts` file contains utility functions for handling image-related operations in our drawing application. It includes functionality for uploading images to the canvas and saving the canvas content as an image.

## uploadImage Function

This function allows users to upload an image and draw it onto the canvas:

```typescript
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
```

This function does the following:

1. Creates a hidden file input element and triggers a click on it.
2. When a file is selected, it uses FileReader to read the image file.
3. Once the file is read, it creates an Image object and sets its source to the read file.
4. When the image loads, it clears the canvas and draws the image onto it.
5. The image is scaled to fit within the canvas while maintaining its aspect ratio.
6. The image is centered on the canvas.
7. After drawing, it calls an optional callback function.

## saveCanvas Function

This function saves the current state of the canvas as a PNG image:

```typescript
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
```

This function performs the following steps:

1. Converts the canvas content to a data URL representing a PNG image.
2. Creates a temporary anchor (`<a>`) element.
3. Sets the download attribute of the anchor to the desired file name.
4. Sets the href of the anchor to the data URL of the canvas.
5. Temporarily adds the anchor to the document body.
6. Programmatically clicks the anchor to trigger the download.
7. Removes the temporary anchor from the document.

These utility functions provide essential functionality for image manipulation in the drawing application, allowing users to incorporate existing images into their drawings and save their work as image files.
