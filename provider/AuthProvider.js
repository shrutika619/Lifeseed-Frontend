'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { setAccessToken } from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        // If your backend returns user data on refresh, set it here
        // setUser(data.user);
      } catch (e) {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    // credentials = { mobileNo, otp } OR { username, password }
    const { data } = await api.post('/auth/login', credentials);
    setAccessToken(data.accessToken);
    setUser(data.user);
    
    // Redirect based on role [cite: 60]
    const role = data.user?.role;
    if (['admin', 'super_admin', 'clinic_admin'].includes(role)) {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    setAccessToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);