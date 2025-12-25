const fs = require('fs');
const path = require('path');

let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.error('错误: 未安装 sharp 库');
    console.error('请运行: npm install sharp');
    process.exit(1);
}

const sourceDir = path.join(__dirname, 'JennieKim_430px');

// 获取所有 WebP 图片
function getWebPFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && item.toLowerCase().endsWith('.webp')) {
            files.push(fullPath);
        }
    });
    
    return files;
}

// 压缩图片
async function compressImage(inputPath, outputPath, quality = 60, maxWidth = 800) {
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // 如果图片宽度超过 maxWidth，则调整大小
        let transform = image;
        if (metadata.width > maxWidth) {
            const ratio = maxWidth / metadata.width;
            const newHeight = Math.round(metadata.height * ratio);
            transform = image.resize(maxWidth, newHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // 使用更低的压缩质量
        await transform.webp({
            quality: quality,
            effort: 6  // 更高的压缩努力程度
        }).toFile(outputPath);

        return true;
    } catch (error) {
        console.error(`压缩失败: ${inputPath}`, error.message);
        return false;
    }
}

// 获取文件大小
function getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2); // KB
}

// 主函数
async function main() {
    console.log('开始查找 WebP 图片...');
    const webpFiles = getWebPFiles(sourceDir);
    console.log(`找到 ${webpFiles.length} 张 WebP 图片\n`);

    let successCount = 0;
    let failCount = 0;
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    for (const webpPath of webpFiles) {
        const basename = path.basename(webpPath);
        const originalSize = getFileSize(webpPath);
        totalOriginalSize += parseFloat(originalSize);

        process.stdout.write(`压缩中: ${basename} (${originalSize} KB) ... `);

        // 创建临时文件
        const tempPath = webpPath + '.tmp';
        const success = await compressImage(webpPath, tempPath, 55, 600);

        if (success) {
            const compressedSize = getFileSize(tempPath);
            totalCompressedSize += parseFloat(compressedSize);
            const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

            // 替换原文件
            fs.unlinkSync(webpPath);
            fs.renameSync(tempPath, webpPath);

            successCount++;
            console.log(`✓ (${compressedSize} KB, 节省 ${savings}%)`);
        } else {
            failCount++;
            console.log('✗');
            // 清理临时文件
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    }

    const totalSavings = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);

    console.log('\n压缩完成!');
    console.log(`成功: ${successCount} 张`);
    console.log(`失败: ${failCount} 张`);
    console.log(`原始总大小: ${totalOriginalSize.toFixed(2)} KB (${(totalOriginalSize/1024).toFixed(2)} MB)`);
    console.log(`压缩后总大小: ${totalCompressedSize.toFixed(2)} KB (${(totalCompressedSize/1024).toFixed(2)} MB)`);
    console.log(`总节省: ${totalSavings}%`);
}

main().catch(console.error);