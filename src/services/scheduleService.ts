import api from '@/lib/api';
import { ClassSchedule, CreateScheduleRequest } from '@/types';

export const scheduleService = {
  getByClass: (classId: number) =>
    api.get<ClassSchedule[]>(`/schedule/class/${classId}`).then((r) => r.data),

  create: (data: CreateScheduleRequest) =>
    api.post<ClassSchedule>('/schedule', data).then((r) => r.data),

  update: (id: number, data: Partial<CreateScheduleRequest>) =>
    api.put<ClassSchedule>(`/schedule/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/schedule/${id}`),
};
