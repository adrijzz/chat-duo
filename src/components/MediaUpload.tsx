import React, { useRef } from 'react';
import { Image, FileText, Music, Video, X } from 'lucide-react';

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

export function MediaUpload({ onFileSelect, onClose }: MediaUploadProps) {
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

  const fileTypes = [
    {
      type: 'image',
      icon: Image,
      label: 'Imagem',
      accept: 'image/*',
      capture: 'environment',
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
      accept: '.pdf,.doc,.docx,.txt',
      ref: fileInputRefs.document
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg w-full max-w-sm">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Enviar Arquivo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          {fileTypes.map((fileType) => (
            <button
              key={fileType.type}
              onClick={() => fileType.ref.current?.click()}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors gap-2"
            >
              <fileType.icon size={24} className="text-blue-500" />
              <span className="text-sm">{fileType.label}</span>
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
