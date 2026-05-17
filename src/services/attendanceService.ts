import api from '@/lib/api';
import { Attendance, UpdateAttendanceRequest } from '@/types';

export const attendanceService = {
  getByClassAndDate: (classId: number, date: string, scheduleId?: number) =>
    api
      .get<any[]>(`/attendance/${classId}`, { params: { date, scheduleId } })
      .then((r) => r.data),

  markBulk: (
    classId: number,
    date: string,
    records: { studentId: number; status: string }[],
    scheduleId?: number
  ) =>
    api
      .post(`/attendance/${classId}`, { date, scheduleId, records })
      .then((r) => r.data),
};
