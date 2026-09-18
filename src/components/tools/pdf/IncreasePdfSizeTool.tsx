import React from 'react';
import { PdfSizeAdjusterTool } from './PdfSizeAdjusterTool';

export const IncreasePdfSizeTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  return <PdfSizeAdjusterTool initialMode="increase" onShowToast={onShowToast} />;
};
