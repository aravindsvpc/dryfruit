import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false
  });

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isAdmin: email === 'admin@dryfruit.com'
      };
      
      setAuthState({ user: mockUser, isLoading: false });
    }, 1000);
  };

  const signup = async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        email,
        name,
        isAdmin: false
      };
      
      setAuthState({ user: mockUser, isLoading: false });
    }, 1000);
  };

  const logout = () => {
    setAuthState({ user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      isLoading: authState.isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};