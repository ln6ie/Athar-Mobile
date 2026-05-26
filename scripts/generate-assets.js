const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Mathematically perfect SVG representation of the concentric rings logo
const svgMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#FFFFFF"/>
  <g transform="translate(256, 256)">
    <!-- Outer Ring 3: opacity 0.12 -->
    <circle cx="0" cy="0" r="220" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.12" />
    
    <!-- Outer Ring 2: opacity 0.35 -->
    <circle cx="0" cy="0" r="165" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.35" />
    
    <!-- Outer Ring 1: opacity 0.70 -->
    <circle cx="0" cy="0" r="110" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.70" />
    
    <!-- Center Core Dot -->
    <circle cx="0" cy="0" r="44" fill="#0055A5" />
  </g>
</svg>
`;

const assetsDir = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function generate() {
  console.log('[Branding] Starting programmatic asset generation from SVG...');
  
  const svgBuffer = Buffer.from(svgMarkup);
  
  // 1. Generate icon.png (1024x1024, white background)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('✓ Generated assets/icon.png (1024x1024)');
    
  // 2. Generate adaptive-icon.png (1024x1024, transparent background for modern Android)
  const transparentSvg = svgMarkup.replace('<rect width="512" height="512" fill="#FFFFFF"/>', '');
  const transparentBuffer = Buffer.from(transparentSvg);
  await sharp(transparentBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('✓ Generated assets/adaptive-icon.png (1024x1024, transparent)');

  // 3. Generate splash-icon.png (1024x1024, centered on white background)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('✓ Generated assets/splash-icon.png (1024x1024)');

  // 4. Generate favicon.png (48x48)
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
  console.log('✓ Generated assets/favicon.png (48x48)');

  console.log('[Branding] All assets successfully compiled and generated programmatically!');
}

generate().catch(console.error);
