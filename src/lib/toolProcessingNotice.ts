import { NETWORK_DEPENDENT_TOOL_IDS } from './paths';

export function toolProcessingNotice(id: string): string {
  if (id === 'background-remover') return 'Quick and Private modes process your photo on your device. Smart AI sends the selected photo to Cloudflare only after you consent and start. Online availability and limits apply.';
  if (id === 'subtitle-generator') return 'Video playback, manual captions and exports stay in your browser. Optional microphone dictation may send audio to your browser provider for speech recognition.';
  if (NETWORK_DEPENDENT_TOOL_IDS.has(id)) return 'This tool sends requests from your browser to the external service or address you choose. Check the destination before including private information.';
  return 'This tool processes your inputs in your browser rather than uploading them for processing. The website may still load libraries, fonts and measurement services.';
}
