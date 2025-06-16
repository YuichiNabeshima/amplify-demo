"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CustomAuthenticator } from "@/components/custom-authenticator"
import { get } from '@/src/lib/amplify'
import { VerifyResponse } from '@/src/types/api'

export default function PartnerAuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const restOperation = await get({ 
          apiName: 'myHttpApi',
          path: '/verify' 
        }).response;
        const data = await restOperation.body.json() as unknown as VerifyResponse;
        console.log("Auth response status:", restOperation.statusCode)
        
        if (restOperation.statusCode === 200 && data) {
          console.log("Auth data:", data)
          
          if (data.isAuthenticated && data.userType === 'PARTNER') {
            console.log("Redirecting to partner dashboard...")
            router.push("/partner/dashboard")
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
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
