// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);

//   // Set axios default authorization header
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       fetchUserProfile();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/auth/profile');
//       setUser(response.data);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     const response = await axios.post('http://localhost:3001/api/auth/register', userData);
//     const { token: newToken, ...userInfo } = response.data;
//     setToken(newToken);
//     setUser(userInfo);
//     localStorage.setItem('token', newToken);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//   };

//   const login = async (credentials) => {
//     const response = await axios.post('http://localhost:3001/api/auth/login', credentials);
//     const { token: newToken, ...userInfo } = response.data;
//     setToken(newToken);
//     setUser(userInfo);
//     localStorage.setItem('token', newToken);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   const updateProfile = async (updates) => {
//     const response = await axios.put('http://localhost:3001/api/auth/profile', updates);
//     setUser(response.data);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     register,
//     login,
//     logout,
//     updateProfile,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // NOTE: registration no longer logs the user in — the backend doesn't
  // issue a token until the email is verified. Returns { message, email }
  // so the caller can route to the verify-email screen.
  const register = async (userData) => {
    const response = await axios.post('http://localhost:3001/api/auth/register', userData);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await axios.post('http://localhost:3001/api/auth/login', credentials);
    const { token: newToken, ...userInfo } = response.data;
    setToken(newToken);
    setUser(userInfo);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // Confirms the 6-digit code. On success the backend returns a token,
  // same as login — so this logs the user in.
  const verifyEmail = async (email, verificationCode) => {
    const response = await axios.post('http://localhost:3001/api/auth/verify-email', {
      email,
      verificationCode
    });
    const { token: newToken, ...userInfo } = response.data;
    setToken(newToken);
    setUser(userInfo);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return response.data;
  };

  const resendVerificationCode = async (email) => {
    const response = await axios.post('http://localhost:3001/api/auth/resend-verification', { email });
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (updates) => {
    const response = await axios.put('http://localhost:3001/api/auth/profile', updates);
    setUser(response.data);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    verifyEmail,
    resendVerificationCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};