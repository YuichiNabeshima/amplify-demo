"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'

interface Partner {
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
  servicePlans: {
    name: string
    price: string
    description: string
  }[]
}

const dummyPartners: Record<string, Partner> = {
  '1': {
    id: '1',
    name: 'Paint Pro Services',
    address: '123 Main St, Tokyo',
    phone: '03-1234-5678',
    email: 'info@paintpro.jp',
    rating: 4.8,
    reviewCount: 128,
    description: 'Professional painting services for residential and commercial properties. We specialize in interior and exterior painting with a focus on quality and customer satisfaction.',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    specialties: ['Interior Painting', 'Exterior Painting'],
    servicePlans: [
      {
        name: 'Basic Interior',
        price: '¥5,000',
        description: 'Standard interior painting service for one room'
      },
      {
        name: 'Premium Interior',
        price: '¥10,000',
        description: 'High-quality interior painting with premium materials'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Elite Painters',
    address: '456 Oak Ave, Osaka',
    phone: '06-8765-4321',
    email: 'contact@elitepainters.jp',
    rating: 4.9,
    reviewCount: 256,
    description: 'Luxury painting services for discerning clients. We offer custom finishes and premium materials for the most demanding projects.',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    specialties: ['Cabinet Painting', 'Wallpaper Installation'],
    servicePlans: [
      {
        name: 'Cabinet Refresh',
        price: '¥8,000',
        description: 'Professional cabinet painting service'
      },
      {
        name: 'Wallpaper Installation',
        price: '¥15,000',
        description: 'Expert wallpaper installation with premium materials'
      }
    ]
  }
}

export default function PartnerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedService, setSelectedService] = useState('')

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setIsLoading(true)
        const partnerData = dummyPartners[params.id]
        if (!partnerData) {
          router.push('/partners')
          return
        }
        setPartner(partnerData)
      } catch (error) {
        console.error('Error fetching partner:', error)
        router.push('/partners')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartner()
  }, [params.id, router])

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement booking logic
    console.log('Booking submitted:', {
      partnerId: params.id,
      date: selectedDate,
      time: selectedTime,
      service: selectedService
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!partner) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={partner.images[0]}
                  alt={partner.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{partner.name}</h1>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-700">{partner.rating}</span>
                  <span className="ml-1 text-gray-500">({partner.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-600 mb-4">{partner.address}</p>
                <p className="text-gray-600 mb-4">{partner.phone}</p>
                <p className="text-gray-600 mb-4">{partner.email}</p>
                <p className="text-gray-700 mb-6">{partner.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {partner.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Service</h2>
              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Service
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                  >
                    <option value="">Choose a service...</option>
                    {partner.servicePlans.map((plan) => (
                      <option key={plan.name} value={plan.name}>
                        {plan.name} - {plan.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Time
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="">Choose a time...</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
