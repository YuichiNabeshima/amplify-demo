'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface AuthenticatorProps {
  userType: 'customer' | 'partner';
}

export function CustomAuthenticator({ userType }: AuthenticatorProps) {
  const router = useRouter();

  const handleSignIn = () => {
    // TODO: Implement sign in logic
    console.log('Sign in clicked');
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSignIn}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>
      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={() => router.push(`/auth/${userType}/signup`)}
          className="text-blue-600 hover:text-blue-700"
        >
          Sign up
        </button>
      </p>
    </div>
  );
} 