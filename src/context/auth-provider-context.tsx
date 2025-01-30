import React, { useState } from 'react';
import { Credentials } from '@/types/auth';
import { AuthContext } from '@/context/auth-context.ts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [credentials, setCredentials] = useState<Credentials>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSetCredentials = (newCredentials: Credentials) => {
    setCredentials(newCredentials);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCredentials(undefined);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        credentials,
        setCredentials: handleSetCredentials,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
