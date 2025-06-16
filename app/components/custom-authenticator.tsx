'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface CustomAuthenticatorProps {
  userType: 'customer' | 'partner';
}

export function CustomAuthenticator({ userType }: CustomAuthenticatorProps) {
  const router = useRouter();

  const handleSignIn = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSignIn}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Sign In
      </button>
      <div className="text-center text-sm">
        <a href={`/auth/${userType}/signup`} className="text-blue-600 hover:text-blue-500">
          Click here to register
        </a>
      </div>
    </div>
  );
} 