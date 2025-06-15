"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MapPin, Star, User, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Booking {
  id: string
  companyName: string
  servicePlan: string
  date: string
  status: "completed" | "upcoming" | "cancelled"
  address: string
  price: string
  rating?: number
}

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  createdAt: string
}

export default function DashboardPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ユーザーデータの取得
        const userResponse = await fetch('/api/user/me')
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await userResponse.json()
        setCustomer(userData)

        // 予約データの取得
        const bookingsResponse = await fetch('/api/bookings')
        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings')
        }
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/auth/customer')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return null
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
                      Customer since {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-sm break-all">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  )}
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
                  <Button className="w-full bg-primary hover:bg-primary/90">Book New Service</Button>
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
                    My Bookings
                  </span>
                  <Badge variant="secondary">{bookings.length} Total</Badge>
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
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <p className="text-lg font-semibold text-primary mt-1">{booking.price}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{booking.address}</span>
                        </div>
                      </div>

                      {booking.status === "completed" && booking.rating && (
                        <div className="flex items-center mt-3 pt-3 border-t">
                          <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < booking.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                          View Details
                        </Button>
                        {booking.status === "upcoming" && (
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            Reschedule
                          </Button>
                        )}
                        {booking.status === "completed" && !booking.rating && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {bookings.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start by booking your first painting service!</p>
                    <Link href="/partners">
                      <Button className="bg-primary hover:bg-primary/90">Browse Painters</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
