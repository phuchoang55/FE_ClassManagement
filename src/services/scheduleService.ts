import api from '@/lib/api';
import { ClassSchedule, CreateScheduleRequest } from '@/types';

export const scheduleService = {
  getByClass: (classId: number) =>
    api.get<any[]>(`/classes/${classId}/schedules`).then((r) => r.data),

  create: (classId: number, data: any) =>
    api.post<any>(`/classes/${classId}/schedules`, data).then((r) => r.data),

  update: (classId: number, scheduleId: number, data: any) =>
    api.put<any>(`/classes/${classId}/schedules/${scheduleId}`, data).then((r) => r.data),

  delete: (classId: number, scheduleId: number) => 
    api.delete(`/classes/${classId}/schedules/${scheduleId}`),
};
