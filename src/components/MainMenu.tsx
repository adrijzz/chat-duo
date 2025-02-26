import React, { useState } from 'react';
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
  X
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
}

export function MainMenu({
  onNavigate,
  onToggleTheme,
  isDarkMode,
  currentUser,
  recentRooms,
  favoriteRooms
}: MainMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* User Profile Section */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{currentUser.name}</h3>
              <button
                onClick={() => onNavigate('profile')}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Editar Perfil
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar salas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6">
          {/* Main Actions */}
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MessageCircle size={20} />
              <span>Chat Principal</span>
            </button>
            <button
              onClick={() => onNavigate('rooms')}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Hash size={20} />
              <span>Todas as Salas</span>
            </button>
          </div>

          {/* Favorite Rooms */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              Salas Favoritas
            </h4>
            <div className="space-y-1">
              {favoriteRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => onNavigate(`room/${room.id}`)}
                  className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  <span className="truncate">{room.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Rooms */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
              <Clock size={16} />
              Conversas Recentes
            </h4>
            <div className="space-y-1">
              {recentRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => onNavigate(`room/${room.id}`)}
                  className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {room.name}
                    </div>
                    {room.lastMessage && (
                      <div className="text-xs text-gray-500 truncate">
                        {room.lastMessage}
                      </div>
                    )}
                  </div>
                  {room.unreadCount && room.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                      {room.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('notifications')}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 relative"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => onNavigate('logout')}
              className="p-2 text-red-500 hover:text-red-600"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
