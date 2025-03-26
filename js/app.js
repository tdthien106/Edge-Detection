document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    // Khởi tạo EdgeDetector với ngưỡng mặc định
    const edgeDetector = new EdgeDetector(canvas);
    
    // Khởi tạo VideoController
    new VideoController(video, canvas, edgeDetector);
});