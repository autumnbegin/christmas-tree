const fs = require('fs');
const path = require('path');

// 检查是否安装了 sharp
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.error('错误: 未安装 sharp 库');
    console.error('请运行: npm install sharp');
    process.exit(1);
}

const sourceDir = path.join(__dirname, 'JennieKim_430px');
const outputDir = path.join(__dirname, 'JennieKim_430px');

// 获取所有 JPG 图片
function getJpgFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && (item.toLowerCase().endsWith('.jpg') || item.toLowerCase().endsWith('.jpeg'))) {
            files.push(fullPath);
        }
    });
    
    return files;
}

// 转换图片为 WebP
async function convertToWebP(inputPath, outputPath, quality = 80) {
    try {
        await sharp(inputPath)
            .webp({ quality: quality })
            .toFile(outputPath);
        return true;
    } catch (error) {
        console.error(`转换失败: ${inputPath}`, error.message);
        return false;
    }
}

// 主函数
async function main() {
    console.log('开始查找 JPG 图片...');
    const jpgFiles = getJpgFiles(sourceDir);
    console.log(`找到 ${jpgFiles.length} 张 JPG 图片`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const jpgPath of jpgFiles) {
        const basename = path.basename(jpgPath, path.extname(jpgPath));
        const webpPath = path.join(outputDir, `${basename}.webp`);
        
        // 检查是否已经存在 WebP 版本
        if (fs.existsSync(webpPath)) {
            console.log(`跳过已存在: ${basename}.webp`);
            continue;
        }
        
        process.stdout.write(`转换中: ${basename}.jpg -> ${basename}.webp ... `);
        
        const success = await convertToWebP(jpgPath, webpPath, 80);
        
        if (success) {
            successCount++;
            console.log('✓');
        } else {
            failCount++;
            console.log('✗');
        }
    }
    
    console.log('\n转换完成!');
    console.log(`成功: ${successCount} 张`);
    console.log(`失败: ${failCount} 张`);
}

main().catch(console.error);