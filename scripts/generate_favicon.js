import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Build the exact original folded ribbon "Z" for Zubware
function generateSvg({ transparent = true, padding = 30 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <!-- Top Bar Gradient: Electric Azure to Royal Blue -->
    <linearGradient id="topBarGrad" x1="86" y1="84" x2="426" y2="168" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00a8ff" />
      <stop offset="40%" stop-color="#0077ff" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>

    <!-- Diagonal Slash: Royal Blue -> Indigo -> Vivid Violet -->
    <linearGradient id="diagGrad" x1="380" y1="100" x2="130" y2="412" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1e40af" />
      <stop offset="30%" stop-color="#3b82f6" />
      <stop offset="70%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>

    <!-- Bottom Bar Gradient: Indigo to Electric Violet -->
    <linearGradient id="bottomBarGrad" x1="86" y1="344" x2="426" y2="428" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="60%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <!-- Top Fold Crease 3D Shadow -->
    <linearGradient id="topFoldShadow" x1="330" y1="168" x2="260" y2="168" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b0f3b" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#0b0f3b" stop-opacity="0" />
    </linearGradient>

    <!-- Bottom Fold Shadow -->
    <linearGradient id="bottomFoldShadow" x1="180" y1="344" x2="250" y2="344" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b0f3b" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#0b0f3b" stop-opacity="0" />
    </linearGradient>

    <!-- Subtle Depth Shadow for standalone icon presentation -->
    <filter id="zElevation" x="-12%" y="-12%" width="124%" height="124%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#3b82f6" flood-opacity="0.3" />
    </filter>
  </defs>

  <g filter="url(#zElevation)">
    <!-- Top Horizontal Arm -->
    <path
      d="M 128 84
         L 404 84
         C 416 84 426 94 426 106
         L 426 168
         L 236 168
         L 128 168
         C 104.8 168 86 149.2 86 126
         C 86 102.8 104.8 84 128 84
         Z"
      fill="url(#topBarGrad)"
    />

    <!-- Diagonal Z Slash (Folded Ribbon) -->
    <path
      d="M 426 84
         L 426 168
         L 194 428
         L 86 428
         L 86 344
         L 318 84
         Z"
      fill="url(#diagGrad)"
    />

    <!-- Top Fold Shadow under the diagonal fold -->
    <path
      d="M 318 84
         L 426 168
         L 370 190
         L 262 168
         Z"
      fill="url(#topFoldShadow)"
    />

    <!-- Bottom Horizontal Arm -->
    <path
      d="M 86 344
         L 276 344
         L 384 344
         C 407.2 344 426 362.8 426 386
         C 426 409.2 407.2 428 384 428
         L 194 428
         L 86 428
         Z"
      fill="url(#bottomBarGrad)"
    />

    <!-- Bottom Fold Shadow -->
    <path
      d="M 194 428
         L 86 344
         L 142 322
         L 250 344
         Z"
      fill="url(#bottomFoldShadow)"
    />
  </g>
</svg>`;
}

async function buildFavicons() {
  const publicDir = path.resolve('public');
  const distDir = path.resolve('dist');
  const svgContent = generateSvg();

  // 1. Write public/favicon.svg, public/icon.svg, public/zubware-logo.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'zubware-logo.svg'), svgContent, 'utf-8');
  console.log('Created public/favicon.svg, icon.svg, zubware-logo.svg');

  // 2. Generate PNGs using Sharp
  const svgBuffer = Buffer.from(svgContent);

  // High-res 512x512 PWA icon & zubware-logo.png
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'zubware-logo.png'));
  console.log('Created public/icon.png & zubware-logo.png (512x512)');

  // Apple touch icon (180x180)
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png (180x180)');

  // 48x48 Favicon
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));
  console.log('Created public/favicon-48x48.png (48x48)');

  // 32x32 Favicon
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));
  console.log('Created public/favicon.png (32x32)');

  // 16x16 & 32x32 ICO file
  const ico32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32Buffer);
  console.log('Created public/favicon.ico');

  // Also copy directly to dist if dist exists
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(path.join(publicDir, 'favicon.svg'), path.join(distDir, 'favicon.svg'));
    fs.copyFileSync(path.join(publicDir, 'icon.svg'), path.join(distDir, 'icon.svg'));
    fs.copyFileSync(path.join(publicDir, 'zubware-logo.svg'), path.join(distDir, 'zubware-logo.svg'));
    fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(distDir, 'favicon.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon-48x48.png'), path.join(distDir, 'favicon-48x48.png'));
    fs.copyFileSync(path.join(publicDir, 'apple-touch-icon.png'), path.join(distDir, 'apple-touch-icon.png'));
    fs.copyFileSync(path.join(publicDir, 'icon.png'), path.join(distDir, 'icon.png'));
    fs.copyFileSync(path.join(publicDir, 'zubware-logo.png'), path.join(distDir, 'zubware-logo.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon.ico'), path.join(distDir, 'favicon.ico'));
    console.log('Updated files in dist/');
  }

  console.log('All original logo and favicon assets restored successfully!');
}

buildFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
