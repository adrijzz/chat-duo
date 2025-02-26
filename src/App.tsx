import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, LogOut, User, Moon, Sun, Image, Paperclip, Smile, Settings, X, Users, FileText } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ProfileSettings } from './components/ProfileSettings';
import { PrivateRoom } from './components/PrivateRoom';
import { MediaUpload } from './components/MediaUpload';

// Definição dos tipos
type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
};

type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isTyping: boolean;
  isOnline: boolean;
};

type Room = {
  id: string;
  name: string;
  participants: string[];
  messages: Message[];
  isPrivate: boolean;
};

function App() {
  // Estados para controle de UI
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'profile' | 'rooms'>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  
  // Estados para dados
  const [messageText, setMessageText] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user1',
    name: 'Usuário',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMS40YzAgLjM1NCAwIC41MzEtLjA3NC42ODNhLjcyNi43MjYgMCAwIDEtLjI0My4yNDNjLS4xNTIuMDc0LS4zMjkuMDc0LS42ODMuMDc0SDQuOGMtLjM1NCAwLS41MzEgMC0uNjgzLS4wNzRhLjcyNi43MjYgMCAwIDEtLjI0My0uMjQzQzMuOCAyMS45MzEgMy44IDIxLjc1NCAzLjggMjEuNFYyMGgyLjRWNC42YzAtLjM1NCAwLS41MzEuMDc0LS42ODNhLjcyNi43MjYgMCAwIDEgLjI0My0uMjQzQzYuNjY5IDMuNiA2Ljg0NiAzLjYgNy4yIDMuNmg5LjZjLjM1NCAwIC41MzEgMCAuNjgzLjA3NGEuNzI2LjcyNiAwIDAgMSAuMjQzLjI0M2MuMDc0LjE1Mi4wNzQuMzI5LjA3NC42ODNWMjBoMi40djEuNHoiLz48L3N2Zz4=',
    bio: 'Olá! Eu sou novo por aqui.',
    isTyping: false,
    isOnline: true
  });
  
  // Estados para salas
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito para scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom?.messages]);

  // Efeito para tema escuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers para salas privadas
  const handleCreateRoom = (roomName: string, password: string) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: roomName,
      participants: [currentUser.id],
      messages: [],
      isPrivate: true
    };
    setRooms([...rooms, newRoom]);
    setCurrentRoom(newRoom);
    setCurrentPage('chat');
  };

  const handleJoinRoom = (roomId: string, password: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      room.participants.push(currentUser.id);
      setCurrentRoom(room);
      setCurrentPage('chat');
    }
  };

  // Handler para envio de arquivos
  const handleFileSelect = async (file: File) => {
    if (!currentRoom) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessage: Message = {
        id: Date.now(),
        text: '',
        sender: currentUser.id,
        timestamp: new Date(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileUrl: reader.result as string,
        fileName: file.name
      };
      
      setCurrentRoom({
        ...currentRoom,
        messages: [...currentRoom.messages, newMessage]
      });
    };
    reader.readAsDataURL(file);
  };

  // Handler para atualização de perfil
  const handleProfileUpdate = (updates: Partial<{ name: string; avatar: string; bio: string }>) => {
    setCurrentUser({ ...currentUser, ...updates });
  };

  // Handler para envio de mensagem
  const handleSendMessage = () => {
    if (!messageText.trim() || !currentRoom) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: currentUser.id,
      timestamp: new Date(),
      type: 'text'
    };

    setCurrentRoom({
      ...currentRoom,
      messages: [...currentRoom.messages, newMessage]
    });
    setMessageText('');
    setShowEmojiPicker(false);
  };

  // Handler para emoji
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText(prev => prev + emojiData.emoji);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold">Chat Duo</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>
            
            <button
              onClick={() => setShowProfileSettings(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings />
            </button>
            
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <LogOut />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentPage === 'home' && (
          <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="space-y-4">
              <button
                onClick={() => setCurrentPage('rooms')}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Users />
                Salas Privadas
              </button>
            </div>
          </div>
        )}

        {currentPage === 'rooms' && (
          <div className="max-w-md mx-auto mt-10">
            <PrivateRoom
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          </div>
        )}

        {currentPage === 'chat' && currentRoom && (
          <div className="h-[100dvh] flex flex-col">
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User />
                  </div>
                  <div>
                    <h2 className="font-semibold">{currentRoom.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentRoom.participants.length} participantes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {currentRoom.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.sender === currentUser.id ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={message.sender === currentUser.id ? currentUser.avatar : currentRoom.participants.find(p => p === message.sender)?.avatar || currentUser.avatar}
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
                      <span className="text-xs opacity-75 mt-1 block">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
              <div className="max-w-3xl mx-auto flex items-end gap-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Smile />
                    </button>
                    <button
                      onClick={() => setShowMediaUpload(true)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Paperclip />
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <Send />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {showMediaUpload && (
        <MediaUpload
          onFileSelect={handleFileSelect}
          onClose={() => setShowMediaUpload(false)}
        />
      )}

      {showProfileSettings && (
        <ProfileSettings
          user={currentUser}
          onUpdate={handleProfileUpdate}
          onClose={() => setShowProfileSettings(false)}
        />
      )}
    </div>
  );
}

export default App;