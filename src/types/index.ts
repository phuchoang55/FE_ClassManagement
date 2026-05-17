// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Student';
}

// ─── Class ───────────────────────────────────────────────────────────────────
export interface Class {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  teacherId: number;
  teacher?: User;
}

export interface CreateClassRequest {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teacherId: number;
}

// ─── Schedule ────────────────────────────────────────────────────────────────
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export interface ClassSchedule {
  id: number;
  classId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:MM:SS"
  endTime: string;
  room?: string;
}

export interface CreateScheduleRequest {
  classId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
}

// ─── Attendance ──────────────────────────────────────────────────────────────
export type AttendanceStatus = 'Present' | 'Absent' | 'Not yet';

export interface Attendance {
  id: number;
  classId: number;
  studentId: number;
  date: string;
  status: AttendanceStatus;
  scheduleId?: number;
  student?: User;
  class?: Class;
  schedule?: ClassSchedule;
}

export interface UpdateAttendanceRequest {
  status: AttendanceStatus;
}

// ─── Student ─────────────────────────────────────────────────────────────────
export interface ClassStudent {
  classId: number;
  studentId: number;
  student?: User;
}
