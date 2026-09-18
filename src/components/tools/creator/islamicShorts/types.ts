export type LayerType = 'text' | 'image' | 'shape' | 'decoration';

export type FontStyle = 'sans' | 'serif' | 'amiri' | 'scheherazade' | 'noto-naskh' | 'madrassa' | 'cinzel' | 'playfair';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number; // Center-relative or percentage (0-1080)
  y: number; // 0-1920
  width: number;
  height: number;
  rotation: number; // degrees
  opacity: number; // 0-1
  locked: boolean;
  hidden: boolean;
  animType?: 'none' | 'fade' | 'fade-up' | 'fade-down' | 'slide-up' | 'slide-down' | 'zoom' | 'float';
  animDelay?: number; // seconds
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number; // px at 1080x1920 scale
  fontWeight: 'normal' | 'bold' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  color: string;
  align: 'left' | 'center' | 'right';
  lineHeight: number; // e.g. 1.3
  letterSpacing: number; // px
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  backgroundPadding?: number;
  backgroundRadius?: number;
  isArabic?: boolean;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string; // Data URL or Object URL
  flipX: boolean;
  flipY: boolean;
  isArabicPng?: boolean;
  brightness?: number; // 100%
  contrast?: number; // 100%
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: 'rect' | 'rounded-rect' | 'circle' | 'line' | 'divider' | 'oval';
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  cornerRadius?: number;
}

export interface DecorationLayer extends BaseLayer {
  type: 'decoration';
  decoType: 'lantern' | 'mosque' | 'crescent' | 'stars' | 'quran' | 'tasbih' | 'frame-gold' | 'frame-arch' | 'floral' | 'divider-gold';
  color: string;
  color2?: string;
}

export type Layer = TextLayer | ImageLayer | ShapeLayer | DecorationLayer;

export interface AudioConfig {
  src: string | null;
  name: string;
  volume: number; // 0-1
  muted: boolean;
  startTime: number; // seconds
  trimEnd?: number;
  fadeIn: boolean;
  fadeOut: boolean;
}

export type VideoAnimationPreset = 
  | 'static'
  | 'zoom-in'
  | 'zoom-out'
  | 'pan'
  | 'fade-in'
  | 'soft-zoom'
  | 'glow'
  | 'particles'
  | 'subtle-light'
  | 'islamic-elegant';

export interface BackgroundConfig {
  type: 'solid' | 'gradient-linear' | 'gradient-radial' | 'image';
  color1: string;
  color2: string;
  angle: number; // for linear gradient
  imageSrc: string | null;
  imageOpacity: number;
  imageBlur: number;
}

export interface BrandingConfig {
  channelName: string;
  watermarkOpacity: number;
  watermarkPosition: 'top' | 'bottom';
  logoSrc: string | null;
  ctaText: string;
}

export interface ProjectData {
  version: number;
  name: string;
  layers: Layer[];
  background: BackgroundConfig;
  branding: BrandingConfig;
  audio: AudioConfig;
  videoDuration: number; // 5, 10, or 15
  animationPreset: VideoAnimationPreset;
}

export interface IslamicTemplatePreset {
  id: string;
  name: string;
  category: string;
  thumbnailColor: string;
  thumbnailColor2?: string;
  accentColor: string;
  description: string;
  createLayers: () => Layer[];
  background: BackgroundConfig;
}
