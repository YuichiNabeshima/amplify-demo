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
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  specialties: string[];
  price: string;
  servicePlans: {
    id: string;
    name: string;
    price: string;
    description: string;
  }[];
}

export interface PartnersResponse {
  partners: Partner[];
  totalPages: number;
}

export interface Booking {
  id: string;
  date: Date;
  servicePlan: string;
  status: string;
  notes: string | null;
  price: number;
  rating: number | null;
  customer: {
    id: string;
    name: string | null;
    email: string;
    phone?: string;
    address?: string;
  };
  partner: {
    id: string;
    companyName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
} 