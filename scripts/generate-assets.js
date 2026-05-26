const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// LIGHT Mode SVG: background #FFFFFF, logo #0055A5
const lightSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#FFFFFF"/>
  <g transform="translate(256, 256)">
    <circle cx="0" cy="0" r="220" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.12" />
    <circle cx="0" cy="0" r="165" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.35" />
    <circle cx="0" cy="0" r="110" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.70" />
    <circle cx="0" cy="0" r="44" fill="#0055A5" />
  </g>
</svg>
`;

// DARK Mode SVG: background #0B0F19, logo #3B82F6
const darkSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0B0F19"/>
  <g transform="translate(256, 256)">
    <circle cx="0" cy="0" r="220" fill="none" stroke="#3B82F6" stroke-width="10" opacity="0.12" />
    <circle cx="0" cy="0" r="165" fill="none" stroke="#3B82F6" stroke-width="10" opacity="0.35" />
    <circle cx="0" cy="0" r="110" fill="none" stroke="#3B82F6" stroke-width="10" opacity="0.70" />
    <circle cx="0" cy="0" r="44" fill="#3B82F6" />
  </g>
</svg>
`;

// TRANSPARENT LIGHT Mode SVG: background transparent, logo #0055A5
const transparentLightSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g transform="translate(256, 256)">
    <circle cx="0" cy="0" r="220" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.12" />
    <circle cx="0" cy="0" r="165" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.35" />
    <circle cx="0" cy="0" r="110" fill="none" stroke="#0055A5" stroke-width="10" opacity="0.70" />
    <circle cx="0" cy="0" r="44" fill="#0055A5" />
  </g>
</svg>
`;

// TRANSPARENT MONOCHROME/TINTED SVG: background transparent, logo #000000
const transparentMonochromeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g transform="translate(256, 256)">
    <circle cx="0" cy="0" r="220" fill="none" stroke="#000000" stroke-width="10" opacity="0.12" />
    <circle cx="0" cy="0" r="165" fill="none" stroke="#000000" stroke-width="10" opacity="0.35" />
    <circle cx="0" cy="0" r="110" fill="none" stroke="#000000" stroke-width="10" opacity="0.70" />
    <circle cx="0" cy="0" r="44" fill="#000000" />
  </g>
</svg>
`;

const assetsDir = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function generate() {
  console.log('[Branding] Starting programmatic asset generation for Light & Dark Mode icons...');
  
  const lightBuffer = Buffer.from(lightSvg);
  const darkBuffer = Buffer.from(darkSvg);
  const transLightBuffer = Buffer.from(transparentLightSvg);
  const monochromeBuffer = Buffer.from(transparentMonochromeSvg);
  
  // 1. Generate standard fallback icons
  await sharp(lightBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon.png'));
  console.log('✓ Generated assets/icon.png (1024x1024)');
  
  // 2. Generate iOS themed icons
  await sharp(lightBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon-light.png'));
  console.log('✓ Generated assets/icon-light.png (1024x1024 - Light)');

  await sharp(darkBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon-dark.png'));
  console.log('✓ Generated assets/icon-dark.png (1024x1024 - Dark)');

  await sharp(monochromeBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon-tinted.png'));
  console.log('✓ Generated assets/icon-tinted.png (1024x1024 - Tinted)');

  // 3. Generate Android Adaptive Icons
  await sharp(transLightBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('✓ Generated assets/adaptive-icon.png (1024x1024 - Foreground)');

  await sharp(monochromeBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'monochrome-icon.png'));
  console.log('✓ Generated assets/monochrome-icon.png (1024x1024 - Monochrome)');

  // 4. Generate other fallbacks
  await sharp(lightBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('✓ Generated assets/splash-icon.png (1024x1024)');

  await sharp(lightBuffer).resize(48, 48).png().toFile(path.join(assetsDir, 'favicon.png'));
  console.log('✓ Generated assets/favicon.png (48x48)');

  console.log('[Branding] All assets successfully compiled and generated programmatically for BOTH light and dark mode!');
}

generate().catch(console.error);
