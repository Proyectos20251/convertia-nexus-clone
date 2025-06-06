
import { supabase } from "@/integrations/supabase/client";

export interface CalendarEvent {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  start_datetime: string;
  end_datetime: string;
  location: string | null;
  event_type: string;
  created_at: string;
  updated_at: string;
  participants?: EventParticipant[];
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  created_at: string;
  user?: {
    full_name: string;
  };
}

export const calendarService = {
  // Get all events - simplified without joins for now
  async getEvents(): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_datetime', { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }

    return data || [];
  },

  // Create event
  async createEvent(eventData: {
    title: string;
    description?: string;
    start_datetime: string;
    end_datetime: string;
    location?: string;
    event_type?: string;
    participants?: string[];
  }): Promise<CalendarEvent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .insert({
        creator_id: user.id,
        title: eventData.title,
        description: eventData.description,
        start_datetime: eventData.start_datetime,
        end_datetime: eventData.end_datetime,
        location: eventData.location,
        event_type: eventData.event_type || 'meeting'
      })
      .select()
      .single();

    if (eventError) {
      console.error("Error creating event:", eventError);
      throw eventError;
    }

    // Add participants if provided
    if (eventData.participants && eventData.participants.length > 0) {
      const participantInserts = eventData.participants.map(userId => ({
        event_id: event.id,
        user_id: userId
      }));

      const { error: participantsError } = await supabase
        .from('event_participants')
        .insert(participantInserts);

      if (participantsError) {
        console.error("Error adding participants:", participantsError);
      }
    }

    return event;
  }
};
