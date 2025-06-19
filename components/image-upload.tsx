'use client';

import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Upload, X, Image } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  file?: File | null;
  files?: File[];
  onFileChange?: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
  description: string;
  multiple?: boolean;
  maxFiles?: number;
}

export function ImageUpload({
  file,
  files,
  onFileChange,
  onFilesChange,
  description,
  multiple = false,
  maxFiles = 1
}: ImageUploadProps) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList);
    
    // Validate files
    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload image files only');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
    }

    if (multiple && onFilesChange) {
      const currentFiles = files || [];
      const updatedFiles = [...currentFiles, ...newFiles].slice(0, maxFiles);
      onFilesChange(updatedFiles);
    } else if (onFileChange) {
      onFileChange(newFiles[0] || null);
    }
  }, [file, files, onFileChange, onFilesChange, multiple, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (index?: number) => {
    if (multiple && onFilesChange && files) {
      if (typeof index === 'number') {
        const updatedFiles = files.filter((_, i) => i !== index);
        onFilesChange(updatedFiles);
      }
    } else if (onFileChange) {
      onFileChange(null);
    }
  };

  const currentFiles = multiple ? files || [] : file ? [file] : [];

  return (
    <div className="space-y-4">
      <div
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-center">
            <p className="text-sm text-gray-300">{t('drag.drop')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('supported.formats')}</p>
          </div>
          <p className="text-xs text-gray-400 text-center">{description}</p>
        </div>
      </div>

      {currentFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {currentFiles.map((f, index) => (
            <Card key={index} className="glass-effect relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <img
                  src={URL.createObjectURL(f)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(multiple ? index : undefined)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-400 truncate">{f.name}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {multiple && (
        <p className="text-xs text-gray-500 text-center">
          {currentFiles.length} / {maxFiles} images uploaded
        </p>
      )}
    </div>
  );
}