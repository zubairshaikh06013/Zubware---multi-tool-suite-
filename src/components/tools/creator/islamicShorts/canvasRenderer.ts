import { Layer, BackgroundConfig, BrandingConfig, VideoAnimationPreset } from './types';
import { drawIslamicDecoration } from './decorations';

export interface RenderCanvasOptions {
  canvas: HTMLCanvasElement;
  layers: Layer[];
  background: BackgroundConfig;
  branding: BrandingConfig;
  timeSeconds?: number;
  durationSeconds?: number;
  animationPreset?: VideoAnimationPreset;
  selectedLayerId?: string | null;
  showEditorControls?: boolean; // false for export, true for editing canvas preview
}

export function renderIslamicShortsCanvas({
  canvas,
  layers,
  background,
  branding,
  timeSeconds = 0,
  durationSeconds = 5,
  animationPreset = 'static',
  selectedLayerId = null,
  showEditorControls = false
}: RenderCanvasOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 1080;
  const H = 1920;
  canvas.width = W;
  canvas.height = H;

  ctx.clearRect(0, 0, W, H);

  // Time progress ratio [0..1]
  const progress = durationSeconds > 0 ? (timeSeconds % durationSeconds) / durationSeconds : 0;

  // 1. GLOBAL BACKGROUND
  ctx.save();
  if (background.type === 'solid') {
    ctx.fillStyle = background.color1;
    ctx.fillRect(0, 0, W, H);
  } else if (background.type === 'gradient-linear') {
    const angleRad = (background.angle * Math.PI) / 180;
    const x2 = W / 2 + Math.cos(angleRad) * W;
    const y2 = H / 2 + Math.sin(angleRad) * H;
    const grad = ctx.createLinearGradient(W / 2, H / 2, x2, y2);
    grad.addColorStop(0, background.color1);
    grad.addColorStop(1, background.color2 || '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  } else if (background.type === 'gradient-radial') {
    const radGrad = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W);
    radGrad.addColorStop(0, background.color1);
    radGrad.addColorStop(1, background.color2 || '#000000');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, W, H);
  }

  // Custom Background Image
  if (background.imageSrc) {
    const img = new Image();
    img.src = background.imageSrc;
    if (img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = background.imageOpacity;
      if (background.imageBlur > 0) {
        ctx.filter = `blur(${background.imageBlur}px)`;
      }

      // Cover scaling
      const imgRatio = img.width / img.height;
      const canvasRatio = W / H;
      let renderW = W;
      let renderH = H;
      let offsetX = 0;
      let offsetY = 0;
      if (imgRatio > canvasRatio) {
        renderW = H * imgRatio;
        offsetX = -(renderW - W) / 2;
      } else {
        renderH = W / imgRatio;
        offsetY = -(renderH - H) / 2;
      }
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    }
  }
  ctx.restore();

  // GLOBAL ANIMATION CAMERA TRANSFORM
  ctx.save();
  if (animationPreset === 'zoom-in') {
    const scale = 1.0 + progress * 0.08; // subtle 8% zoom
    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.translate(-W / 2, -H / 2);
  } else if (animationPreset === 'zoom-out') {
    const scale = 1.08 - progress * 0.08;
    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.translate(-W / 2, -H / 2);
  } else if (animationPreset === 'pan') {
    const panY = Math.sin(progress * Math.PI * 2) * 15;
    ctx.translate(0, panY);
  } else if (animationPreset === 'fade-in') {
    ctx.globalAlpha = Math.min(1.0, progress * 3);
  } else if (animationPreset === 'soft-zoom') {
    const scale = 1.0 + Math.sin(progress * Math.PI) * 0.04;
    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.translate(-W / 2, -H / 2);
  } else if (animationPreset === 'particles') {
    // Subtle floating light particles
    ctx.save();
    ctx.fillStyle = '#fbbf24';
    for (let p = 0; p < 12; p++) {
      const px = (p * 90 + timeSeconds * 20) % W;
      const py = (p * 160 + Math.sin(timeSeconds + p) * 40) % H;
      const pr = 2 + (p % 3);
      ctx.globalAlpha = 0.3 + 0.3 * Math.sin(timeSeconds * 2 + p);
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. RENDER LAYERS (In Array Order)
  layers.forEach((layer) => {
    if (layer.hidden) return;

    ctx.save();

    // Layer specific transform
    let posX = layer.x;
    let posY = layer.y;
    let layerOpacity = layer.opacity;

    // Layer animations
    if (layer.animType && layer.animType !== 'none') {
      const animDelay = layer.animDelay || 0;
      const localTime = Math.max(0, timeSeconds - animDelay);
      const layerProg = Math.min(1.0, localTime / 1.5); // 1.5s entrance

      if (layer.animType === 'fade') {
        layerOpacity *= layerProg;
      } else if (layer.animType === 'fade-up' || layer.animType === 'slide-up') {
        posY += (1 - layerProg) * 60;
        layerOpacity *= layerProg;
      } else if (layer.animType === 'fade-down') {
        posY -= (1 - layerProg) * 60;
        layerOpacity *= layerProg;
      } else if (layer.animType === 'zoom') {
        const layerScale = 0.8 + layerProg * 0.2;
        ctx.translate(posX, posY);
        ctx.scale(layerScale, layerScale);
        ctx.translate(-posX, -posY);
        layerOpacity *= layerProg;
      } else if (layer.animType === 'float') {
        posY += Math.sin(timeSeconds * 2 + posX) * 10;
      }
    }

    ctx.globalAlpha = layerOpacity;

    // Center transform for rotation
    ctx.translate(posX, posY);
    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }

    // DRAW SPECIFIC LAYER TYPES
    if (layer.type === 'text') {
      const txt = layer.text;
      ctx.font = `${layer.fontStyle || 'normal'} ${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
      ctx.textAlign = layer.align;
      ctx.textBaseline = 'middle';

      // Measure text for background box
      const lines = txt.split('\n');
      const lineHeight = layer.fontSize * (layer.lineHeight || 1.3);
      const totalH = lines.length * lineHeight;

      if (layer.backgroundColor) {
        ctx.save();
        ctx.fillStyle = layer.backgroundColor;
        const pad = layer.backgroundPadding || 16;
        const rad = layer.backgroundRadius || 16;
        const boxW = layer.width;
        const boxH = Math.max(layer.height, totalH + pad * 2);

        ctx.beginPath();
        ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, rad);
        ctx.fill();

        if (layer.strokeColor) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = layer.strokeWidth || 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw Text Lines
      ctx.fillStyle = layer.color;
      if (layer.shadowColor) {
        ctx.shadowColor = layer.shadowColor;
        ctx.shadowBlur = layer.shadowBlur || 10;
        ctx.shadowOffsetX = layer.shadowOffsetX || 0;
        ctx.shadowOffsetY = layer.shadowOffsetY || 4;
      }

      const startY = -totalH / 2 + lineHeight / 2;
      lines.forEach((line, idx) => {
        const lineY = startY + idx * lineHeight;
        let alignX = 0;
        if (layer.align === 'left') alignX = -layer.width / 2;
        if (layer.align === 'right') alignX = layer.width / 2;

        ctx.fillText(line.trim(), alignX, lineY);
      });
    } else if (layer.type === 'image') {
      const img = new Image();
      img.src = layer.src;
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        if (layer.flipX || layer.flipY) {
          ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
        }

        ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
        ctx.restore();
      }
    } else if (layer.type === 'shape') {
      ctx.save();
      ctx.fillStyle = layer.fillColor;
      ctx.strokeStyle = layer.strokeColor;
      ctx.lineWidth = layer.strokeWidth;

      const w = layer.width;
      const h = layer.height;

      if (layer.shapeType === 'rect') {
        ctx.fillRect(-w / 2, -h / 2, w, h);
        if (layer.strokeWidth > 0) ctx.strokeRect(-w / 2, -h / 2, w, h);
      } else if (layer.shapeType === 'rounded-rect') {
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, layer.cornerRadius || 16);
        ctx.fill();
        if (layer.strokeWidth > 0) ctx.stroke();
      } else if (layer.shapeType === 'circle' || layer.shapeType === 'oval') {
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (layer.strokeWidth > 0) ctx.stroke();
      } else if (layer.shapeType === 'line' || layer.shapeType === 'divider') {
        ctx.beginPath();
        ctx.moveTo(-w / 2, 0);
        ctx.lineTo(w / 2, 0);
        ctx.stroke();
      }
      ctx.restore();
    } else if (layer.type === 'decoration') {
      drawIslamicDecoration(ctx, layer.decoType, layer.width, layer.height, layer.color, layer.color2);
    }

    ctx.restore();
  });

  ctx.restore(); // Restore global camera transform

  // 3. BRANDING OVERLAY
  if (branding.channelName || branding.logoSrc) {
    ctx.save();
    ctx.globalAlpha = branding.watermarkOpacity;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    const fY = branding.watermarkPosition === 'bottom' ? H - 90 : 90;

    if (branding.logoSrc) {
      const logoImg = new Image();
      logoImg.src = branding.logoSrc;
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, W / 2 - 24, fY - 35, 48, 48);
      }
    }

    if (branding.channelName) {
      ctx.fillText(branding.channelName, W / 2, fY + (branding.logoSrc ? 25 : 0));
    }
    ctx.restore();
  }

  // 4. EDITOR BOUNDING BOX & HANDLES (For Editor Mode only)
  if (showEditorControls && selectedLayerId) {
    const selectedLayer = layers.find((l) => l.id === selectedLayerId);
    if (selectedLayer && !selectedLayer.hidden) {
      ctx.save();
      ctx.translate(selectedLayer.x, selectedLayer.y);
      if (selectedLayer.rotation) {
        ctx.rotate((selectedLayer.rotation * Math.PI) / 180);
      }

      const w = selectedLayer.width;
      const h = selectedLayer.height;

      // Selection box stroke
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12);

      // Corner handles
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#3b82f6';
      ctx.setLineDash([]);
      ctx.lineWidth = 2;

      const drawHandle = (hx: number, hy: number) => {
        ctx.beginPath();
        ctx.arc(hx, hy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      };

      drawHandle(-w / 2 - 6, -h / 2 - 6);
      drawHandle(w / 2 + 6, -h / 2 - 6);
      drawHandle(-w / 2 - 6, h / 2 + 6);
      drawHandle(w / 2 + 6, h / 2 + 6);

      ctx.restore();
    }
  }
}
