import React, { useState } from 'react';
import { X, Lock, Users, Key } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  participants: any[];
  messages: any[];
  isPrivate: boolean;
  password?: string;
  connectedDevices: {
    userId: string;
    deviceId: string;
    deviceName: string;
    lastActive: number;
  }[];
}

interface PrivateRoomProps {
  onJoin: (room: Room) => void;
  onClose: () => void;
  existingRooms: Room[];
}

export function PrivateRoom({ onJoin, onClose, existingRooms }: PrivateRoomProps) {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [password, setPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'create') {
      if (!roomName.trim()) {
        setError('Digite um nome para a sala');
        return;
      }

      if (isPrivate && !password.trim()) {
        setError('Digite uma senha para a sala privada');
        return;
      }

      // Criar nova sala
      const newRoom: Room = {
        id: `room_${Math.random().toString(36).slice(2)}`,
        name: roomName.trim(),
        participants: [],
        messages: [],
        isPrivate,
        password: isPrivate ? password : undefined,
        connectedDevices: []
      };

      onJoin(newRoom);
    } else {
      if (!roomCode.trim()) {
        setError('Digite o código da sala');
        return;
      }

      // Verificar se a sala existe
      const existingRoom = existingRooms.find(room => room.id === roomCode);
      
      if (!existingRoom) {
        setError('Sala não encontrada');
        return;
      }

      // Verificar senha se a sala for privada
      if (existingRoom.isPrivate) {
        if (!password) {
          setError('Esta sala é privada. Digite a senha.');
          return;
        }
        
        if (existingRoom.password !== password) {
          setError('Senha incorreta');
          return;
        }
      }

      onJoin(existingRoom);
    }
  };

  const [foundRoom, setFoundRoom] = useState<Room | null>(null);

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setRoomCode(code);
    setError('');
    
    // Limpar sala encontrada e senha ao mudar o código
    setFoundRoom(null);
    setPassword('');
    
    if (code.trim()) {
      const room = existingRooms.find(r => r.id === code);
      if (room) {
        setFoundRoom(room);
      }
    }
  };

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError('Por favor, insira um código de sala');
      return;
    }

    try {
      // Verificar se a sala existe no servidor
      const response = await fetch(`http://192.168.18.11:5174/api/rooms`);
      const data = await response.json();
      
      if (data.rooms) {
        const serverRoom = data.rooms.find((r: Room) => r.id === roomCode);
        
        if (serverRoom) {
          onJoin(serverRoom);
          return;
        }
      }

      // Se não encontrou no servidor, criar nova sala
      const newRoom: Room = {
        id: roomCode,
        name: `Sala ${roomCode.slice(0, 6)}`,
        participants: [],
        messages: [],
        isPrivate: false,
        connectedDevices: []
      };
      
      onJoin(newRoom);
    } catch (error) {
      console.error('Erro ao verificar sala:', error);
      setError('Erro ao verificar sala. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold">
            {mode === 'create' ? 'Criar Nova Sala' : 'Entrar em uma Sala'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-0.5 sm:p-1 mb-4">
            <button
              className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base transition-colors ${
                mode === 'create'
                  ? 'bg-white dark:bg-gray-800 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => {
                setMode('create');
                setError('');
                setFoundRoom(null);
                setPassword('');
              }}
            >
              Criar Sala
            </button>
            <button
              className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base transition-colors ${
                mode === 'join'
                  ? 'bg-white dark:bg-gray-800 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => {
                setMode('join');
                setError('');
                setFoundRoom(null);
                setPassword('');
              }}
            >
              Entrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {mode === 'create' ? (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">
                    Nome da Sala
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o nome da sala"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="isPrivate" className="flex items-center gap-2 text-sm sm:text-base">
                    <Lock size={14} className="sm:w-4 sm:h-4" />
                    Sala Privada
                  </label>
                </div>

                {isPrivate && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">
                      Senha da Sala
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite a senha"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">
                    Código da Sala
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={handleRoomCodeChange}
                    className="w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o código da sala"
                  />
                </div>

                {foundRoom?.isPrivate && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">
                      Senha da Sala
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite a senha"
                    />
                  </div>
                )}

                {foundRoom && (
                  <div className="text-xs sm:text-sm text-green-500 dark:text-green-400">
                    Sala encontrada: {foundRoom.name}
                  </div>
                )}
              </>
            )}

            {error && (
              <p className="text-red-500 text-xs sm:text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {mode === 'create' ? 'Criar Sala' : 'Entrar na Sala'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
