"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"

interface Partner {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  price: string;
  images: string[];
}

export default function PartnersPage() {
  const router = useRouter()
  const [partners, setPartners] = useState<Partner[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const specialties = [
    "Interior Painting",
    "Exterior Painting",
    "Cabinet Painting",
    "Wallpaper Installation",
    "Deck Staining",
    "Commercial Painting"
  ]

  const dummyPartners: Partner[] = [
    {
      id: "1",
      name: "Paint Pro Services",
      address: "123 Main St, Tokyo",
      rating: 4.8,
      reviewCount: 128,
      specialties: ["Interior Painting", "Exterior Painting"],
      price: "¥5,000 - ¥10,000",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "2",
      name: "Elite Painters",
      address: "456 Oak Ave, Osaka",
      rating: 4.9,
      reviewCount: 256,
      specialties: ["Cabinet Painting", "Wallpaper Installation"],
      price: "¥8,000 - ¥15,000",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "3",
      name: "Color Masters",
      address: "789 Pine Rd, Kyoto",
      rating: 4.7,
      reviewCount: 89,
      specialties: ["Interior Painting", "Deck Staining"],
      price: "¥6,000 - ¥12,000",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "4",
      name: "Premium Paint Solutions",
      address: "321 Cedar Ln, Fukuoka",
      rating: 4.6,
      reviewCount: 156,
      specialties: ["Exterior Painting", "Commercial Painting"],
      price: "¥7,000 - ¥14,000",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "5",
      name: "Artisan Painters",
      address: "654 Maple Dr, Sapporo",
      rating: 4.9,
      reviewCount: 203,
      specialties: ["Interior Painting", "Wallpaper Installation"],
      price: "¥9,000 - ¥18,000",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "6",
      name: "Modern Paint Co.",
      address: "987 Birch St, Nagoya",
      rating: 4.7,
      reviewCount: 167,
      specialties: ["Cabinet Painting", "Commercial Painting"],
      price: "¥6,500 - ¥13,000",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    }
  ]

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true)
        const filteredPartners = dummyPartners.filter(partner => {
          const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.address.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesSpecialty = !selectedSpecialty || partner.specialties.includes(selectedSpecialty)
          return matchesSearch && matchesSpecialty
        })

        const itemsPerPage = 6
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedPartners = filteredPartners.slice(startIndex, endIndex)
        const totalPages = Math.ceil(filteredPartners.length / itemsPerPage)

        setPartners(paginatedPartners)
        setTotalPages(totalPages)
      } catch (error) {
        console.error("Error fetching partners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartners()
  }, [searchQuery, selectedSpecialty, currentPage])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Painting Service</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by company name or location..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <Link
                  href={`/partners/${partner.id}`}
                  key={partner.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={partner.images[0]}
                      alt={partner.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{partner.name}</h2>
                    <p className="text-gray-600 mb-2">{partner.address}</p>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-700">{partner.rating}</span>
                      <span className="ml-1 text-gray-500">({partner.reviewCount} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {partner.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-900 font-semibold">{partner.price}</p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
