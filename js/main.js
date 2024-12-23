// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

let originalFile = null;

// 上传区域事件处理
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 拖放处理
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.querySelector('.upload-box').style.borderColor = '#0071e3';
    uploadArea.querySelector('.upload-box').style.backgroundColor = 'rgba(0, 113, 227, 0.05)';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.querySelector('.upload-box').style.borderColor = '#86868b';
    uploadArea.querySelector('.upload-box').style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.querySelector('.upload-box').style.borderColor = '#86868b';
    uploadArea.querySelector('.upload-box').style.backgroundColor = 'transparent';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
        handleFile(file);
    }
});

// 文件选择处理
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// 质量滑块处理
qualityInput.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    if (originalFile) {
        compressImage(originalFile, e.target.value / 100);
    }
});

// 文件处理函数
function handleFile(file) {
    originalFile = file;
    originalSize.textContent = formatFileSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        compressImage(file, qualityInput.value / 100);
        previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// 图片压缩函数
function compressImage(file, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 压缩并显示
            canvas.toBlob((blob) => {
                compressedPreview.src = URL.createObjectURL(blob);
                compressedSize.textContent = formatFileSize(blob.size);
                
                // 更新下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `compressed_${originalFile.name}`;
                    link.click();
                };
            }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 文件大小格式化函数
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
}); 