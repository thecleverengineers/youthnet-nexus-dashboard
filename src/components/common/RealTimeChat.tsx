import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Search,
  UserPlus,
  Settings,
  CheckCheck,
  Clock,
  Circle
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  status: 'sent' | 'delivered' | 'read';
  avatar?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  unreadCount?: number;
  lastMessage?: string;
  department?: string;
}

interface RealTimeChatProps {
  currentUser?: string;
  onNewMessage?: (message: Message) => void;
}

export const RealTimeChat = ({ 
  currentUser = 'John Doe',
  onNewMessage 
}: RealTimeChatProps) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Wilson',
      avatar: '/api/placeholder/32/32',
      status: 'online',
      unreadCount: 3,
      lastMessage: 'Can you review the latest report?',
      department: 'Marketing'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      avatar: '/api/placeholder/32/32',
      status: 'away',
      lastMessage: 'Thanks for the update!',
      department: 'Development'
    },
    {
      id: '3',
      name: 'Emily Davis',
      avatar: '/api/placeholder/32/32',
      status: 'offline',
      lastSeen: '2 hours ago',
      lastMessage: 'Let\'s schedule a meeting',
      department: 'HR'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sarah Wilson',
      content: 'Hi! Can you review the marketing report I sent?',
      timestamp: new Date(Date.now() - 600000),
      type: 'text',
      status: 'read',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: '2',
      sender: currentUser,
      content: 'Sure! I\'ll take a look at it this afternoon.',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: '3',
      sender: 'Sarah Wilson',
      content: 'Great! Please let me know if you have any feedback.',
      timestamp: new Date(Date.now() - 120000),
      type: 'text',
      status: 'read',
      avatar: '/api/placeholder/32/32'
    }
  ]);

  const [typingUsers] = useState<string[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  const sendMessage = () => {
    if (message.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: currentUser,
        content: message,
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };

      setMessages([...messages, newMessage]);
      setMessage('');
      onNewMessage?.(newMessage);

      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'away':
        return 'bg-yellow-400';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[600px] bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Messages</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10 bg-white/5 border-white/20"
            />
          </div>
        </div>

        {/* Contacts List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id 
                    ? 'bg-white/10 border border-white/20' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(contact.status)} rounded-full border-2 border-black`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{contact.name}</h4>
                    {contact.unreadCount && (
                      <Badge className="bg-blue-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.lastMessage || 'No messages yet'}
                    </p>
                    {contact.status === 'offline' && contact.lastSeen && (
                      <span className="text-xs text-muted-foreground">{contact.lastSeen}</span>
                    )}
                  </div>
                  {contact.department && (
                    <span className="text-xs text-muted-foreground">{contact.department}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(selectedContact.status)} rounded-full border-2 border-black`} />
                </div>
                
                <div>
                  <h3 className="font-semibold">{selectedContact.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedContact.status === 'online' ? 'Online' : 
                     selectedContact.status === 'away' ? 'Away' : 
                     selectedContact.lastSeen ? `Last seen ${selectedContact.lastSeen}` : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[70%] ${msg.sender === currentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.sender !== currentUser && (
                        <Avatar className="h-8 w-8 mt-auto">
                          <AvatarImage src={msg.avatar} alt={msg.sender} />
                          <AvatarFallback>{msg.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-lg p-3 ${
                        msg.sender === currentUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/10 border border-white/20'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          msg.sender === currentUser ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                          {msg.sender === currentUser && getStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <Circle className="h-2 w-2 text-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <Circle className="h-2 w-2 text-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <Circle className="h-2 w-2 text-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="pr-12 bg-white/5 border-white/20"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button onClick={sendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};