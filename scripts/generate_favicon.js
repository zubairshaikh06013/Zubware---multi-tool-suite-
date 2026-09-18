import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Build the exact vector SVG matching the user's uploaded folded ribbon "Z"
function generateSvg({ transparent = true, padding = 30 } = {}) {
  // 512x512 coordinate space
  // We crop the ribbon "Z" so it fills the viewBox with pleasant balanced padding
  // This ensures that even at 16x16 or 32x32 favicon sizes, the Z is bold, crisp, and instantly legible!
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <!-- Top Bar Gradient: Electric Azure (#0075ff) -> Indigo-Blue (#2952e3) -> Purple (#7928ca) -> Vivid Violet (#8b2cf5) -->
    <linearGradient id="topBarGrad" x1="90" y1="80" x2="435" y2="150" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0077ff" />
      <stop offset="35%" stop-color="#1a56eb" />
      <stop offset="70%" stop-color="#6722e6" />
      <stop offset="100%" stop-color="#8b2cf5" />
    </linearGradient>

    <!-- Diagonal Ribbon Gradient: Deep Royal Blue to Electric Azure and Vibrant Cyan -->
    <linearGradient id="diagGrad" x1="390" y1="160" x2="110" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1639a0" />
      <stop offset="25%" stop-color="#1d4ed8" />
      <stop offset="60%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#00a8ff" />
    </linearGradient>

    <!-- Bottom Arm Gradient: Bright Cyan-Blue (#0095ff) -> Royal Purple (#6d28d9) -> Vivid Magenta-Violet (#991ef2) -->
    <linearGradient id="bottomBarGrad" x1="120" y1="360" x2="445" y2="390" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0099ff" />
      <stop offset="38%" stop-color="#2d5cf6" />
      <stop offset="75%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#a224f8" />
    </linearGradient>

    <!-- Top Fold Crease 3D Shadow (Layer under top-right fold) -->
    <linearGradient id="topFoldShadow" x1="375" y1="150" x2="280" y2="235" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#080424" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#14083c" stop-opacity="0.75" />
      <stop offset="85%" stop-color="#160840" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#160840" stop-opacity="0" />
    </linearGradient>

    <!-- Bottom Fold Shadow (Layer under diagonal fold) -->
    <linearGradient id="bottomFoldShadow" x1="175" y1="310" x2="265" y2="375" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06031f" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#120638" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#120638" stop-opacity="0" />
    </linearGradient>

    <!-- Subtle Depth Shadow for standalone icon presentation -->
    <filter id="zElevation" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#1e1b4b" flood-opacity="0.35" />
    </filter>
  </defs>

  <g filter="url(#zElevation)">
    <!-- 1. Bottom Horizontal Arm with Angled Right Terminal -->
    <path
      d="M 170 336 
         L 378 336 
         C 388 336 397 341 403 349 
         L 444 407 
         C 449 414 444 424 436 424 
         L 186 424 
         C 138 424 100 386 100 338 
         C 100 318 107 300 119 285 
         L 170 336 
         Z"
      fill="url(#bottomBarGrad)"
    />

    <!-- Bottom Fold Shadow: Creates the 3D depth where the diagonal ribbon folds over the bottom bar -->
    <path
      d="M 160 330 
         L 282 336 
         L 225 424 
         L 165 415 
         Z"
      fill="url(#bottomFoldShadow)"
    />

    <!-- 2. Continuous Diagonal Middle Ribbon & Bottom-Left Smooth Loop -->
    <path
      d="M 390 156 
         L 198 358 
         C 168 390 120 388 100 354 
         C 88 330 96 298 122 268 
         L 318 64 
         C 346 36 396 56 396 96 
         L 390 156 
         Z"
      fill="url(#diagGrad)"
    />

    <!-- 3. Top-Right Fold 3D Crease Shadow -->
    <path
      d="M 280 152 
         L 396 152 
         L 315 240 
         L 245 208 
         Z"
      fill="url(#topFoldShadow)"
    />

    <!-- 4. Top Horizontal Bar: Smooth Rounded Left Tip, Sharp Origami Fold at Right -->
    <path
      d="M 142 152 
         C 118 152 98 132 98 108 
         C 98 84 118 64 142 64 
         L 376 64 
         C 405 64 428 87 428 116 
         C 428 129 423 142 414 151 
         L 364 202 
         L 288 202 
         L 336 152 
         Z"
      fill="url(#topBarGrad)"
    />
  </g>
</svg>`;
}

async function buildFavicons() {
  const publicDir = path.resolve('public');
  const svgContent = generateSvg();

  // 1. Write public/favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log('Created public/favicon.svg');

  // 2. Write public/icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
  console.log('Created public/icon.svg');

  // 3. Generate PNGs using Sharp
  const svgBuffer = Buffer.from(svgContent);

  // High-res 512x512 PWA icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon.png'));
  console.log('Created public/icon.png (512x512)');

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png (180x180)');

  // 48x48 Favicon
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon-48x48.png'));
  console.log('Created public/favicon-48x48.png (48x48)');

  // 32x32 Favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Created public/favicon.png (32x32)');

  // 16x16 & 32x32 ICO file
  // Generate multi-size ICO from 32x32 PNG
  const ico32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32Buffer);
  console.log('Created public/favicon.ico');

  // Also copy directly to dist if dist exists
  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(path.join(publicDir, 'favicon.svg'), path.join(distDir, 'favicon.svg'));
    fs.copyFileSync(path.join(publicDir, 'icon.svg'), path.join(distDir, 'icon.svg'));
    fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(distDir, 'favicon.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon-48x48.png'), path.join(distDir, 'favicon-48x48.png'));
    fs.copyFileSync(path.join(publicDir, 'apple-touch-icon.png'), path.join(distDir, 'apple-touch-icon.png'));
    fs.copyFileSync(path.join(publicDir, 'icon.png'), path.join(distDir, 'icon.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon.ico'), path.join(distDir, 'favicon.ico'));
    console.log('Updated files in dist/');
  }

  console.log('All favicon and icon assets generated successfully!');
}

buildFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
