import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, LogOut, User, Moon, Sun, Image, Paperclip, Smile, Settings, X, Users, FileText } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ProfileSettings } from './components/ProfileSettings';
import { PrivateRoom } from './components/PrivateRoom';
import { MediaUpload } from './components/MediaUpload';
import { MainMenu } from './components/MainMenu';
import { HomePage } from './components/HomePage';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  read: boolean;
}

interface Room {
  id: string;
  name: string;
  participants: UserProfile[];
  messages: Message[];
  isPrivate: boolean;
  password?: string;
  connectedDevices: {
    userId: string;
    deviceId: string;
    deviceName: string;
    lastActive: number;
  }[];
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isTyping: boolean;
  isOnline: boolean;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'rooms'>('home');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showPrivateRoom, setShowPrivateRoom] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user1',
    name: 'Usuário',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMS40YzAgLjM1NCAwIC41MzEtLjA3NC42ODNhLjcyNi43MjYgMCAwIDEtLjI0My4yNDNjLS4xNTIuMDc0LS4zMjkuMDc0LS42ODMuMDc0SDQuOGMtLjM1NCAwLS41MzEgMC0uNjgzLS4wNzRhLjcyNi43MjYgMCAwIDEtLjI0My0uMjQzQzMuOCAyMS45MzEgMy44IDIxLjc1NCAzLjggMjEuNFYyMGgyLjRWNC42YzAtLjM1NCAwLS41MzEuMDc0LS42ODNhLjcyNi43MjYgMCAwIDEgLjI0My0uMjQzQzYuNjY5IDMuNiA2Ljg0NiAzLjYgNy4yIDMuNmg5LjZjLjM1NCAwIC41MzEgMCAuNjgzLjA3NGEuNzI2LjcyNiAwIDAgMSAuMjQzLjI0M2MuMDc0LjE1Mi4wNzQuMzI5LjA3NC42ODNWMjBoMi40djEuNHoiLz48L3N2Zz4=',
    bio: 'Olá! Eu sou novo por aqui.',
    isTyping: false,
    isOnline: true
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [favoriteRooms, setFavoriteRooms] = useState<Room[]>([]);
  const [recentRooms, setRecentRooms] = useState<Room[]>([]);
  const [deviceId] = useState(() => `device_${Math.random().toString(36).slice(2)}`);
  const [deviceName] = useState(() => {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
    if (/Android/.test(userAgent)) return 'Android';
    return 'Desktop';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (currentRoom) {
      setRecentRooms(prev => {
        const filtered = prev.filter(r => r.id !== currentRoom.id);
        return [currentRoom, ...filtered].slice(0, 5);
      });
    }
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom?.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentRoom) return;

    const newMessage: Message = {
      id: Math.random().toString(36).slice(2),
      text: messageText,
      sender: currentUser.id,
      timestamp: Date.now(),
      type: 'text',
      read: false
    };

    setCurrentRoom(prev => ({
      ...prev!,
      messages: [...prev!.messages, newMessage]
    }));

    setMessageText('');
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText(prev => prev + emojiData.emoji);
  };

  const handleFileSelect = (file: File) => {
    if (!currentRoom) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessage: Message = {
        id: Math.random().toString(36).slice(2),
        text: '',
        sender: currentUser.id,
        timestamp: Date.now(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileUrl: reader.result as string,
        fileName: file.name,
        read: false
      };

      setCurrentRoom(prev => ({
        ...prev!,
        messages: [...prev!.messages, newMessage]
      }));
    };
    reader.readAsDataURL(file);
  };

  const toggleFavorite = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      if (favoriteRooms.some(r => r.id === roomId)) {
        setFavoriteRooms(favoriteRooms.filter(r => r.id !== roomId));
      } else {
        setFavoriteRooms([...favoriteRooms, room]);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900">
      <MainMenu
        onNavigate={(page) => {
          if (page === 'home') {
            setCurrentPage('home');
          } else if (page === 'rooms') {
            setCurrentPage('rooms');
          } else if (page === 'profile') {
            setShowProfileSettings(true);
          } else if (page === 'settings') {
            // Implementar configurações
          } else if (page === 'notifications') {
            // Implementar notificações
          } else if (page === 'logout') {
            // Implementar logout
          } else if (page.startsWith('room/')) {
            const roomId = page.split('/')[1];
            const room = rooms.find(r => r.id === roomId);
            if (room) {
              setCurrentRoom(room);
              setCurrentPage('chat');
            }
          }
        }}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        recentRooms={recentRooms.map(room => ({
          id: room.id,
          name: room.name,
          lastMessage: room.messages[room.messages.length - 1]?.text,
          unreadCount: room.messages.filter(m => !m.read && m.sender !== currentUser.id).length
        }))}
        favoriteRooms={favoriteRooms.map(room => ({
          id: room.id,
          name: room.name
        }))}
      />

      <div className="md:pl-64">
        {currentPage === 'home' && (
          <HomePage
            onCreateRoom={() => setShowPrivateRoom(true)}
            onJoinRoom={() => setShowPrivateRoom(true)}
            onOpenSettings={() => setShowProfileSettings(true)}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            isDarkMode={isDarkMode}
            activeRooms={rooms.length}
            onlineUsers={rooms.reduce((acc, room) => acc + room.participants.filter(p => p.isOnline).length, 0)}
          />
        )}

        {currentPage === 'chat' && currentRoom && (
          <div className="fixed inset-0 md:pl-64 flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Chat Header */}
            <div className="flex-none bg-white dark:bg-gray-800 shadow-md z-10">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentPage('home')}
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X size={24} />
                    </button>
                    <div>
                      <h2 className="font-semibold">{currentRoom.name}</h2>
                      <p className="text-sm text-gray-500">
                        {currentRoom.connectedDevices.length} dispositivo(s) conectado(s)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currentRoom.connectedDevices.map(device => (
                      <div
                        key={device.deviceId}
                        className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                      >
                        <span>{device.deviceName}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {currentRoom.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.sender === currentUser.id ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={
                          message.sender === currentUser.id
                            ? currentUser.avatar
                            : currentRoom.participants.find(p => p.id === message.sender)?.avatar
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === currentUser.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {message.type === 'text' && <p>{message.text}</p>}
                      {message.type === 'image' && (
                        <img
                          src={message.fileUrl}
                          alt="Imagem"
                          className="max-w-full rounded-lg"
                        />
                      )}
                      {message.type === 'file' && (
                        <a
                          href={message.fileUrl}
                          download={message.fileName}
                          className="flex items-center gap-2 text-blue-500 hover:underline"
                        >
                          <FileText size={20} />
                          {message.fileName}
                        </a>
                      )}
                      <div className="flex items-center gap-2 mt-1 opacity-75 text-xs">
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>
                          {currentRoom.connectedDevices.find(d => d.userId === message.sender)?.deviceName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex-none bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      className="w-full bg-transparent resize-none focus:outline-none"
                      rows={1}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Smile size={20} />
                      </button>
                      <button
                        onClick={() => setShowMediaUpload(true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Paperclip size={20} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showProfileSettings && (
        <ProfileSettings
          user={currentUser}
          onUpdate={(updatedUser) => {
            setCurrentUser(updatedUser);
            setShowProfileSettings(false);
          }}
          onClose={() => setShowProfileSettings(false)}
        />
      )}

      {showPrivateRoom && (
        <PrivateRoom
          onJoin={(room) => {
            setRooms([...rooms, room]);
            setCurrentRoom(room);
            setCurrentPage('chat');
            setShowPrivateRoom(false);
          }}
          onClose={() => setShowPrivateRoom(false)}
        />
      )}

      {showMediaUpload && (
        <MediaUpload
          onFileSelect={handleFileSelect}
          onClose={() => setShowMediaUpload(false)}
        />
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}

export default App;