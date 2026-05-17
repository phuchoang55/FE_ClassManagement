import api from '@/lib/api';
import { User, ClassStudent } from '@/types';

export const studentService = {
  getAll: () => api.get<User[]>('/users').then((r) => r.data),

  getByClass: (classId: number) =>
    api.get<ClassStudent[]>(`/student/class/${classId}`).then((r) => r.data),

  addToClass: (classId: number, studentId: number) =>
    api.post('/student', { classId, studentId }).then((r) => r.data),

  removeFromClass: (classId: number, studentId: number) =>
    api.delete(`/student/${classId}/${studentId}`),
};
