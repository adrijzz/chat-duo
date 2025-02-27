import React, { useRef, useState } from 'react';
import { Image, FileText, Music, Video, X, Camera, Upload } from 'lucide-react';

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

interface FileType {
  type: string;
  icon: React.ElementType;
  label: string;
  accept: string;
  capture?: boolean | 'user' | 'environment';
  ref: React.RefObject<HTMLInputElement>;
}

export function MediaUpload({ onFileSelect, onClose }: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRefs = {
    image: useRef<HTMLInputElement>(null),
    document: useRef<HTMLInputElement>(null),
    audio: useRef<HTMLInputElement>(null),
    video: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
      onClose();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const fileTypes: FileType[] = [
    {
      type: 'camera',
      icon: Camera,
      label: 'Câmera',
      accept: 'image/*',
      capture: 'environment',
      ref: fileInputRefs.image
    },
    {
      type: 'image',
      icon: Image,
      label: 'Galeria',
      accept: 'image/*',
      ref: fileInputRefs.image
    },
    {
      type: 'video',
      icon: Video,
      label: 'Vídeo',
      accept: 'video/*',
      capture: 'environment',
      ref: fileInputRefs.video
    },
    {
      type: 'audio',
      icon: Music,
      label: 'Áudio',
      accept: 'audio/*',
      capture: true,
      ref: fileInputRefs.audio
    },
    {
      type: 'document',
      icon: FileText,
      label: 'Documento',
      accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx',
      ref: fileInputRefs.document
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-lg w-full max-w-sm animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Enviar Arquivo</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className={`p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg m-4 transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-4 text-gray-500 dark:text-gray-400">
            <Upload size={32} className="mb-2" />
            <p className="text-sm text-center">
              Arraste e solte arquivos aqui ou selecione uma opção abaixo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 p-4">
          {fileTypes.map((fileType) => (
            <button
              key={fileType.type}
              onClick={() => fileType.ref.current?.click()}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <fileType.icon size={24} className="text-blue-500" />
              <span className="text-xs text-center">{fileType.label}</span>
              <input
                type="file"
                ref={fileType.ref}
                onChange={handleFileChange}
                accept={fileType.accept}
                capture={fileType.capture}
                className="hidden"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
