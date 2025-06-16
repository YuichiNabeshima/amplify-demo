import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { get, post } from '@/src/lib/amplify';
import { User, AuthResponse } from '@/src/types/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check token and get user info
    const checkAuth = async () => {
      try {
        const restOperation = await get({ 
          apiName: 'myHttpApi',
          path: '/me' 
        }).response;
        const response = await restOperation.body.json() as unknown as AuthResponse;
        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      await post({ 
        apiName: 'myHttpApi',
        path: '/signout' 
      }).response;
      setUser(null);
      router.push('/auth/customer');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return { user, loading, signOut };
} 