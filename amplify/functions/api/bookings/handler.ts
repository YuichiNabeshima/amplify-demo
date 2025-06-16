import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient, Booking, Customer, Partner } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type BookingResponse = {
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
  };
  partner: {
    id: string;
    companyName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

const getBookings = async (userId: string, userType: string): Promise<BookingResponse[]> => {
  let bookings: (Booking & {
    customer: Customer;
    partner: Partner;
  })[] = [];

  if (userType === 'CUSTOMER') {
    bookings = await prisma.booking.findMany({
      where: { customerId: userId },
      include: { customer: true, partner: true },
      orderBy: { date: 'desc' },
    });
  } else if (userType === 'PARTNER') {
    bookings = await prisma.booking.findMany({
      where: { partnerId: userId },
      include: { customer: true, partner: true },
      orderBy: { date: 'desc' },
    });
  }

  return bookings.map(booking => ({
    id: booking.id,
    date: booking.date,
    servicePlan: booking.servicePlan,
    status: booking.status,
    notes: booking.notes,
    price: booking.price,
    rating: booking.rating,
    customer: {
      id: booking.customer.id,
      name: booking.customer.name,
      email: booking.customer.email,
    },
    partner: {
      id: booking.partner.id,
      companyName: booking.partner.companyName,
      email: booking.partner.email,
    },
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }));
};

const createBooking = async (
  customerId: string,
  partnerId: string,
  data: {
    date: Date;
    servicePlan: string;
    notes?: string;
    price: number;
  }
): Promise<BookingResponse> => {
  const booking = await prisma.booking.create({
    data: {
      date: data.date,
      servicePlan: data.servicePlan,
      status: 'pending',
      notes: data.notes,
      price: data.price,
      customerId,
      partnerId,
    },
    include: { customer: true, partner: true },
  }) as Booking & { customer: Customer; partner: Partner };

  return {
    id: booking.id,
    date: booking.date,
    servicePlan: booking.servicePlan,
    status: booking.status,
    notes: booking.notes,
    price: booking.price,
    rating: booking.rating,
    customer: {
      id: booking.customer.id,
      name: booking.customer.name,
      email: booking.customer.email,
    },
    partner: {
      id: booking.partner.id,
      companyName: booking.partner.companyName,
      email: booking.partner.email,
    },
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authentication required' }),
      };
    }
    const token = authHeader.split(' ')[1];
    let decoded: { id: string; type: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; type: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    switch (event.requestContext.http.method) {
      case 'GET': {
        const bookings = await getBookings(decoded.id, decoded.type);
        return {
          statusCode: 200,
          body: JSON.stringify({ bookings }),
        };
      }
      case 'POST': {
        if (decoded.type !== 'CUSTOMER') {
          return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Only customers can create bookings' }),
          };
        }
        if (!event.body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request body is required' }),
          };
        }
        const { partnerId, date, servicePlan, notes, price } = JSON.parse(event.body);
        if (!partnerId || !date || !servicePlan || !price) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required fields' }),
          };
        }
        const booking = await createBooking(decoded.id, partnerId, {
          date: new Date(date),
          servicePlan,
          notes,
          price,
        });
        return {
          statusCode: 201,
          body: JSON.stringify({ booking }),
        };
      }
      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}; 