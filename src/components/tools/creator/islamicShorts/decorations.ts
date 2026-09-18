// Vector SVG Drawing helpers on HTML5 Canvas for Islamic Decorations

export function drawIslamicDecoration(
  ctx: CanvasRenderingContext2D,
  decoType: string,
  width: number,
  height: number,
  color: string,
  color2?: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  switch (decoType) {
    case 'frame-gold': {
      // Double Gold Frame
      const margin = 30;
      ctx.lineWidth = 6;
      ctx.strokeRect(-width / 2 + margin, -height / 2 + margin, width - margin * 2, height - margin * 2);
      ctx.lineWidth = 2;
      ctx.strokeRect(-width / 2 + margin + 14, -height / 2 + margin + 14, width - (margin + 14) * 2, height - (margin + 14) * 2);

      // Corner flourishes
      const cs = 40;
      const drawCorner = (cx: number, cy: number, flipX: number, flipY: number) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + cs * flipX, cy);
        ctx.lineTo(cx, cy + cs * flipY);
        ctx.closePath();
        ctx.fill();
      };
      const left = -width / 2 + margin + 14;
      const right = width / 2 - margin - 14;
      const top = -height / 2 + margin + 14;
      const bottom = height / 2 - margin - 14;
      drawCorner(left, top, 1, 1);
      drawCorner(right, top, -1, 1);
      drawCorner(left, bottom, 1, -1);
      drawCorner(right, bottom, -1, -1);
      break;
    }

    case 'frame-arch': {
      // Mihrab Arch Shape at top
      ctx.lineWidth = 4;
      const w = width * 0.9;
      const h = height * 0.9;
      const top = -h / 2;
      const bottom = h / 2;
      const left = -w / 2;
      const right = w / 2;

      ctx.beginPath();
      ctx.moveTo(left, bottom);
      ctx.lineTo(left, top + 150);
      ctx.quadraticCurveTo(0, top - 20, right, top + 150);
      ctx.lineTo(right, bottom);
      ctx.closePath();
      ctx.stroke();
      break;
    }

    case 'lantern': {
      // Hanging Lanterns
      const drawSingleLantern = (lx: number, ly: number, size: number) => {
        ctx.save();
        ctx.translate(lx, ly);
        // Wire
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.5);
        ctx.lineTo(0, 0);
        ctx.stroke();

        // Dome Cap
        ctx.beginPath();
        ctx.moveTo(-size * 0.4, 0);
        ctx.lineTo(size * 0.4, 0);
        ctx.lineTo(0, -size * 0.4);
        ctx.closePath();
        ctx.fill();

        // Glass Body
        ctx.beginPath();
        ctx.moveTo(-size * 0.4, 0);
        ctx.lineTo(-size * 0.5, size * 0.7);
        ctx.lineTo(0, size);
        ctx.lineTo(size * 0.5, size * 0.7);
        ctx.lineTo(size * 0.4, 0);
        ctx.closePath();
        ctx.globalAlpha = 0.85;
        ctx.fill();

        // Bottom tassel
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(0, size * 1.3);
        ctx.stroke();
        ctx.restore();
      };

      const w = width;
      drawSingleLantern(-w * 0.35, -height * 0.1, 32);
      drawSingleLantern(-w * 0.18, 0, 42);
      drawSingleLantern(w * 0.18, 0, 42);
      drawSingleLantern(w * 0.35, -height * 0.1, 32);
      break;
    }

    case 'crescent': {
      // Crescent Moon + Star
      const r = width / 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Cutout for crescent
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(r * 0.3, -r * 0.2, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Star
      ctx.beginPath();
      ctx.arc(-r * 0.5, -r * 0.4, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'mosque': {
      // Mosque Silhouette
      const w = width;
      const h = height;
      const b = h / 2;

      // Base
      ctx.fillRect(-w * 0.4, b - 40, w * 0.8, 40);

      // Minaret Left
      ctx.fillRect(-w * 0.38, b - 120, 24, 120);
      ctx.beginPath();
      ctx.arc(-w * 0.38 + 12, b - 130, 14, 0, Math.PI * 2);
      ctx.fill();

      // Minaret Right
      ctx.fillRect(w * 0.38 - 24, b - 120, 24, 120);
      ctx.beginPath();
      ctx.arc(w * 0.38 - 12, b - 130, 14, 0, Math.PI * 2);
      ctx.fill();

      // Central Main Dome
      ctx.beginPath();
      ctx.arc(0, b - 30, w * 0.22, Math.PI, 0);
      ctx.fill();

      // Dome Crescent Tip
      ctx.beginPath();
      ctx.arc(0, b - 30 - w * 0.24, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'quran': {
      // Holy Quran Book
      const w = width * 0.8;
      const h = height * 0.8;
      ctx.lineWidth = 3;

      // Left Page
      ctx.beginPath();
      ctx.moveTo(0, h * 0.3);
      ctx.quadraticCurveTo(-w * 0.25, -h * 0.3, -w * 0.5, -h * 0.2);
      ctx.lineTo(-w * 0.5, h * 0.2);
      ctx.quadraticCurveTo(-w * 0.25, h * 0.1, 0, h * 0.3);
      ctx.fill();

      // Right Page
      ctx.beginPath();
      ctx.moveTo(0, h * 0.3);
      ctx.quadraticCurveTo(w * 0.25, -h * 0.3, w * 0.5, -h * 0.2);
      ctx.lineTo(w * 0.5, h * 0.2);
      ctx.quadraticCurveTo(w * 0.25, h * 0.1, 0, h * 0.3);
      ctx.fill();
      break;
    }

    case 'divider-gold': {
      // Gold Divider Line
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-width / 2, 0);
      ctx.lineTo(width / 2, 0);
      ctx.stroke();

      // Center Diamond
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'stars': {
      // Sparkling Night Stars
      const drawStar = (sx: number, sy: number, r: number) => {
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      };
      drawStar(-width * 0.4, -height * 0.2, 4);
      drawStar(-width * 0.25, height * 0.1, 6);
      drawStar(width * 0.1, -height * 0.3, 5);
      drawStar(width * 0.35, -height * 0.1, 7);
      drawStar(width * 0.45, height * 0.2, 4);
      break;
    }

    case 'tasbih': {
      // Prayer Beads Ring
      const radius = width * 0.3;
      const totalBeads = 33;
      for (let i = 0; i < totalBeads; i++) {
        const angle = (i / totalBeads) * Math.PI * 2;
        const bx = Math.cos(angle) * radius;
        const by = Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(bx, by, i % 11 === 0 ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'bismillah': {
      // Elegant Calligraphy Medallion
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.36, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = `bold ${Math.round(width * 0.16)}px "Amiri", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ', 0, 0);
      break;
    }

    default:
      break;
  }

  ctx.restore();
}
