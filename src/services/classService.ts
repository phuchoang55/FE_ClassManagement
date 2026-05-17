import api from '@/lib/api';
import { Class, CreateClassRequest } from '@/types';

export const classService = {
  getAll: () => api.get<Class[]>('/classes').then((r) => r.data),

  getById: async (id: number) => {
    const classes = await api.get<Class[]>('/classes').then((r) => r.data);
    const cls = classes.find((c) => c.id === id);
    if (!cls) throw new Error('Class not found');
    return cls;
  },

  create: (data: CreateClassRequest) =>
    api.post<Class>('/classes', data).then((r) => r.data),

  update: (id: number, data: Partial<CreateClassRequest>) =>
    api.put<Class>(`/classes/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/classes/${id}`),
};
