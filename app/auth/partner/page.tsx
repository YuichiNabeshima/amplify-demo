"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CustomAuthenticator } from "@/components/custom-authenticator"

export default function PartnerAuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...")
        const response = await fetch("/api/auth/verify")
        console.log("Auth response status:", response.status)
        
        if (!response.ok) {
          console.log("Auth check failed:", response.status)
          setIsLoading(false)
          return
        }
        
        const data = await response.json()
        console.log("Auth data:", data)
        
        if (data.isAuthenticated && data.userType === "partner") {
          console.log("Redirecting to partner dashboard...")
          router.push("/partner/dashboard")
        } else {
          console.log("Not authenticated as partner")
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setError("Failed to check authentication status")
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="partner" isAuthenticated={false} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="partner" isAuthenticated={false} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="partner" isAuthenticated={false} />
      <div className="flex items-center justify-center h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Partner Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your partner account
            </p>
          </div>
          <CustomAuthenticator userType="partner" />
        </div>
      </div>
    </div>
  )
}
