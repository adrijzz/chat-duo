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
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'user1',
      name: 'Usuário',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMS40YzAgLjM1NCAwIC41MzEtLjA3NC42ODNhLjcyNi43MjYgMCAwIDEtLjI0My4yNDNjLS4xNTIuMDc0LS4zMjkuMDc0LS42ODMuMDc0SDQuOGMtLjM1NCAwLS41MzEgMC0uNjgzLS4wNzRhLjcyNi43MjYgMCAwIDEtLjI0My0uMjQzQzMuOCAyMS45MzEgMy44IDIxLjc1NCAzLjggMjEuNFYyMGgyLjRWNC42YzAtLjM1NCAwLS41MzEuMDc0LS42ODNhLjcyNi43MjYgMCAwIDEgLjI0My0uMjQzQzYuNjY5IDMuNiA2Ljg0NiAzLjYgNy4yIDMuNmg5LjZjLjM1NCAwIC41MzEgMCAuNjgzLjA3NGEuNzI2LjcyNiAwIDAgMSAuMjQzLjI0M2MuMDc0LjE1Mi4wNzQuMzI5LjA3NC42ODNWMjBoMi40djEuNHoiLz48L3N2Zz4=',
      bio: 'Olá! Eu sou novo por aqui.',
      isTyping: false,
      isOnline: true
    };
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const savedRooms = localStorage.getItem('rooms');
    return savedRooms ? JSON.parse(savedRooms) : [];
  });

  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [favoriteRooms, setFavoriteRooms] = useState<Room[]>(() => {
    const savedFavorites = localStorage.getItem('favoriteRooms');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [recentRooms, setRecentRooms] = useState<Room[]>(() => {
    const savedRecent = localStorage.getItem('recentRooms');
    return savedRecent ? JSON.parse(savedRecent) : [];
  });

  const [deviceId] = useState(() => {
    const savedDeviceId = localStorage.getItem('deviceId');
    return savedDeviceId || `device_${Math.random().toString(36).slice(2)}`;
  });

  const [deviceName] = useState(() => {
    const savedDeviceName = localStorage.getItem('deviceName');
    if (savedDeviceName) return savedDeviceName;
    
    const userAgent = navigator.userAgent;
    let defaultName = 'Desktop';
    if (/iPhone|iPad|iPod/.test(userAgent)) defaultName = 'iOS';
    if (/Android/.test(userAgent)) defaultName = 'Android';
    
    // Adicionar um número aleatório para diferenciar dispositivos do mesmo tipo
    defaultName = `${defaultName} ${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem('deviceName', defaultName);
    return defaultName;
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
        const filtered = prev.filter((r: Room) => r.id !== currentRoom.id);
        return [currentRoom, ...filtered].slice(0, 5);
      });
    }
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom?.messages]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('favoriteRooms', JSON.stringify(favoriteRooms));
  }, [favoriteRooms]);

  useEffect(() => {
    localStorage.setItem('recentRooms', JSON.stringify(recentRooms));
  }, [recentRooms]);

  useEffect(() => {
    localStorage.setItem('deviceId', deviceId);
  }, [deviceId]);

  useEffect(() => {
    if (currentRoom) {
      // Atualizar lista de dispositivos conectados
      const updatedRoom = {
        ...currentRoom,
        connectedDevices: currentRoom.connectedDevices
          .filter(d => 
            // Remover dispositivos inativos (última atividade > 5 minutos)
            Date.now() - d.lastActive < 5 * 60 * 1000 &&
            // Manter outros dispositivos
            d.deviceId !== deviceId
          )
      };

      // Adicionar dispositivo atual
      updatedRoom.connectedDevices.push({
        userId: currentUser.id,
        deviceId,
        deviceName,
        lastActive: Date.now()
      });

      setRooms(prev => prev.map(room => 
        room.id === currentRoom.id ? updatedRoom : room
      ));
      setCurrentRoom(updatedRoom);

      // Atualizar status de atividade a cada 30 segundos
      const interval = setInterval(() => {
        setCurrentRoom(prev => {
          if (!prev) return null;
          
          const updated = {
            ...prev,
            connectedDevices: prev.connectedDevices.map(d =>
              d.deviceId === deviceId
                ? { ...d, lastActive: Date.now() }
                : d
            )
          };

          setRooms(rooms => rooms.map(room =>
            room.id === updated.id ? updated : room
          ));

          return updated;
        });
      }, 30000);

      return () => {
        clearInterval(interval);
        // Remover dispositivo ao sair da sala
        if (currentRoom) {
          const withoutDevice = {
            ...currentRoom,
            connectedDevices: currentRoom.connectedDevices.filter(
              d => d.deviceId !== deviceId
            )
          };
          setRooms(prev => prev.map(room =>
            room.id === currentRoom.id ? withoutDevice : room
          ));
        }
      };
    }
  }, [currentRoom?.id]);

  // Função para sincronizar salas
  const syncRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    
    // Enviar para o servidor
    fetch(`${import.meta.env.VITE_API_URL || 'https://chat-duo-production.up.railway.app'}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        rooms: updatedRooms,
        deviceInfo: {
          userId: currentUser.id,
          deviceId,
          deviceName,
          lastActive: Date.now()
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.rooms) {
        setRooms(data.rooms);
        if (currentRoom) {
          const updatedRoom = data.rooms.find((r: Room) => r.id === currentRoom.id);
          if (updatedRoom) {
            setCurrentRoom(updatedRoom);
          }
        }
      }
    })
    .catch(error => console.error('Erro ao sincronizar:', error));
  };

  // Polling para atualizar as salas
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetch(`${import.meta.env.VITE_API_URL || 'https://chat-duo-production.up.railway.app'}/api/rooms`)
          .then(response => response.json())
          .then(data => {
            if (data.rooms) {
              setRooms(prevRooms => {
                // Mesclar salas do servidor com as locais
                const mergedRooms = data.rooms.map((serverRoom: Room) => {
                  const localRoom = prevRooms.find(r => r.id === serverRoom.id);
                  if (localRoom) {
                    // Usar Set para garantir mensagens únicas baseado no ID
                    const uniqueMessages = Array.from(
                      new Map(
                        [...serverRoom.messages, ...localRoom.messages]
                          .map(msg => [msg.id, msg])
                      ).values()
                    ).sort((a, b) => a.timestamp - b.timestamp);

                    return {
                      ...serverRoom,
                      messages: uniqueMessages,
                      connectedDevices: serverRoom.connectedDevices.filter(device => 
                        Date.now() - device.lastActive < 5 * 60 * 1000
                      )
                    };
                  }
                  return serverRoom;
                });

                // Atualizar sala atual se necessário
                if (currentRoom) {
                  const updatedRoom = mergedRooms.find(r => r.id === currentRoom.id);
                  if (updatedRoom && JSON.stringify(updatedRoom.messages) !== JSON.stringify(currentRoom.messages)) {
                    setCurrentRoom(updatedRoom);
                  }
                }

                return mergedRooms;
              });
            }
          })
          .catch(error => console.error('Erro ao buscar salas:', error));
      }
    }, 3000); // Aumentado para 3 segundos

    // Atualizar status do dispositivo
    const activityInterval = setInterval(() => {
      if (currentRoom) {
        const updatedRoom = {
          ...currentRoom,
          connectedDevices: currentRoom.connectedDevices
            .filter(d => Date.now() - d.lastActive < 5 * 60 * 1000)
            .map(d => d.deviceId === deviceId ? { ...d, lastActive: Date.now() } : d)
        };
        syncRooms(rooms.map(room => room.id === currentRoom.id ? updatedRoom : room));
      }
    }, 30000);

    // Limpar intervalos ao desmontar
    return () => {
      clearInterval(interval);
      clearInterval(activityInterval);
    };
  }, [currentRoom?.id]);

  // Adicionar listener para quando a página ficar visível/invisível
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentRoom) {
        syncRooms(rooms);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentRoom, rooms]);

  // Remover dispositivo ao sair da sala
  useEffect(() => {
    return () => {
      if (currentRoom) {
        const updatedRoom = {
          ...currentRoom,
          connectedDevices: currentRoom.connectedDevices.filter(d => d.deviceId !== deviceId)
        };
        syncRooms(rooms.map(room => room.id === currentRoom.id ? updatedRoom : room));
      }
    };
  }, [currentRoom?.id]);

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

    // Atualizar localmente primeiro
    const updatedRoom = {
      ...currentRoom,
      messages: [...currentRoom.messages, newMessage]
    };

    setCurrentRoom(updatedRoom);
    setMessageText('');

    // Sincronizar com o servidor depois
    const updatedRooms = rooms.map(room => 
      room.id === currentRoom.id ? updatedRoom : room
    );
    syncRooms(updatedRooms);
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

      const updatedRoom = {
        ...currentRoom,
        messages: [...currentRoom.messages, newMessage]
      };

      const updatedRooms = rooms.map(room => 
        room.id === currentRoom.id ? updatedRoom : room
      );

      syncRooms(updatedRooms);
      setCurrentRoom(updatedRoom);
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

  const findOrCreateRoom = (roomId: string): Promise<Room | null> => {
    // Primeiro, buscar no servidor
    return fetch(`https://chat-duo-production.up.railway.app/api/rooms`)
      .then(response => response.json())
      .then(data => {
        if (data.rooms) {
          // Procurar a sala nos dados do servidor
          let room = data.rooms.find((r: Room) => r.id === roomId);
          
          if (!room) {
            // Se não encontrar, criar nova sala
            room = {
              id: roomId,
              name: `Sala ${roomId.slice(0, 6)}`,
              participants: [],
              messages: [],
              isPrivate: false,
              connectedDevices: []
            };
          }
          
          // Atualizar as salas locais
          const updatedRooms = [...rooms];
          const existingIndex = updatedRooms.findIndex(r => r.id === roomId);
          
          if (existingIndex >= 0) {
            updatedRooms[existingIndex] = room;
          } else {
            updatedRooms.push(room);
          }
          
          syncRooms(updatedRooms);
          return room;
        }
        return null;
      })
      .catch(error => {
        console.error('Erro ao buscar salas:', error);
        return null;
      });
  };

  const handleNavigation = async (page: string) => {
    if (page === 'home') {
      setCurrentPage('home');
      setCurrentRoom(null);
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
      const room = await findOrCreateRoom(roomId);
      if (room) {
        setCurrentRoom(room);
        setCurrentPage('chat');
      }
    }
  };

  const handleDeleteRecentRoom = (roomId: string) => {
    setRecentRooms(prev => prev.filter(room => room.id !== roomId));
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900">
      <MainMenu
        onNavigate={handleNavigation}
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
        onDeleteRecentRoom={handleDeleteRecentRoom}
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
          <div className="fixed inset-0 md:pl-64 flex flex-col">
            {/* Chat Header */}
            <div className="flex-none bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="h-16 px-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setCurrentRoom(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex-1 flex items-center gap-4">
                  <h2 className="text-lg font-semibold">{currentRoom.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>•</span>
                    <span>{currentRoom.connectedDevices.length} online</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentRoom.id);
                    const button = document.getElementById('copyButton');
                    if (button) {
                      button.textContent = 'Copiado!';
                      setTimeout(() => {
                        button.textContent = currentRoom.id;
                      }, 2000);
                    }
                  }}
                  id="copyButton"
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {currentRoom.id}
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="max-w-3xl mx-auto p-4 space-y-4">
                {currentRoom.messages.map((message, index) => {
                  const isCurrentUser = message.sender === currentUser.id;
                  const showSender = index === 0 || 
                    currentRoom.messages[index - 1].sender !== message.sender;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[80%] items-end gap-2 ${
                        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        {showSender && (
                          <img
                            src={isCurrentUser ? currentUser.avatar : 'default-avatar.png'}
                            alt="Avatar"
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {!showSender && <div className="w-6" />}
                        
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          {showSender && !isCurrentUser && (
                            <span className="text-xs text-gray-500 mb-1 ml-1">
                              {currentRoom.participants.find(p => p.id === message.sender)?.name || 'Usuário'}
                            </span>
                          )}
                          
                          <div className={`rounded-2xl px-4 py-2 ${
                            isCurrentUser 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white dark:bg-gray-800'
                          }`}>
                            {message.type === 'text' && (
                              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            )}
                            {message.type === 'image' && (
                              <img
                                src={message.fileUrl}
                                alt="Imagem"
                                className="rounded-lg max-w-full"
                              />
                            )}
                            {message.type === 'file' && (
                              <div className="flex items-center gap-2">
                                <FileText size={16} />
                                <span className="text-sm">{message.fileName}</span>
                              </div>
                            )}
                          </div>
                          
                          <span className="text-xs text-gray-400 mt-1 mx-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex-none bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-3xl mx-auto p-4">
                <div className="flex items-end gap-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowMediaUpload(true)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Smile size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
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
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-2xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={1}
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="p-2 text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 rounded-full transition-colors"
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
            // Verificar se a sala já existe
            const existingRoom = rooms.find(r => r.id === room.id);
            if (!existingRoom) {
              // Se não existir, adicionar aos rooms
              syncRooms([...rooms, room]);
            }
            
            // Atualizar sala atual
            setCurrentRoom(room);
            setCurrentPage('chat');
            setShowPrivateRoom(false);

            // Adicionar às salas recentes
            const updatedRecentRooms = [
              room,
              ...recentRooms.filter(r => r.id !== room.id)
            ].slice(0, 5);
            setRecentRooms(updatedRecentRooms);
            localStorage.setItem('recentRooms', JSON.stringify(updatedRecentRooms));
          }}
          onClose={() => setShowPrivateRoom(false)}
          existingRooms={rooms}
        />
      )}

      {showMediaUpload && (
        <MediaUpload
          onFileSelect={handleFileSelect}
          onClose={() => setShowMediaUpload(false)}
        />
      )}
    </div>
  );
}

export default App;