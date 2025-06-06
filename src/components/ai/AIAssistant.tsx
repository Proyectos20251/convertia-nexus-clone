
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, AlertCircle } from 'lucide-react';
import { aiService, AIChat } from '@/services/aiService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageInfo, setUsageInfo] = useState({ canUse: true, remaining: 0 });
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      checkUsageLimit();
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const checkUsageLimit = async () => {
    try {
      if (!user) return;
      const limit = await aiService.checkUsageLimit(user.id);
      setUsageInfo(limit);
    } catch (error) {
      console.error('Error checking usage limit:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      if (!user) return;
      const history = await aiService.getChatHistory(user.id);
      const chatMessages: ChatMessage[] = [];
      
      history.reverse().forEach(chat => {
        chatMessages.push({
          role: 'user',
          content: chat.message,
          timestamp: new Date(chat.created_at)
        });
        chatMessages.push({
          role: 'assistant',
          content: chat.response,
          timestamp: new Date(chat.created_at)
        });
      });
      
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !usageInfo.canUse) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI service here - for now, we'll simulate a response
      const response = await simulateAIResponse(userMessage.content);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save to database
      await aiService.saveChatInteraction(user.id, userMessage.content, response);
      await aiService.incrementUsage(user.id);
      
      // Update usage limit
      await checkUsageLimit();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al procesar el mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response - replace with actual AI integration
  const simulateAIResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      "Hola, soy tu asistente de RRHH. ¿En qué puedo ayudarte hoy?",
      "Puedo ayudarte con información sobre políticas de la empresa, procesos de RRHH, y responder preguntas generales.",
      "Para obtener información específica sobre tu nómina o beneficios, te recomiendo contactar directamente al departamento de RRHH.",
      "¿Hay algo específico sobre recursos humanos en lo que pueda asistirte?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Asistente IA</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={usageInfo.canUse ? "default" : "destructive"}>
                {usageInfo.remaining} consultas restantes
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 border rounded-lg">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>¡Hola! Soy tu asistente de RRHH. ¿En qué puedo ayudarte?</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[70%]">
                    <div className="p-2 rounded-full bg-gray-500">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {!usageInfo.canUse && (
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Has alcanzado el límite diario de consultas. Inténtalo mañana.
              </p>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading || !usageInfo.canUse}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim() || !usageInfo.canUse}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
