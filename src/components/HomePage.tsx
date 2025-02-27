import React from 'react';
import { MessageCircle, Users, Settings, Moon, Sun, Lock } from 'lucide-react';

interface HomePageProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  activeRooms: number;
  onlineUsers: number;
}

export function HomePage({
  onCreateRoom,
  onJoinRoom,
  onOpenSettings,
  onToggleTheme,
  isDarkMode,
  activeRooms,
  onlineUsers
}: HomePageProps) {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Chat Duo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Um espaço íntimo para conversas significativas entre duas pessoas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-blue-500">{activeRooms}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Salas Ativas</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-green-500">{onlineUsers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Usuários Online</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <button
            onClick={onCreateRoom}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 text-left transition-all hover:transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle size={24} />
              <h2 className="text-lg font-semibold">Criar Nova Sala</h2>
            </div>
            <p className="text-sm text-blue-100">
              Crie uma sala pública ou privada para conversar com seus amigos
            </p>
          </button>

          <button
            onClick={onJoinRoom}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 text-left transition-all hover:transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users size={24} />
              <h2 className="text-lg font-semibold">Entrar em uma Sala</h2>
            </div>
            <p className="text-sm text-green-100">
              Entre em uma sala existente usando o código de convite
            </p>
          </button>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="text-blue-500" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Chat em Tempo Real</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Converse instantaneamente com seus amigos em qualquer dispositivo
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="text-purple-500" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Múltiplos Dispositivos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Acesse suas conversas em vários dispositivos simultaneamente
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="text-pink-500" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Salas Privadas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Crie salas protegidas por senha para conversas privadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
