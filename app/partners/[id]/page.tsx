"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Phone, Mail, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ServicePlan {
  id: string
  name: string
  price: string
  description: string
}

interface PartnerData {
  id: string
  name: string
  address: string
  phone: string
  email: string
  rating: number
  reviewCount: number
  description: string
  images: string[]
  specialties: string[]
  servicePlans: ServicePlan[]
}

export default function PartnerDetailPage() {
  const params = useParams()
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/partners/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch partner data")
        const data = await response.json()
        setPartnerData(data)
      } catch (error) {
        console.error("Error fetching partner:", error)
        setError("Failed to load partner details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerData()
  }, [params.id])

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowAuthPrompt(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center">Loading partner details...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !partnerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center text-red-600">{error || "Partner not found"}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <Card className="mb-6 pt-0">
              <div className="relative h-64 md:h-80">
                <Image
                  src={partnerData.images?.[0] || "/img/common/mock_01.jpg"}
                  alt={partnerData.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{partnerData.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{partnerData.rating}</span>
                  </div>
                  <span className="text-gray-500 ml-2">({partnerData.reviewCount} reviews)</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{partnerData.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{partnerData.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{partnerData.email}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{partnerData.description}</p>

                <div className="flex flex-wrap gap-2">
                  {partnerData.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Project Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={`/img/common/mock_${String(i + 1).padStart(2, '0')}.jpg`}
                        alt={`Project ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Book Your Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showAuthPrompt ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="service-plan">Service Plan</Label>
                      <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a service plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerData.servicePlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{plan.name}</span>
                                <span className="font-semibold text-primary ml-2">{plan.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedPlan && (
                        <p className="text-sm text-gray-600 mt-1">
                          {partnerData.servicePlans.find((p) => p.id === selectedPlan)?.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="preferred-date">Preferred Date</Label>
                      <Input
                        id="preferred-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="project-details">Project Details</Label>
                      <Textarea id="project-details" placeholder="Describe your painting project..." rows={3} />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={!selectedPlan || !selectedDate}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Request Booking
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-accent rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Sign In Required</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Please sign in or create an account to complete your booking.
                      </p>
                      <div className="space-y-2">
                        <Link href="/auth">
                          <Button className="w-full bg-primary hover:bg-primary/90">Sign In / Register</Button>
                        </Link>
                        <Button variant="outline" className="w-full" onClick={() => setShowAuthPrompt(false)}>
                          Back to Form
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
