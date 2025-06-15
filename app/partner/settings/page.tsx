"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Phone, Mail, Camera, Plus, X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface PartnerData {
  id: string
  companyName: string
  businessPhone: string
  address: string
  email: string
  images: string[] | null
  specialties: string[]
  description: string
}

export default function PartnerSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState("")
  const [formData, setFormData] = useState<PartnerData>({
    id: "",
    companyName: "",
    businessPhone: "",
    address: "",
    email: "",
    images: [],
    specialties: [],
    description: "",
  })

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await fetch("/api/partners/settings")
        if (!response.ok) throw new Error("Failed to fetch partner data")
        const data = await response.json()
        setFormData({
          ...data,
          images: data.images ? data.images.split(",") : [],
          specialties: data.specialties || [],
          description: data.description || "",
        })
      } catch (error) {
        console.error("Error fetching partner:", error)
        toast({
          title: "Error",
          description: "Failed to load partner settings. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerData()
  }, [toast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const dataToSend = {
        ...formData,
        images: formData.images ? formData.images.join(",") : null,
      }

      const response = await fetch("/api/partners/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) throw new Error("Failed to update settings")

      toast({
        title: "Success",
        description: "Partner settings updated successfully.",
      })
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()],
      })
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    })
  }

  if (loading) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
        <div className="space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-orange-500" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Service Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    {isEditing && (
                      <button onClick={() => removeSpecialty(specialty)} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new specialty"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
                  />
                  <Button onClick={addSpecialty} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-orange-500" />
                  Project Gallery
                </span>
                {isEditing && (
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Images
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(formData.images || []).map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Project ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{formData.companyName}</h3>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-3" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-3" />
                  <span className="text-sm">{formData.businessPhone}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5" />
                  <span className="text-sm">{formData.address}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Profile Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Profile Complete</span>
                    <Badge className="bg-green-100 text-green-800">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Verification</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
