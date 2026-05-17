import api from '@/lib/api';
import { User, ClassStudent } from '@/types';

export const studentService = {
  getAll: () => api.get<User[]>('/users').then((r) => r.data),

  getByClass: (classId: number) =>
    api.get<any[]>(`/classes/${classId}/students`).then((r) => r.data),

  addToClass: (classId: number, studentEmail: string) =>
    api.post(`/classes/${classId}/students`, { studentEmail }).then((r) => r.data),

  removeFromClass: (classId: number, studentId: number) =>
    api.delete(`/classes/${classId}/students/${studentId}`),
    
  getMyClasses: () => 
    api.get<any[]>('/student/classes').then((r) => r.data),
    
  getMyClassDetail: (classId: number) =>
    api.get<any>(`/student/classes/${classId}`).then((r) => r.data),
};
