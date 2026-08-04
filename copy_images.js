const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\NIRANJANA KRISHNA\\.gemini\\antigravity-ide\\brain\\7a3e4d39-c322-4546-ba05-cc96ab056aab';
const destDir = path.join(__dirname, 'images', 'mediswift');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
    'media__1785746354043.png': 'user_login.png',
    'media__1785746361533.png': 'user_catalog.png',
    'media__1785746368850.png': 'shopping_cart.png',
    'media__1785746381178.png': 'prescription_ai_scan.png',
    'media__1785746374694.png': 'prescription_orders.png',
    'media__1785745207087.png': 'admin_login.png',
    'media__1785745207331.png': 'admin_dashboard.png'
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
