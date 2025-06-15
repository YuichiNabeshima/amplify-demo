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

interface Partner {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  image: string
  specialties: string[]
  price: string
}

interface PartnersResponse {
  partners: Partner[]
  total: number
  totalPages: number
  currentPage: number
}

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

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "6",
          ...(search && { search }),
          ...(specialty && specialty !== "all" && { specialty }),
        })

        const response = await fetch(`/api/partners?${params}`)
        if (!response.ok) throw new Error("Failed to fetch partners")

        const data: PartnersResponse = await response.json()
        setPartners(data.partners)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error fetching partners:", error)
        setError("Failed to load partners. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [currentPage, search, specialty])

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
                <Image src={company.image} alt={company.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{company.location}</span>
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
