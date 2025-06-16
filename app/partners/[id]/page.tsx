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

const dummyPartners: Record<string, PartnerData> = {
  "1": {
    id: "1",
    name: "Paint Pro Services",
    address: "123 Main St, New York, NY",
    phone: "(212) 555-0123",
    email: "contact@paintpro.com",
    rating: 4.8,
    reviewCount: 156,
    description: "Professional painting services for residential and commercial properties. With over 15 years of experience, we deliver high-quality results and exceptional customer service.",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    specialties: ["Interior", "Exterior", "Commercial"],
    servicePlans: [
      {
        id: "plan1",
        name: "Basic Interior Painting",
        price: "$2,500",
        description: "Standard interior painting service for up to 3 rooms"
      },
      {
        id: "plan2",
        name: "Premium Exterior Painting",
        price: "$5,000",
        description: "Complete exterior painting with premium materials"
      },
      {
        id: "plan3",
        name: "Commercial Space Painting",
        price: "$8,000",
        description: "Professional painting service for commercial properties"
      }
    ]
  },
  "2": {
    id: "2",
    name: "Elite Painters",
    address: "456 Park Ave, Boston, MA",
    phone: "(617) 555-0123",
    email: "info@elitepainters.com",
    rating: 4.9,
    reviewCount: 203,
    description: "Luxury painting services specializing in high-end residential properties. We use only the finest materials and techniques to create stunning finishes.",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    specialties: ["Luxury Homes", "Custom Finishes", "Decorative"],
    servicePlans: [
      {
        id: "plan1",
        name: "Luxury Interior Package",
        price: "$3,000",
        description: "Premium interior painting with custom finishes"
      },
      {
        id: "plan2",
        name: "Decorative Painting",
        price: "$6,000",
        description: "Specialized decorative painting techniques"
      },
      {
        id: "plan3",
        name: "Complete Home Transformation",
        price: "$10,000",
        description: "Full home painting with premium materials and finishes"
      }
    ]
  }
};

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
        const partnerId = params.id as string
        const data = dummyPartners[partnerId]
        
        if (!data) {
          throw new Error("Partner not found")
        }
        
        setPartnerData(data)
      } catch (error) {
        console.error("Error fetching partner:", error)
        setError("Failed to load partner details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPartnerData()
    }
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
                  src={partnerData.images[0]}
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
                  {partnerData.images.map((image, i) => (
                    <div key={i} className="relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={image}
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
