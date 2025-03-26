class VideoController {
    constructor(video, canvas, edgeDetector) {
        this.video = video;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.edgeDetector = edgeDetector;
        this.animationId = null;
        
        this.initControls();
        this.initEventListeners();
    }

    initControls() {
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.edgeThreshold = document.getElementById('edgeThreshold');
    }

    initEventListeners() {
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.edgeThreshold.addEventListener('input', () => this.onThresholdChange());
        this.video.addEventListener('play', () => this.startEdgeDetection());
        this.video.addEventListener('pause', () => this.cancelEdgeDetection());
        this.video.addEventListener('ended', () => this.cancelEdgeDetection());
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    onThresholdChange() {
        this.edgeDetector.setThreshold(parseInt(this.edgeThreshold.value));
        if (!this.video.paused) {
            this.startEdgeDetection();
        }
    }

    processFrame() {
        if (this.video.paused || this.video.ended) return;
        
        // Vẽ frame video lên canvas
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Lấy dữ liệu hình ảnh từ canvas
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Áp dụng phát hiện biên cạnh
        const edgeData = this.edgeDetector.detectEdges(imageData);
        
        // Vẽ kết quả lên canvas
        this.ctx.putImageData(edgeData, 0, 0);
        
        // Lặp lại với frame tiếp theo
        this.animationId = requestAnimationFrame(() => this.processFrame());
    }

    startEdgeDetection() {
        this.cancelEdgeDetection();
        this.animationId = requestAnimationFrame(() => this.processFrame());
    }

    cancelEdgeDetection() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}