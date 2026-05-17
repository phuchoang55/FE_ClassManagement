# ClassManagement – Frontend

Hệ thống quản lý lớp học, lịch học và điểm danh xây dựng bằng **Next.js 16 (App Router)** + **TypeScript** + **Tailwind CSS**.

## 🚀 Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Next.js | 16 | Framework React (App Router) |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Zustand | latest | State management (auth) |
| Axios | latest | HTTP client |
| React Hook Form | latest | Form handling |
| Lucide React | latest | Icons |

## 📁 Cấu trúc thư mục

```
src/
├── app/                        # Next.js App Router pages
│   ├── login/                  # Trang đăng nhập
│   ├── unauthorized/           # Trang không có quyền
│   └── dashboard/              # Khu vực chính (protected)
│       ├── page.tsx            # Dashboard tổng quan
│       ├── layout.tsx          # Layout có Sidebar + Header
│       ├── classes/            # Quản lý lớp học
│       │   ├── page.tsx        # Danh sách lớp
│       │   ├── create/         # Tạo lớp mới
│       │   └── [id]/           # Chi tiết & chỉnh sửa lớp
│       ├── students/           # Quản lý học sinh
│       ├── schedule/           # Quản lý lịch học
│       └── attendance/         # Điểm danh
├── components/
│   ├── auth/AuthGuard.tsx      # Route protection component
│   ├── layout/
│   │   ├── Sidebar.tsx         # Sidebar điều hướng
│   │   └── Header.tsx          # Thanh tiêu đề
│   └── ui/
│       ├── Alert.tsx           # Thông báo
│       └── LoadingSpinner.tsx  # Loading indicator
├── lib/
│   └── api.ts                  # Axios instance + JWT interceptor
├── services/                   # API service layer
│   ├── authService.ts
│   ├── classService.ts
│   ├── scheduleService.ts
│   ├── attendanceService.ts
│   └── studentService.ts
├── store/
│   └── authStore.ts            # Zustand auth store
└── types/
    └── index.ts                # TypeScript interfaces
```

## ⚙️ Cài đặt & Chạy

### 1. Clone và cài dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> Đảm bảo Backend API đang chạy tại port 5000 (hoặc điều chỉnh URL phù hợp).

### 3. Chạy môi trường Development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### 4. Build Production

```bash
npm run build
npm start
```

## 🗺️ Tính năng

- ✅ **Đăng nhập** với JWT authentication
- ✅ **Dashboard** tổng quan thống kê
- ✅ **Quản lý lớp học** – thêm, sửa, xóa, xem chi tiết
- ✅ **Quản lý học sinh** – danh sách, tìm kiếm
- ✅ **Lịch học** – xem và thêm lịch học theo buổi/phòng
- ✅ **Điểm danh** – điểm danh theo lớp và ngày
- ✅ **Route protection** theo vai trò (Admin / Teacher / Student)
- ✅ **Responsive sidebar** có thể thu gọn

## 🔗 Backend

Repository Backend (.NET): [BE_ClassManagement](../BE_ClassManagement)
