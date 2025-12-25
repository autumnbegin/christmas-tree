// Jennie Kim 照片库管理
// 存储所有照片路径和相关信息

const PhotoGallery = {
    // 照片基础路径
    basePath: './JennieKim_430px/',
    
    // 所有照片文件列表
    photos: [
        '21ddf7abb546aa312138781a1be82db1.webp',
        'IMG_0423.webp',
        'IMG_0425.webp',
        'IMG_0426.webp',
        'IMG_0430.webp',
        'IMG_0431.webp',
        'IMG_0432.webp',
        'IMG_0434.webp',
        'IMG_0436.webp',
        'IMG_0437.webp',
        'IMG_0439.webp',
        'IMG_0441.webp',
        'IMG_0443.webp',
        'IMG_0444.webp',
        'IMG_0448.webp',
        'IMG_0449.webp',
        'IMG_0450.webp',
        'IMG_0451.webp',
        'IMG_0452.webp',
        'IMG_0453.webp',
        'IMG_0454.webp',
        'IMG_0455.webp',
        'IMG_0456.webp',
        'IMG_0457.webp',
        'IMG_0471.webp',
        'IMG_0472.webp',
        'IMG_0473.webp',
        'IMG_0489.webp',
        'IMG_0490.webp',
        'IMG_0496.webp',
        'IMG_0498.webp',
        'IMG_0500.webp',
        'IMG_0501.webp',
        'IMG_0502.webp',
        'IMG_0503.webp',
        'IMG_0504.webp',
        'IMG_0505.webp',
        'IMG_0506.webp',
        'IMG_0507.webp',
        'IMG_0508.webp',
        'IMG_0511.webp',
        'IMG_0513.webp',
        'IMG_0515.webp',
        'IMG_0517.webp',
        'IMG_0538.webp',
        'IMG_0540.webp',
        'IMG_0557.webp',
        'IMG_0562.webp',
        'IMG_0563.webp',
        'IMG_0571.webp',
        'IMG_0576.webp',
        'IMG_0580.webp',
        'IMG_0581.webp',
        'IMG_0582.webp',
        'IMG_0590.webp',
        'IMG_0591.webp',
        'IMG_0592.webp',
        'IMG_0594.webp',
        'IMG_0595.webp',
        'IMG_0596.webp',
        'IMG_0611.webp',
        'IMG_0622.webp',
        'IMG_0623.webp',
        'IMG_0624.webp',
        'IMG_0625.webp',
        'IMG_0626.webp',
        'IMG_0628.webp',
        'IMG_0629.webp',
        'IMG_0630.webp',
        'IMG_0631.webp',
        'IMG_0632.webp',
        'IMG_0633.webp',
        'IMG_0634.webp',
        'IMG_0635.webp',
        'IMG_0636.webp',
        'IMG_0637.webp',
        'IMG_0638.webp',
        'IMG_0639.webp',
        'IMG_0640.webp',
        'IMG_0641.webp',
        'IMG_0643.webp',
        'IMG_0644.webp',
        'IMG_0645.webp',
        'IMG_0647.webp',
        'IMG_0648.webp',
        'IMG_0649.webp',
        'IMG_0650.webp',
        'IMG_0651.webp',
        'IMG_0652.webp',
        'IMG_0653.webp',
        'IMG_0654.webp',
        'IMG_0655.webp',
        'IMG_0656.webp',
        'IMG_0657.webp',
        'IMG_0658.webp',
        'IMG_0659.webp',
        'IMG_0660.webp',
        'IMG_0661.webp',
        'IMG_0678.webp',
        'IMG_0680.webp'
    ],
    
    // 获取随机照片路径
    getRandomPhoto() {
        const index = Math.floor(Math.random() * this.photos.length);
        return this.basePath + this.photos[index];
    },
    
    // 获取指定索引的照片路径
    getPhoto(index) {
        if (index >= 0 && index < this.photos.length) {
            return this.basePath + this.photos[index];
        }
        return null;
    },
    
    // 获取所有照片路径
    getAllPhotos() {
        return this.photos.map(photo => this.basePath + photo);
    },
    
    // 获取照片总数
    getPhotoCount() {
        return this.photos.length;
    },
    
    // 打乱照片顺序
    shufflePhotos() {
        for (let i = this.photos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.photos[i], this.photos[j]] = [this.photos[j], this.photos[i]];
        }
    }
};

// 图片浏览管理器
PhotoGallery.viewManager = {
    currentIndex: 0,
    viewedPhotos: [],
    isRandomMode: false,
    
    // 初始化浏览管理器
    init() {
        this.currentIndex = 0;
        this.viewedPhotos = [];
        this.isRandomMode = false;
        // 初始时打乱顺序，但保持浏览顺序
        PhotoGallery.shufflePhotos();
    },
    
    // 获取下一张要查看的图片
    getNextPhoto() {
        if (this.isRandomMode) {
            // 随机模式：从未查看的图片中随机选择
            const unviewed = this.getUnviewedPhotos();
            if (unviewed.length === 0) {
                // 所有图片都看过了，重新开始
                this.viewedPhotos = [];
                return PhotoGallery.getRandomPhoto();
            }
            const randomIndex = Math.floor(Math.random() * unviewed.length);
            const photo = unviewed[randomIndex];
            this.viewedPhotos.push(photo);
            return photo;
        } else {
            // 顺序模式：按顺序浏览
            if (this.currentIndex >= PhotoGallery.photos.length) {
                this.currentIndex = 0; // 循环到开头
            }
            const photo = PhotoGallery.getPhoto(this.currentIndex);
            this.currentIndex++;
            return photo;
        }
    },
    
    // 获取未查看的图片
    getUnviewedPhotos() {
        return PhotoGallery.getAllPhotos().filter(photo => 
            !this.viewedPhotos.includes(photo)
        );
    },
    
    // 切换浏览模式
    toggleMode() {
        this.isRandomMode = !this.isRandomMode;
        console.log(`切换到${this.isRandomMode ? '随机' : '顺序'}浏览模式`);
    },
    
    // 重置浏览状态
    reset() {
        this.currentIndex = 0;
        this.viewedPhotos = [];
    },
    
    // 获取浏览进度
    getProgress() {
        return {
            current: this.currentIndex,
            total: PhotoGallery.photos.length,
            viewed: this.viewedPhotos.length,
            remaining: this.getUnviewedPhotos().length
        };
    }
};

// 初始化浏览管理器
PhotoGallery.viewManager.init();

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoGallery;
}