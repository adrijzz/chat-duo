import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Users,
  Settings,
  Moon,
  Sun,
  LogOut,
  Bell,
  Search,
  Hash,
  Star,
  Clock,
  Menu as MenuIcon,
  X,
  Trash2,
  User
} from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  currentUser: {
    name: string;
    avatar: string;
  };
  recentRooms: Array<{
    id: string;
    name: string;
    lastMessage?: string;
    unreadCount?: number;
  }>;
  favoriteRooms: Array<{
    id: string;
    name: string;
  }>;
  onDeleteRecentRoom?: (roomId: string) => void;
}

export function MainMenu({
  onNavigate,
  onToggleTheme,
  isDarkMode,
  currentUser,
  recentRooms,
  favoriteRooms,
  onDeleteRecentRoom
}: MainMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Fechar o menu quando mudar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll quando menu mobile estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTouchStart = (roomId: string) => {
    const timer = setTimeout(() => {
      setSelectedRoomId(roomId);
    }, 500); // 500ms para considerar como long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <>
      {/* Botão do Menu Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg z-50 md:hidden"
        aria-label="Menu"
      >
        {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Overlay para Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Principal */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 
        dark:border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header do Menu */}
        <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500/20"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">{currentUser.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Menu Principal - Conteúdo */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* Ações Principais */}
          <div className="space-y-1 mb-6">
            <button
              onClick={() => {
                onNavigate('home');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MessageCircle size={18} />
              <span>Chat</span>
            </button>
            <button
              onClick={() => {
                onNavigate('profile');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User size={18} />
              <span>Perfil</span>
            </button>
          </div>

          {/* Salas Favoritas */}
          {favoriteRooms.length > 0 && (
            <div className="mb-6">
              <h3 className="px-3 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Favoritos
              </h3>
              <div className="space-y-1">
                {favoriteRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      onNavigate(`room/${room.id}`);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Star size={18} className="text-yellow-500" />
                    <span className="flex-1 truncate">{room.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Salas Recentes */}
          {recentRooms.length > 0 && (
            <div className="mb-6">
              <h3 className="px-3 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Recentes
              </h3>
              <div className="space-y-1">
                {recentRooms.map(room => (
                  <div
                    key={room.id}
                    className="group flex items-center gap-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <button
                      onClick={() => {
                        onNavigate(`room/${room.id}`);
                        setIsOpen(false);
                      }}
                      className="flex-1 flex items-center gap-3 py-2 px-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <Clock size={18} className="flex-none text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{room.name}</div>
                        {room.lastMessage && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {room.lastMessage}
                          </p>
                        )}
                      </div>
                      {room.unreadCount && room.unreadCount > 0 && (
                        <span className="flex-none px-2 py-0.5 text-xs font-medium text-white bg-blue-500 rounded-full">
                          {room.unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (onDeleteRecentRoom) {
                          onDeleteRecentRoom(room.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer do Menu */}
        <div className="flex-none p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings size={18} />
              <span>Configurações</span>
            </button>
            <button
              onClick={() => {
                onNavigate('logout');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
