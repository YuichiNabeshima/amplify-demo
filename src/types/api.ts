export interface User {
  id: string;
  email: string;
  type: string;
  name?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface VerifyResponse {
  isAuthenticated: boolean;
  userType: string;
}

export interface Partner {
  id: string;
  email: string;
  name: string;
  companyName: string;
  businessPhone: string;
  phone: string;
  address: string;
  description: string;
  images: string[];
  specialties: string[];
  price: string;
  rating: number;
  reviewCount: number;
  servicePlans: {
    id: string;
    name: string;
    price: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnersResponse {
  partners: Partner[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  servicePlan: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  address: string;
  price: string;
  notes?: string;
} 