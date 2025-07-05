import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, Mic, MicOff, Plus, MessageSquare, LogOut, Volume2, VolumeX, Trash2, Edit3, Search, Crown, CreditCard } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

// Add proper typing for Web Speech API
interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new(): SpeechRecognitionType;
    };
  }
}

const ChatInterface = () => {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [subscription, setSubscription] = useState({
    subscribed: false,
    subscription_tier: 'Base',
    daily_message_count: 0,
    daily_message_limit: 100
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  const recognition = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadChats();
      checkSubscription();
    }
  }, [user]);

  useEffect(() => {
    const filtered = chats.filter(chat => 
      chat.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [chats, searchInput]);

  const checkSubscription = async () => {
    try {
      const response = await supabase.functions.invoke('check-subscription');
      if (response.data) {
        setSubscription(response.data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribe = async (plan: string) => {
    try {
      const response = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });
      if (response.data?.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive"
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await supabase.functions.invoke('customer-portal');
      if (response.data?.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId);
    }
  }, [currentChatId]);

  const loadChats = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading chats:', error);
    } else {
      setChats(data || []);
      if (data && data.length > 0 && !currentChatId) {
        setCurrentChatId(data[0].id);
      }
    }
  };

  const loadMessages = async (chatId: string) => {
    console.log('Loading messages for chat:', chatId);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      console.log('Loaded messages:', data);
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'assistant'
      }));
      setMessages(typedMessages);
    }
  };

  const generateChatTitle = (userMessage: string) => {
    // Extract key words and create a meaningful title
    const words = userMessage.toLowerCase().split(' ').filter(word => 
      word.length > 2 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'why'].includes(word)
    );
    
    if (words.length === 0) return 'New Chat';
    
    // Take first 3 meaningful words and capitalize them
    const title = words.slice(0, 3).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  };

  const updateChatTitle = async (chatId: string, title: string) => {
    const { error } = await supabase
      .from('chats')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', chatId);

    if (error) {
      console.error('Error updating chat title:', error);
    } else {
      loadChats();
    }
  };

  const deleteChat = async (chatId: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) {
        console.error('Error deleting chat:', error);
        toast({
          title: "Error",
          description: "Failed to delete chat",
          variant: "destructive"
        });
      } else {
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setMessages([]);
        }
        loadChats();
        toast({
          title: "Chat Deleted",
          description: "Chat has been successfully deleted"
        });
      }
    }
  };

  const createNewChat = async () => {
    const { data, error } = await supabase
      .from('chats')
      .insert([{ user_id: user?.id, title: 'New Chat' }])
      .select()
      .single();

    if (error) {
      console.error('Error creating chat:', error);
    } else {
      setCurrentChatId(data.id);
      setMessages([]);
      loadChats();
    }
  };

  const saveMessage = async (content: string, role: 'user' | 'assistant', chatId?: string) => {
    const targetChatId = chatId || currentChatId;
    if (!targetChatId) {
      console.error('No chat ID available for saving message');
      return;
    }

    console.log('Saving message to chat:', targetChatId, 'role:', role);
    const { error } = await supabase
      .from('messages')
      .insert([{
        chat_id: targetChatId,
        user_id: user?.id,
        content,
        role
      }]);

    if (error) {
      console.error('Error saving message:', error);
    } else {
      console.log('Message saved successfully');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && autoSpeak) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      recognition.current?.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    // Check message limit
    if (subscription.daily_message_count >= subscription.daily_message_limit) {
      toast({
        title: "Message Limit Reached",
        description: `You've reached your daily limit of ${subscription.daily_message_limit} messages. Upgrade your plan to send more messages.`,
        variant: "destructive"
      });
      setShowSubscriptionModal(true);
      return;
    }

    let chatId = currentChatId;
    if (!chatId) {
      const { data, error } = await supabase
        .from('chats')
        .insert([{ user_id: user?.id, title: 'New Chat' }])
        .select()
        .single();

      if (error) {
        console.error('Error creating chat:', error);
        return;
      }
      chatId = data.id;
      setCurrentChatId(chatId);
    }

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Save user message
    await saveMessage(userMessage, 'user', chatId);

    try {
      console.log('Sending request to Supabase edge function...');
      
      const response = await supabase.functions.invoke('chat-deepseek', {
        body: {
          message: userMessage,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to get response from AI');
      }

      const assistantMessage = response.data?.message || "I received your message but couldn't generate a proper response.";
      
      // Add assistant message to UI
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantMessage,
        role: 'assistant',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newAssistantMessage]);

      // Save assistant message
      await saveMessage(assistantMessage, 'assistant', chatId);

      // Auto-generate chat title if this is the first message
      if (messages.length === 0) { // No messages existed before this user message
        const generatedTitle = generateChatTitle(userMessage);
        await updateChatTitle(chatId, generatedTitle);
      }

      // Update message count and refresh subscription
      setSubscription(prev => ({
        ...prev,
        daily_message_count: prev.daily_message_count + 1
      }));
      
      // Update message count in database
      await supabase.functions.invoke('check-subscription');

      // Speak the response only if auto-speak is enabled
      speakText(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const fallbackMessage = "I'm having trouble connecting to the AI service right now. Please try again.";
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackMessage,
        role: 'assistant',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newAssistantMessage]);
      await saveMessage(fallbackMessage, 'assistant', chatId);
      
      toast({
        title: "Connection Issue",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              HYDRACHAT
            </h1>
            <div className="flex gap-2">
              <Button 
                onClick={() => setAutoSpeak(!autoSpeak)} 
                variant="ghost" 
                size="sm"
                title={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
                className={autoSpeak ? "text-blue-600" : "text-gray-400"}
              >
                {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button onClick={signOut} variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={createNewChat} className="w-full mb-4">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          
          {/* Subscription Status */}
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {subscription.subscription_tier} Plan
              </span>
              <Crown className={`h-4 w-4 ${subscription.subscribed ? 'text-yellow-500' : 'text-gray-400'}`} />
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {subscription.daily_message_count}/{subscription.daily_message_limit} messages today
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(subscription.daily_message_count / subscription.daily_message_limit) * 100}%` }}
              ></div>
            </div>
            {!subscription.subscribed ? (
              <Button 
                onClick={() => setShowSubscriptionModal(true)} 
                size="sm" 
                className="w-full text-xs"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            ) : (
              <Button 
                onClick={handleManageSubscription} 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
              >
                Manage Plan
              </Button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search chats..."
              className="pl-10 h-9 text-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div key={chat.id} className="group relative">
                <Button
                  variant={currentChatId === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left pr-10"
                  onClick={() => setCurrentChatId(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  title="Delete chat"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">H</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to HYDRACHAT</h2>
                <p className="text-gray-500">Start a conversation with DeepSeek R1 using voice or text</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card className={`max-w-[70%] ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <CardContent className="p-4">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-[70%] bg-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-12 h-12"
                  disabled={isLoading}
                />
                <Button
                  onClick={toggleListening}
                  variant="ghost"
                  size="sm"
                  className={`absolute right-2 top-2 h-8 w-8 p-0 ${
                    isListening ? 'text-red-500' : 'text-gray-400'
                  }`}
                  disabled={!('webkitSpeechRecognition' in window)}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">Choose Your Plan</h3>
            
            <div className="space-y-4">
              {/* Base Plan */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Base</h4>
                  <span className="text-2xl font-bold">Free</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">100 messages per day</p>
                <Button 
                  disabled 
                  variant="outline" 
                  className="w-full"
                >
                  Current Plan
                </Button>
              </div>

              {/* Plus Plan */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Plus</h4>
                  <span className="text-2xl font-bold">$5<span className="text-sm font-normal">/month</span></span>
                </div>
                <p className="text-sm text-gray-600 mb-2">300 messages per day</p>
                <Button 
                  onClick={() => handleSubscribe('Plus')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Upgrade to Plus
                </Button>
              </div>

              {/* Pro Plus Plan */}
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Pro Plus</h4>
                  <span className="text-2xl font-bold">$8<span className="text-sm font-normal">/month</span></span>
                </div>
                <p className="text-sm text-gray-600 mb-2">500 messages per day</p>
                <Button 
                  onClick={() => handleSubscribe('Pro Plus')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Upgrade to Pro Plus
                </Button>
              </div>
            </div>

            <Button 
              onClick={() => setShowSubscriptionModal(false)}
              variant="ghost" 
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;