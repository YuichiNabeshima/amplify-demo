"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MapPin, Star, User, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

interface Booking {
  id: string
  companyName: string
  servicePlan: string
  date: string
  status: "upcoming" | "completed" | "cancelled"
  address: string
  price: string
  rating?: number
}

export default function DashboardPage() {
  const [customer] = useState<Customer>({
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '123-456-7890',
    createdAt: new Date().toISOString()
  })

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      companyName: 'Paint Service Co.',
      servicePlan: 'Exterior Painting',
      date: new Date().toISOString(),
      status: 'upcoming',
      address: '123 Main St, New York, NY',
      price: '$1,500'
    },
    {
      id: '2',
      companyName: 'Renovation Pro',
      servicePlan: 'Interior Painting',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      address: '456 Park Ave, New York, NY',
      price: '$2,000',
      rating: 5
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="customer" isAuthenticated={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-white text-lg font-semibold">
                      {customer.name
                        ? customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : customer.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name || 'Customer'}</h3>
                    <p className="text-sm text-gray-600">
                      Registered: {new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>{customer.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/partners">
                  <Button className="w-full bg-primary hover:bg-primary/90">Book a New Service</Button>
                </Link>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Bookings
                  </span>
                  <Badge variant="secondary">{bookings.length} bookings</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{booking.companyName}</h4>
                          <p className="text-sm text-gray-600">{booking.servicePlan}</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status === 'completed' ? 'Completed' : 
                             booking.status === 'upcoming' ? 'Upcoming' : 'Cancelled'}
                          </Badge>
                          <p className="text-lg font-semibold text-primary mt-1">{booking.price}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "long"
                            })}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{booking.address}</span>
                        </div>
                        {booking.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-2 text-yellow-400" />
                            <span>{booking.rating} / 5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
