import api from '@/lib/api';
import { Attendance, UpdateAttendanceRequest } from '@/types';

export const attendanceService = {
  getByClassAndDate: (classId: number, date: string) =>
    api
      .get<Attendance[]>(`/attendance/class/${classId}`, { params: { date } })
      .then((r) => r.data),

  getByStudent: (studentId: number, classId: number) =>
    api
      .get<Attendance[]>(`/attendance/student/${studentId}/class/${classId}`)
      .then((r) => r.data),

  update: (id: number, data: UpdateAttendanceRequest) =>
    api.put<Attendance>(`/attendance/${id}`, data).then((r) => r.data),

  markBulk: (
    classId: number,
    date: string,
    records: { studentId: number; status: string }[]
  ) =>
    api
      .post('/attendance/bulk', { classId, date, records })
      .then((r) => r.data),
};
