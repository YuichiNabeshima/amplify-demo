"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Clock, User, Phone, Mail, Search, Filter } from "lucide-react"

interface Booking {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  servicePlan: string
  date: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  price: string
  notes?: string
}

export default function PartnerDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      customer: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St, New York, NY'
      },
      servicePlan: 'Exterior Painting',
      date: new Date().toISOString(),
      status: 'pending',
      price: '$1,500',
      notes: 'Please paint the front door as well'
    },
    {
      id: '2',
      customer: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '987-654-3210',
        address: '456 Park Ave, New York, NY'
      },
      servicePlan: 'Interior Painting',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'confirmed',
      price: '$2,000'
    },
    {
      id: '3',
      customer: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '555-123-4567',
        address: '789 Broadway, New York, NY'
      },
      servicePlan: 'Exterior Painting',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      price: '$1,800'
    }
  ])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">Manage your customer bookings and appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <User className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by customer name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    selectedBooking === booking.id ? "border-primary bg-primary/5" : "hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {booking.customer.name}
                      </h4>
                      <p className="text-sm text-gray-600">{booking.servicePlan}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status === 'pending' ? 'Pending' :
                         booking.status === 'confirmed' ? 'Confirmed' :
                         booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </Badge>
                      <p className="text-lg font-semibold text-primary mt-1">{booking.price}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{booking.customer.address}</span>
                    </div>
                  </div>

                  {selectedBooking === booking.id && (
                    <div className="border-t pt-4 mt-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{booking.customer.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{booking.customer.phone}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        {booking.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                              Confirm Booking
                            </Button>
                            <Button size="sm" variant="outline">
                              Request Changes
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                              Mark Complete
                            </Button>
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          Contact Customer
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "You don't have any bookings yet"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
