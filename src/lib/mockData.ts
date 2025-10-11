import { Booking, Review, Tour, User } from "./types";

export const users: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "user" },
  { id: 2, name: "Admin", email: "admin@example.com", role: "admin" },
];

export const tours: Tour[] = [
  {
    id: 1,
    title: "Hạ Long Bay Retreat",
    location: "Quảng Ninh, Việt Nam",
    price: 2999000,
    duration: "3 ngày 2 đêm",
    image: "/next.svg",
    description:
      "Khám phá vịnh Hạ Long - di sản thiên nhiên thế giới với những hang động kỳ vĩ, hòn đảo độc đáo và hoạt động kayak thú vị.",
    rating: 4.7,
  },
  {
    id: 2,
    title: "Đà Lạt Romantic Escape",
    location: "Lâm Đồng, Việt Nam",
    price: 2599000,
    duration: "2 ngày 1 đêm",
    image: "/next.svg",
    description:
      "Trải nghiệm không khí trong lành của thành phố ngàn hoa, ghé thăm các điểm check-in nổi tiếng và thưởng thức ẩm thực địa phương.",
    rating: 4.5,
  },
  {
    id: 3,
    title: "Phú Quốc Island Discovery",
    location: "Kiên Giang, Việt Nam",
    price: 3999000,
    duration: "4 ngày 3 đêm",
    image: "/next.svg",
    description:
      "Thiên đường biển đảo với bãi cát trắng mịn, làn nước trong xanh và nhiều hoạt động giải trí hấp dẫn.",
    rating: 4.8,
  },
];

export const reviews: Review[] = [
  {
    id: 1,
    userId: 1,
    tourId: 1,
    rating: 5,
    comment: "Hành trình tuyệt vời, dịch vụ chu đáo!",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    tourId: 2,
    rating: 4,
    comment: "Khung cảnh đẹp, sẽ quay lại vào mùa hoa.",
    createdAt: new Date().toISOString(),
  },
];

export const bookings: Booking[] = [];