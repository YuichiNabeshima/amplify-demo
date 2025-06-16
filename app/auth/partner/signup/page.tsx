'use client';

import { Header } from "@/components/header";
import { CustomAuthenticator } from "@/components/custom-authenticator";

export default function PartnerSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="partner" isAuthenticated={false} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Partner Registration</h1>
            <p className="text-gray-600">Register your painting service business</p>
          </div>

          <CustomAuthenticator userType="partner" />
        </div>
      </main>
    </div>
  );
} 