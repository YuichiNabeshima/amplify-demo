"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { CustomAuthenticator } from '@/components/custom-authenticator';
import { Footer } from '@/components/footer';

export default function PartnerAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await fetch('/api/auth/session').then(res => res.json());
        if (user?.isAuthenticated && user?.type === 'partner') {
          router.push('/partner/dashboard');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Partner Portal</h1>
          <p className="text-gray-600 mb-8">Sign in to your partner account</p>
          <CustomAuthenticator userType="partner" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
