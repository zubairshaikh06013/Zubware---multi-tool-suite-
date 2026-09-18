import React from 'react';
import { DecreasePdfSizeTool } from './DecreasePdfSizeTool';

export const PdfCompressorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  return <DecreasePdfSizeTool onShowToast={onShowToast} />;
};
