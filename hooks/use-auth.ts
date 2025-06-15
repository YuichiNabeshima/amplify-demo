import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  userType: 'customer' | 'partner' | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'partner' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (!response.ok) {
          setIsAuthenticated(false);
          setUserType(null);
          return;
        }

        const data = await response.json();
        console.log('Auth data:', data);

        if (data.isAuthenticated && data.userType) {
          setIsAuthenticated(true);
          setUserType(data.userType);
        } else {
          setIsAuthenticated(false);
          setUserType(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    userType,
    loading,
  };
} 