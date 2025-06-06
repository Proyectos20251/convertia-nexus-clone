
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon, User, Users } from "lucide-react";
import { calendarService, CalendarEvent } from "@/services/calendarService";
import CreateEventDialog from "@/components/calendar/CreateEventDialog";
import { toast } from "sonner";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await calendarService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error al cargar los eventos');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter events for the selected date
  const selectedDateStr = date ? date.toDateString() : "";
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start_datetime);
    return eventDate.toDateString() === selectedDateStr;
  });
  
  // Get event type badge color
  const getEventBadgeColor = (type: string) => {
    switch(type) {
      case "meeting": return "bg-blue-100 text-blue-800";
      case "review": return "bg-purple-100 text-purple-800";
      case "training": return "bg-green-100 text-green-800";
      case "interview": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format time from date string
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="p-6">Cargando calendario...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Calendario</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Calendario</CardTitle>
                <CardDescription>
                  {date ? date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md p-2"
                />
                
                <div className="mt-6 space-y-3">
                  <CreateEventDialog onEventCreated={fetchEvents} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">
                    {date ? date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : ""}
                  </CardTitle>
                  <CardDescription>
                    {todaysEvents.length} eventos programados
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="day">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="day">Día</TabsTrigger>
                    <TabsTrigger value="week">Semana</TabsTrigger>
                    <TabsTrigger value="month">Mes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="day" className="mt-4">
                    {todaysEvents.length > 0 ? (
                      <div className="space-y-4">
                        {todaysEvents.map((event) => (
                          <div key={event.id} className="flex border rounded-md p-4 hover:shadow-sm transition-all">
                            <div className="mr-4 flex flex-col items-center">
                              <div className="text-lg font-bold">
                                {formatTime(event.start_datetime)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatTime(event.end_datetime)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{event.title}</h3>
                                <Badge className={getEventBadgeColor(event.event_type)}>
                                  {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-gray-600">
                                {event.participants && event.participants.length > 0 ? (
                                  <div className="flex items-center mr-4">
                                    <Users className="h-4 w-4 mr-1" />
                                    {event.participants.length} asistentes
                                  </div>
                                ) : (
                                  <div className="flex items-center mr-4">
                                    <User className="h-4 w-4 mr-1" />
                                    Individual
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {Math.round((new Date(event.end_datetime).getTime() - new Date(event.start_datetime).getTime()) / (1000 * 60))} min
                                </div>
                              </div>
                              {event.location && (
                                <div className="text-sm text-gray-500 mt-1">
                                  📍 {event.location}
                                </div>
                              )}
                              {event.description && (
                                <div className="text-sm text-gray-600 mt-2">
                                  {event.description}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <CalendarIcon className="h-12 w-12 mb-3 opacity-30" />
                        <p>No hay eventos programados para este día</p>
                        <CreateEventDialog onEventCreated={fetchEvents} />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="week" className="mt-4">
                    <div className="text-center text-gray-500 py-8">
                      Vista semanal en desarrollo
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="month" className="mt-4">
                    <div className="text-center text-gray-500 py-8">
                      Vista mensual en desarrollo
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
