import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = 'https://mern-polls-app.onrender.com';

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        setUser(decodedUser);
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        // Handle invalid token
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return response;
    } catch (error) {
      console.error('Login error', error.response.data);
      throw error;
    }
  };

  const register = async (username, email, password) => {
     try {
      const response = await axios.post('/auth/register', { username, email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return response;
    } catch (error) {
      console.error('Registration error', error.response.data);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
