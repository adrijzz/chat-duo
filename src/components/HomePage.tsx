import React from 'react';
import { MessageCircle, Users, Lock, Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={32} className="text-blue-500" />
              <h1 className="text-2xl font-bold">Chat Duo</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenSettings}
                className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Settings size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="text-blue-500" size={24} />
              <div>
                <h3 className="text-lg font-semibold">Usuários Online</h3>
                <p className="text-2xl font-bold text-blue-500">{onlineUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-green-500" size={24} />
              <div>
                <h3 className="text-lg font-semibold">Salas Ativas</h3>
                <p className="text-2xl font-bold text-green-500">{activeRooms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={onCreateRoom}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 text-left transition-transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">Criar Nova Sala</h3>
            <p className="text-blue-100">
              Crie uma sala pública ou privada para conversar com seus amigos
            </p>
          </button>

          <button
            onClick={onJoinRoom}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 text-left transition-transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">Entrar em uma Sala</h3>
            <p className="text-green-100">
              Entre em uma sala existente usando o código de convite
            </p>
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <MessageCircle className="text-blue-500 mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Chat em Tempo Real</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Converse instantaneamente com seus amigos em qualquer dispositivo
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Users className="text-green-500 mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Múltiplos Dispositivos</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Acesse suas conversas em vários dispositivos simultaneamente
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Lock className="text-purple-500 mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Salas Privadas</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Crie salas protegidas por senha para conversas privadas
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
