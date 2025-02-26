import React, { useState } from 'react';
import { Camera, X, Edit2 } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isTyping: boolean;
  isOnline: boolean;
}

interface ProfileSettingsProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
  onClose: () => void;
}

export function ProfileSettings({ user, onUpdate, onClose }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [avatarColor, setAvatarColor] = useState('#e2e8f0');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          ...user,
          avatar: reader.result as string,
          name,
          bio,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({
      ...user,
      name,
      bio,
    });
    onClose();
  };

  const generateDefaultAvatar = () => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
        <rect width="40" height="40" fill="${avatarColor}"/>
        <text x="50%" y="50%" dy=".3em" fill="#ffffff" font-family="Arial" font-size="20" text-anchor="middle">
          ${initials}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const colorOptions = [
    '#e2e8f0', '#f87171', '#fb923c', '#fbbf24', '#a3e635',
    '#34d399', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">Configurações do Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
              >
                <img
                  src={user.avatar || generateDefaultAvatar()}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
              >
                <Edit2 size={16} />
              </button>
            </div>

            {showAvatarOptions && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-lg">
                <div className="flex flex-wrap gap-2 mb-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-white hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setAvatarColor(color);
                        onUpdate({
                          ...user,
                          avatar: generateDefaultAvatar(),
                        });
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'image/*';
                      fileInput.onchange = (e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
                      fileInput.click();
                    }}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                  >
                    <Camera size={20} />
                    <span>Upload Foto</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
