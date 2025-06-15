import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  type: 'customer' | 'partner';
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'partner' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserType(data.user.type);
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