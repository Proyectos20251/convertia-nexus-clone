
import { supabase } from "@/integrations/supabase/client";

export interface ReportData {
  employees: any[];
  performanceReviews: any[];
  timeRecords: any[];
  absences: any[];
  objectives: any[];
  trainingCourses: any[];
  enrollments: any[];
}

export const reportService = {
  async getReportData(filters?: {
    dateFrom?: string;
    dateTo?: string;
    department?: string;
    reportType?: string;
  }): Promise<ReportData> {
    try {
      // Base queries
      let employeesQuery = supabase.from('organization_employees').select('*');
      let performanceQuery = supabase.from('performance_reviews').select('*');
      let timeRecordsQuery = supabase.from('time_records').select('*');
      let absencesQuery = supabase.from('absences').select('*');
      let objectivesQuery = supabase.from('objectives').select('*');
      let trainingQuery = supabase.from('training_courses').select('*');
      let enrollmentsQuery = supabase.from('course_enrollments').select('*');

      // Apply filters
      if (filters?.department && filters.department !== 'all') {
        employeesQuery = employeesQuery.eq('department', filters.department);
      }

      if (filters?.dateFrom) {
        performanceQuery = performanceQuery.gte('created_at', filters.dateFrom);
        timeRecordsQuery = timeRecordsQuery.gte('created_at', filters.dateFrom);
        absencesQuery = absencesQuery.gte('start_date', filters.dateFrom);
        objectivesQuery = objectivesQuery.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        performanceQuery = performanceQuery.lte('created_at', filters.dateTo);
        timeRecordsQuery = timeRecordsQuery.lte('created_at', filters.dateTo);
        absencesQuery = absencesQuery.lte('end_date', filters.dateTo);
        objectivesQuery = objectivesQuery.lte('created_at', filters.dateTo);
      }

      // Execute queries
      const [
        { data: employees, error: employeesError },
        { data: performanceReviews, error: performanceError },
        { data: timeRecords, error: timeRecordsError },
        { data: absences, error: absencesError },
        { data: objectives, error: objectivesError },
        { data: trainingCourses, error: trainingError },
        { data: enrollments, error: enrollmentsError }
      ] = await Promise.all([
        employeesQuery,
        performanceQuery,
        timeRecordsQuery,
        absencesQuery,
        objectivesQuery,
        trainingQuery,
        enrollmentsQuery
      ]);

      // Check for errors
      if (employeesError) throw employeesError;
      if (performanceError) throw performanceError;
      if (timeRecordsError) throw timeRecordsError;
      if (absencesError) throw absencesError;
      if (objectivesError) throw objectivesError;
      if (trainingError) throw trainingError;
      if (enrollmentsError) throw enrollmentsError;

      return {
        employees: employees || [],
        performanceReviews: performanceReviews || [],
        timeRecords: timeRecords || [],
        absences: absences || [],
        objectives: objectives || [],
        trainingCourses: trainingCourses || [],
        enrollments: enrollments || []
      };
    } catch (error) {
      console.error("Error fetching report data:", error);
      throw error;
    }
  },

  generateAttendanceReport(data: ReportData) {
    // Process attendance data
    const attendanceStats = data.timeRecords.reduce((acc, record) => {
      const date = new Date(record.check_in).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRecords: data.timeRecords.length,
      dailyAttendance: attendanceStats,
      averageHours: data.timeRecords.length > 0 ? 8 : 0 // Simplified
    };
  },

  generatePerformanceReport(data: ReportData) {
    const avgScore = data.performanceReviews.length > 0
      ? data.performanceReviews.reduce((sum, review) => sum + (review.score || 0), 0) / data.performanceReviews.length
      : 0;

    return {
      totalReviews: data.performanceReviews.length,
      averageScore: avgScore,
      reviewsByPeriod: data.performanceReviews.reduce((acc, review) => {
        acc[review.period] = (acc[review.period] || 0) + 1;
        return acc;
      }, {})
    };
  },

  generateTrainingReport(data: ReportData) {
    const completedCourses = data.enrollments.filter(e => e.completed_at).length;
    const completionRate = data.enrollments.length > 0 
      ? (completedCourses / data.enrollments.length) * 100 
      : 0;

    return {
      totalCourses: data.trainingCourses.length,
      totalEnrollments: data.enrollments.length,
      completedCourses,
      completionRate
    };
  }
};
