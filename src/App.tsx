import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, LogOut, User, Moon, Sun, Image, Paperclip, Smile, Settings, X } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

// Definição dos tipos
type Message = {
  id: number;
  text: string;
  sender: 'user1' | 'user2';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
};

type UserProfile = {
  id: 'user1' | 'user2';
  name: string;
  avatar: string;
  bio: string;
  isTyping: boolean;
  isOnline: boolean;
};

function App() {
  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'profile'>('home');
  
  // Estado para controlar o tema
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Estado para as mensagens
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Estado para o texto atual sendo digitado
  const [messageText, setMessageText] = useState<string>('');
  
  // Estado para os usuários
  const [users, setUsers] = useState<UserProfile[]>([
    { 
      id: 'user1', 
      name: 'Usuário 1', 
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80', 
      bio: 'Olá! Eu sou o Usuário 1.',
      isTyping: false, 
      isOnline: true 
    },
    { 
      id: 'user2', 
      name: 'Usuário 2', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80', 
      bio: 'Olá! Eu sou o Usuário 2.',
      isTyping: false, 
      isOnline: true 
    }
  ]);
  
  // Estado para o usuário atual
  const [currentUser, setCurrentUser] = useState<'user1' | 'user2'>('user1');
  
  // Estado para o emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  
  // Estado para o perfil em edição
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  
  // Referência para a área de mensagens para scroll automático
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efeito para aplicar o tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Função para enviar mensagem
  const sendMessage = () => {
    if (messageText.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: currentUser,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Simular resposta do outro usuário após 2 segundos
    const otherUser = currentUser === 'user1' ? 'user2' : 'user1';
    setUsers(prev => prev.map(user => 
      user.id === otherUser ? { ...user, isTyping: true } : user
    ));
    
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === otherUser ? { ...user, isTyping: false } : user
      ));
    }, 2000);
  };

  // Função para enviar arquivo
  const sendFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Criar URL para o arquivo
    const fileUrl = URL.createObjectURL(file);
    
    // Determinar se é uma imagem
    const isImage = file.type.startsWith('image/');
    
    const newMessage: Message = {
      id: Date.now(),
      text: isImage ? 'Enviou uma imagem' : `Enviou um arquivo: ${file.name}`,
      sender: currentUser,
      timestamp: new Date(),
      type: isImage ? 'image' : 'file',
      fileUrl: fileUrl,
      fileName: file.name
    };
    
    setMessages([...messages, newMessage]);
    
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para adicionar emoji
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Função para alternar entre usuários
  const toggleUser = () => {
    setCurrentUser(prev => prev === 'user1' ? 'user2' : 'user1');
  };

  // Função para formatar a hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Função para iniciar edição de perfil
  const startEditProfile = () => {
    const userToEdit = users.find(user => user.id === currentUser);
    if (userToEdit) {
      setEditingProfile({...userToEdit});
      setCurrentPage('profile');
    }
  };

  // Função para salvar perfil
  const saveProfile = () => {
    if (editingProfile) {
      setUsers(prev => prev.map(user => 
        user.id === editingProfile.id ? editingProfile : user
      ));
      setCurrentPage('chat');
      setEditingProfile(null);
    }
  };

  // Renderização da página inicial
  const renderHomePage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 transition-all duration-300">
        <div className="flex items-center justify-center mb-6">
          <MessageCircle size={40} className="text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">ConversaDuo</h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Um espaço íntimo para conversas significativas entre duas pessoas.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => setCurrentPage('chat')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            Iniciar Conversa
          </button>
          
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button 
              onClick={toggleUser}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <User size={18} className="mr-1" />
              {users.find(u => u.id === currentUser)?.name}
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 ConversaDuo. Todos os direitos reservados.</p>
        <div className="mt-2">
          <a href="#" className="text-blue-500 hover:underline mx-2">Política de Privacidade</a>
          <a href="#" className="text-blue-500 hover:underline mx-2">Termos de Uso</a>
          <a href="#" className="text-blue-500 hover:underline mx-2">Contato</a>
        </div>
      </footer>
    </div>
  );

  // Renderização da página de perfil
  const renderProfilePage = () => (
    <div className="flex flex-col h-screen">
      {/* Cabeçalho */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Settings size={24} className="text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Editar Perfil</h1>
          </div>
          
          <button 
            onClick={() => setCurrentPage('chat')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-500"
          >
            <X size={18} className="mr-1" />
            <span>Cancelar</span>
          </button>
        </div>
      </header>
      
      {/* Conteúdo do perfil */}
      {editingProfile && (
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto">
          <div className="container mx-auto max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img 
                    src={editingProfile.avatar} 
                    alt={editingProfile.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                    <Image size={16} />
                  </button>
                </div>
                
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={editingProfile.bio}
                  onChange={(e) => setEditingProfile({...editingProfile, bio: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <button
                onClick={saveProfile}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Salvar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Renderização da página de chat
  const renderChatPage = () => (
    <div className="flex flex-col h-screen">
      {/* Cabeçalho */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle size={24} className="text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">ConversaDuo</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img 
                src={users.find(u => u.id !== currentUser)?.avatar} 
                alt={users.find(u => u.id !== currentUser)?.name} 
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {users.find(u => u.id !== currentUser)?.name}
                </span>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${users.find(u => u.id !== currentUser)?.isOnline ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {users.find(u => u.id !== currentUser)?.isOnline ? 'online' : 'offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button 
                onClick={startEditProfile}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings size={18} />
              </button>
              
              <button 
                onClick={toggleUser}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User size={18} />
              </button>
              
              <button 
                onClick={() => setCurrentPage('home')}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Área de mensagens */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <MessageCircle size={48} className="mb-4 opacity-50" />
              <p>Nenhuma mensagem ainda. Comece a conversar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender !== currentUser && (
                    <img 
                      src={users.find(u => u.id === message.sender)?.avatar} 
                      alt={users.find(u => u.id === message.sender)?.name} 
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  
                  <div 
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                      message.sender === currentUser 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                    }`}
                  >
                    {message.type === 'text' && (
                      <p>{message.text}</p>
                    )}
                    
                    {message.type === 'image' && (
                      <div>
                        <img 
                          src={message.fileUrl} 
                          alt="Imagem enviada" 
                          className="rounded-md max-w-full mb-2"
                        />
                      </div>
                    )}
                    
                    {message.type === 'file' && (
                      <div className="flex items-center">
                        <Paperclip size={16} className="mr-2" />
                        <a 
                          href={message.fileUrl} 
                          download={message.fileName}
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {message.fileName}
                        </a>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${message.sender === currentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  
                  {message.sender === currentUser && (
                    <img 
                      src={users.find(u => u.id === message.sender)?.avatar} 
                      alt={users.find(u => u.id === message.sender)?.name} 
                      className="w-8 h-8 rounded-full object-cover ml-2 self-end"
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {users.find(u => u.id !== currentUser)?.isTyping && (
            <div className="flex justify-start mt-2">
              <img 
                src={users.find(u => u.id !== currentUser)?.avatar} 
                alt={users.find(u => u.id !== currentUser)?.name} 
                className="w-8 h-8 rounded-full object-cover mr-2 self-end"
              />
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 text-gray-500 dark:text-gray-300 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Área de digitação */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <div className="flex items-center">
              <div className="flex space-x-2 mr-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Paperclip size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={sendFile} 
                  className="hidden" 
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Smile size={20} />
                </button>
              </div>
              
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-l-lg py-3 px-4 focus:outline-none"
              />
              
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg p-3 transition-colors duration-300"
              >
                <Send size={20} />
              </button>
            </div>
            
            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-10">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen transition-colors duration-300">
      {currentPage === 'home' 
        ? renderHomePage() 
        : currentPage === 'profile' 
          ? renderProfilePage() 
          : renderChatPage()}
    </div>
  );
}

export default App;