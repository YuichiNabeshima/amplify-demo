'use client';

import { Header } from "@/components/header";
import { CustomAuthenticator } from "@/components/custom-authenticator";
import { Footer } from "@/components/footer"

export default function CustomerSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Account</h1>
            <p className="text-gray-600">Sign up to start booking painting services</p>
          </div>

          <CustomAuthenticator userType="customer" />
        </div>
      </main>
      <Footer />
    </div>
  );
} 