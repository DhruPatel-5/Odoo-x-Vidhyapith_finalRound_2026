import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, getMe } from '../api/auth';
import { jwtDecode } from '../utils/jwtDecode';

const AuthContext = createContext(null);

/**
 * AuthContext provider — manages JWT, currentUser, login/logout.
 * Wraps the entire app in main.jsx.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore user from token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((res) => setCurrentUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /** Login and store JWT. Returns user object. */
  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem('token', res.data.token);
    setCurrentUser(res.data.user);
    return res.data.user;
  };

  /** Signup and store JWT. Returns user object. */
  const signup = async (name, email, password, role) => {
    const res = await apiSignup({ name, email, password, role });
    localStorage.setItem('token', res.data.token);
    setCurrentUser(res.data.user);
    return res.data.user;
  };

  /** Logout — clear token and user. */
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook to consume AuthContext. */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
