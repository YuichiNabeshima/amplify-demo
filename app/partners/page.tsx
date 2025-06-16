"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const specialties = [
  "Interior",
  "Exterior",
  "Commercial",
  "Residential",
  "Color Consultation",
  "Luxury Homes",
  "Quick Service",
  "Custom Finishes",
  "Decorative",
  "Industrial",
]

const dummyPartners = [
  {
    id: "1",
    name: "Paint Pro Services",
    address: "123 Main St, New York, NY",
    rating: 4.8,
    reviewCount: 156,
    specialties: ["Interior", "Exterior", "Commercial"],
    price: "$2,500 - $5,000",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"]
  },
  {
    id: "2",
    name: "Elite Painters",
    address: "456 Park Ave, Boston, MA",
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Luxury Homes", "Custom Finishes", "Decorative"],
    price: "$3,000 - $6,000",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"]
  },
  {
    id: "3",
    name: "Quick Paint Solutions",
    address: "789 Market St, San Francisco, CA",
    rating: 4.5,
    reviewCount: 98,
    specialties: ["Quick Service", "Residential", "Interior"],
    price: "$1,500 - $3,000",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"]
  },
  {
    id: "4",
    name: "Color Masters",
    address: "321 Oak St, Chicago, IL",
    rating: 4.7,
    reviewCount: 142,
    specialties: ["Color Consultation", "Interior", "Decorative"],
    price: "$2,000 - $4,000",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"]
  },
  {
    id: "5",
    name: "Industrial Coatings Inc",
    address: "654 Industrial Blvd, Houston, TX",
    rating: 4.6,
    reviewCount: 87,
    specialties: ["Industrial", "Exterior", "Commercial"],
    price: "$4,000 - $8,000",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"]
  },
  {
    id: "6",
    name: "Luxury Paint & Design",
    address: "987 Rodeo Dr, Los Angeles, CA",
    rating: 4.9,
    reviewCount: 178,
    specialties: ["Luxury Homes", "Custom Finishes", "Color Consultation"],
    price: "$5,000 - $10,000",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"]
  }
];

export default function PartnersPage() {
  const [partners, setPartners] = useState(dummyPartners)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(6)

  useEffect(() => {
    const filteredPartners = dummyPartners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(search.toLowerCase()) ||
                          partner.address.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = specialty === "all" || partner.specialties.includes(specialty);
      return matchesSearch && matchesSpecialty;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPartners = filteredPartners.slice(startIndex, endIndex);
    
    setPartners(paginatedPartners);
    setTotalPages(Math.ceil(filteredPartners.length / itemsPerPage));
  }, [currentPage, search, specialty, itemsPerPage])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading partners...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Painting Partner</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with professional painting companies in your area. All partners are vetted and ready to transform
            your space in just one day.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by company name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {partners.map((company) => (
            <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow pt-0">
              <div className="relative h-48">
                <Image src={company.images[0]} alt={company.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{company.address}</span>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{company.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({company.reviewCount} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {company.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <p className="text-lg font-semibold text-primary mt-1">{company.price}</p>

                <Link href={`/partners/${company.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90">View Details & Book</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {partners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No partners found matching your criteria.</p>
          </div>
        )}

        <div className="flex justify-center mt-8 md:mt-12">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                className={page === currentPage ? "bg-primary hover:bg-primary/90" : ""}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
