import { createContext } from 'react';
import { Credentials } from '@/types/auth';

interface AuthContextType {
  credentials: Credentials | undefined;
  setCredentials: (credentials: Credentials) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
