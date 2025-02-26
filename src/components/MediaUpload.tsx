import React, { useRef } from 'react';
import { Image, File, X } from 'lucide-react';

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

export function MediaUpload({ onFileSelect, onClose }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Enviar Arquivo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2"
          >
            <div className="flex gap-4">
              <Image size={24} />
              <File size={24} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clique para selecionar uma imagem ou arquivo
            </p>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            className="hidden"
          />

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Formatos suportados: Imagens, Vídeos, Áudios, PDF, DOC
          </div>
        </div>
      </div>
    </div>
  );
}
