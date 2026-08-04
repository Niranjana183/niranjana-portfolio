const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\NIRANJANA KRISHNA\\.gemini\\antigravity-ide\\brain\\673f7a76-8389-4329-9036-b90ffaef3980';
const destDir = path.join(__dirname, 'images', 'autoresq');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
    'media__1785764424624.png': '1.png',
    'media__1785764443751.png': '2.png',
    'media__1785764451899.png': '3.png',
    'media__1785764457579.png': '4.png'
};

let count = 0;
for (const [src, dest] of Object.entries(fileMap)) {
    const srcPath = path.join(srcDir, src);
    const destPath = path.join(destDir, dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        count++;
        console.log(`Copied ${src} -> ${dest}`);
    } else {
        console.error(`Source missing: ${srcPath}`);
    }
}

console.log(`Successfully copied ${count} images!`);
