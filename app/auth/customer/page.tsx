"use client"

import { Header } from "@/components/header"
import { CustomAuthenticator } from "@/components/custom-authenticator"

export default function CustomerAuthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Portal</h1>
            <p className="text-gray-600">Sign in to manage your painting service bookings</p>
          </div>

          <CustomAuthenticator userType="customer" />
        </div>
      </main>
    </div>
  )
}
