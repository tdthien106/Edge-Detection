class EdgeDetector {
    constructor(canvas, threshold = 30) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.threshold = threshold;
    }

    setThreshold(threshold) {
        this.threshold = threshold;
    }

    detectEdges(imageData) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const data = imageData.data;
        
        // Tạo buffer để lưu ảnh xám
        const grayBuffer = new Uint8Array(width * height);
        
        // Chuyển ảnh sang grayscale
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            grayBuffer[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
        }
        
        // Áp dụng toán tử Sobel
        const output = new ImageData(width, height);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = y * width + x;
                
                // Tính gradient theo hướng x và y
                const gx = -grayBuffer[i - width - 1] - 2 * grayBuffer[i - 1] - grayBuffer[i + width - 1] +
                           grayBuffer[i - width + 1] + 2 * grayBuffer[i + 1] + grayBuffer[i + width + 1];
                
                const gy = -grayBuffer[i - width - 1] - 2 * grayBuffer[i - width] - grayBuffer[i - width + 1] +
                           grayBuffer[i + width - 1] + 2 * grayBuffer[i + width] + grayBuffer[i + width + 1];
                
                // Tính độ lớn gradient
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                const edgeValue = magnitude > this.threshold ? 255 : 0;
                
                // Gán giá trị cho output
                const outputIndex = (y * width + x) * 4;
                output.data[outputIndex] = edgeValue;
                output.data[outputIndex + 1] = edgeValue;
                output.data[outputIndex + 2] = edgeValue;
                output.data[outputIndex + 3] = 255; // Alpha
            }
        }
        
        return output;
    }
}