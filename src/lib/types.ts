export type UserRole = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Tour {
  id: number;
  title: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  description: string;
  rating: number; // average rating 0-5
}

export interface Booking {
  id: number;
  userId: number;
  tourId: number;
  status: "booked" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: number;
  userId: number;
  tourId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}