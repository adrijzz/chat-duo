import React, { useState } from 'react';
import { Lock, Users } from 'lucide-react';

interface PrivateRoomProps {
  onCreateRoom: (roomName: string, password: string) => void;
  onJoinRoom: (roomId: string, password: string) => void;
}

export function PrivateRoom({ onCreateRoom, onJoinRoom }: PrivateRoomProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      onCreateRoom(roomName, password);
    } else {
      onJoinRoom(roomId, password);
    }
    setRoomName('');
    setRoomId('');
    setPassword('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsCreating(true)}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            isCreating
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Users size={20} />
          Criar Sala
        </button>
        <button
          onClick={() => setIsCreating(false)}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            !isCreating
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Lock size={20} />
          Entrar em Sala
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isCreating ? (
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Sala</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Digite o nome da sala"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">ID da Sala</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Digite o ID da sala"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Digite a senha da sala"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {isCreating ? 'Criar Sala' : 'Entrar na Sala'}
        </button>
      </form>
    </div>
  );
}
