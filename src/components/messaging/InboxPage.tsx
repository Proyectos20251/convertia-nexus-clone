
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Plus, Search, Send } from 'lucide-react';
import { messageService, Message } from '@/services/messageService';
import { employeeService, Employee } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const InboxPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchEmployees();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      if (!user) return;
      const data = await messageService.getUserMessages(user.id);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await messageService.sendMessage(newMessage);
      toast.success('Mensaje enviado correctamente');
      setDialogOpen(false);
      setNewMessage({ recipient_id: '', subject: '', content: '' });
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar el mensaje');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-6">Cargando mensajes...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bandeja de entrada</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo mensaje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enviar mensaje</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Label htmlFor="recipient">Destinatario</Label>
                <Select value={newMessage.recipient_id} onValueChange={(value) => setNewMessage({...newMessage, recipient_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar destinatario" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Mensaje</Label>
                <Textarea
                  id="content"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar mensajes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No tienes mensajes</p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={`cursor-pointer transition-colors ${!message.is_read ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-base">{message.subject}</CardTitle>
                      {!message.is_read && <Badge variant="default" className="text-xs">Nuevo</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">
                      De: {message.sender?.full_name || 'Usuario'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardHeader>
              <CardContent 
                className="pt-0"
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read) {
                    handleMarkAsRead(message.id);
                  }
                }}
              >
                <p className="text-sm text-gray-700 line-clamp-2">{message.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <p className="text-sm text-gray-600">
                De: {selectedMessage.sender?.full_name} • {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </DialogHeader>
            <div className="mt-4">
              <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InboxPage;
