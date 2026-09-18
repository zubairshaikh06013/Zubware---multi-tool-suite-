import React from 'react';
import { UniversalFileUpload } from '../../common/UniversalFileUpload';

export interface ImageUploadAreaProps {
  onImageSelected: (files: File[]) => void;
  onClear?: () => void;
  onReplace?: () => void;
  files?: File[];
  title?: string;
  subtitle?: string;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  status?: 'idle' | 'processing' | 'success' | 'error';
  progress?: number;
  processingStep?: string;
  errorMessage?: string;
  showCamera?: boolean;
  showClipboard?: boolean;
  showPreview?: boolean;
  compact?: boolean;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onImageSelected,
  onClear,
  onReplace,
  files = [],
  title,
  subtitle,
  multiple = false,
  accept = 'image/*',
  maxSizeMB = 100,
  status = 'idle',
  progress,
  processingStep,
  errorMessage,
  showCamera = true,
  showClipboard = true,
  showPreview = true,
  compact = false
}) => {
  return (
    <UniversalFileUpload
      onFilesSelected={onImageSelected}
      onClear={onClear}
      onReplace={onReplace}
      files={files}
      title={title}
      subtitle={subtitle}
      multiple={multiple}
      accept={accept}
      maxSizeMB={maxSizeMB}
      status={status}
      progress={progress}
      processingStep={processingStep}
      errorMessage={errorMessage}
      showCamera={showCamera}
      showClipboard={showClipboard}
      showPreview={showPreview}
      compact={compact}
    />
  );
};
