
import { supabase } from "@/integrations/supabase/client";

export interface TimeRecord {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  employee?: {
    first_name: string;
    last_name: string;
    department: string | null;
    position: string | null;
  };
}

export interface TimeStatistics {
  totalHours: number;
  averageHoursPerDay: number;
  totalDays: number;
  weeklyHours: { day: string; hours: number }[];
}

export const timeManagementService = {
  // Get active time record for a user
  async getActiveRecord(userId: string): Promise<TimeRecord | null> {
    const { data, error } = await supabase
      .from('time_records')
      .select('*')
      .eq('user_id', userId)
      .is('check_out', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No active record found
      }
      console.error("Error fetching active time record:", error);
      throw error;
    }

    return data;
  },

  // Start a time record (clock in)
  async clockIn(userId: string, description?: string): Promise<TimeRecord> {
    const { data, error } = await supabase
      .from('time_records')
      .insert({
        user_id: userId,
        check_in: new Date().toISOString(),
        description
      })
      .select()
      .single();

    if (error) {
      console.error("Error starting time record:", error);
      throw error;
    }

    return data;
  },

  // End a time record (clock out)
  async clockOut(recordId: string): Promise<void> {
    const { error } = await supabase
      .from('time_records')
      .update({
        check_out: new Date().toISOString()
      })
      .eq('id', recordId);

    if (error) {
      console.error("Error ending time record:", error);
      throw error;
    }
  },

  // Get user's time records history
  async getUserTimeRecords(userId: string, limit?: number): Promise<TimeRecord[]> {
    const query = supabase
      .from('time_records')
      .select('*')
      .eq('user_id', userId)
      .order('check_in', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching time records:", error);
      throw error;
    }

    return data || [];
  },

  // Get time records for all users (admin only)
  async getAllTimeRecords(limit?: number): Promise<TimeRecord[]> {
    const query = supabase
      .from('time_records')
      .select(`
        *,
        employee:user_id(
          first_name,
          last_name,
          department,
          position
        )
      `)
      .order('check_in', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching all time records:", error);
      throw error;
    }

    return data || [];
  },

  // Get time records for team members (manager only)
  async getTeamTimeRecords(managerId: string, limit?: number): Promise<TimeRecord[]> {
    // First, get the department of the manager
    const { data: managerData, error: managerError } = await supabase
      .from('profiles')
      .select('department')
      .eq('id', managerId)
      .single();

    if (managerError) {
      console.error("Error fetching manager profile:", managerError);
      throw managerError;
    }

    if (!managerData.department) {
      return []; // Manager doesn't have a department assigned
    }

    // Get team members in the same department
    const { data: teamMembersData, error: teamError } = await supabase
      .from('profiles')
      .select('id')
      .eq('department', managerData.department)
      .neq('id', managerId); // Exclude the manager

    if (teamError) {
      console.error("Error fetching team members:", teamError);
      throw teamError;
    }

    if (!teamMembersData.length) {
      return []; // No team members found
    }

    // Get time records for all team members
    const teamMemberIds = teamMembersData.map(member => member.id);
    
    const query = supabase
      .from('time_records')
      .select(`
        *,
        employee:user_id(
          first_name,
          last_name,
          department,
          position
        )
      `)
      .in('user_id', teamMemberIds)
      .order('check_in', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching team time records:", error);
      throw error;
    }

    return data || [];
  },

  // Calculate time statistics for a user
  async calculateUserStatistics(userId: string): Promise<TimeStatistics> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('time_records')
      .select('*')
      .eq('user_id', userId)
      .gte('check_in', thirtyDaysAgo.toISOString())
      .not('check_out', 'is', null);

    if (error) {
      console.error("Error fetching time statistics:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        totalHours: 0,
        averageHoursPerDay: 0,
        totalDays: 0,
        weeklyHours: [
          { day: 'Lun', hours: 0 },
          { day: 'Mar', hours: 0 },
          { day: 'Mié', hours: 0 },
          { day: 'Jue', hours: 0 },
          { day: 'Vie', hours: 0 },
          { day: 'Sáb', hours: 0 },
          { day: 'Dom', hours: 0 }
        ]
      };
    }

    let totalHours = 0;
    const dailyHours = new Map<string, number>();
    const weeklyHours = [
      { day: 'Lun', hours: 0 },
      { day: 'Mar', hours: 0 },
      { day: 'Mié', hours: 0 },
      { day: 'Jue', hours: 0 },
      { day: 'Vie', hours: 0 },
      { day: 'Sáb', hours: 0 },
      { day: 'Dom', hours: 0 }
    ];

    data.forEach(record => {
      if (record.check_out) {
        const checkIn = new Date(record.check_in);
        const checkOut = new Date(record.check_out);
        const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

        totalHours += hours;

        // Group by day
        const dateKey = checkIn.toISOString().split('T')[0];
        dailyHours.set(dateKey, (dailyHours.get(dateKey) || 0) + hours);

        // Group by weekday
        const weekday = checkIn.getDay(); // 0 = Sunday, 1 = Monday, ...
        const weekdayIndex = weekday === 0 ? 6 : weekday - 1; // Adjust to 0 = Monday, ... 6 = Sunday
        weeklyHours[weekdayIndex].hours += hours;
      }
    });

    return {
      totalHours: parseFloat(totalHours.toFixed(1)),
      totalDays: dailyHours.size,
      averageHoursPerDay: parseFloat((totalHours / Math.max(dailyHours.size, 1)).toFixed(1)),
      weeklyHours
    };
  }
};
