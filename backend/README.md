# TravelGo Backend (Express + Sequelize + MySQL)

Kiến trúc:
- Node.js + Express
- Sequelize ORM
- MySQL
- Xác thực JWT
- Upload ảnh (Cloudinary)
- Modules: auth, users, tours, bookings, reviews, admin

## Khởi chạy

1) Tạo file `.env` (tham khảo `.env.example`)
2) Cài dependencies:
   npm install
3) Chạy dev:
   npm run dev

## Cấu trúc

backend/
├── src/
│   ├── server.ts
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   ├── index.ts
│   │   ├── User.ts
│   │   ├── Tour.ts
│   │   ├── Booking.ts
│   │   └── Review.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── tours.ts
│   │   ├── bookings.ts
│   │   ├── reviews.ts
│   │   └── admin.ts
│   └── middleware/
│       └── auth.ts
├── package.json
└── .env.example

## Kết nối frontend

Thiết lập biến môi trường ở frontend: `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

## Ghi chú

- Cần tạo database MySQL và cập nhật chuỗi kết nối trong `.env`.
- Sử dụng `sequelize-cli` để tạo migrations nếu cần.