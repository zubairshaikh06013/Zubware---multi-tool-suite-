import React from 'react';
import { PdfSizeAdjusterTool } from './PdfSizeAdjusterTool';

export const DecreasePdfSizeTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  return <PdfSizeAdjusterTool initialMode="reduce" onShowToast={onShowToast} />;
};
