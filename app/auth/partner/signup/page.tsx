'use client';

import { Header } from '@/components/header';
import { CustomAuthenticator } from '@/components/custom-authenticator';
import { Footer } from '@/components/footer';

export default function PartnerSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Partner Registration</h1>
          <p className="text-gray-600 mb-8">Register your painting service business</p>
          <CustomAuthenticator userType="partner" />
        </div>
      </main>
      <Footer />
    </div>
  );
} 