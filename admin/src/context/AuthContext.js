import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/admin/profile',
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/auth',
        { email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUser(response.data);
      console.log('Admin logged in successfully.');
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:8000/api/admin/logout',
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUser(false);
      toast.success('Çıkış Başarılı.');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   // Oturum doğrulama işlemini iyileştirilmiş hali
//   const verifyAdminSession = async () => {
//     if (!document.cookie.includes('adminToken')) {
//       // Eğer adminToken cookie'si yoksa, doğrulama işlemi yapılmaz
//       console.log('No adminToken found, skipping session verification.');
//       return;
//     }

//     try {
//       const response = await axios.get(
//         'http://localhost:8000/api/users/validate-user',
//         { withCredentials: true }
//       );
//       setIsAuthenticated(true);
//       setUser(response.data);
//     } catch (error) {
//       console.error('Session verification failed:', error);
//       setIsAuthenticated(false);
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     verifyAdminSession();
//   }, []);

//   const signIn = async (email, password) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/users/auth-admin',
//         { email, password },
//         { withCredentials: true }
//       );
//       setIsAuthenticated(true);
//       setUser(response.data);
//       console.log('Login successful:', response.data);
//     } catch (error) {
//       console.error('Login failed:', error);
//       setIsAuthenticated(false);
//       setUser(null);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await axios.post(
//         'http://localhost:8000/api/users/logout-admin',
//         {},
//         { withCredentials: true }
//       );
//       setIsAuthenticated(false);
//       setUser(null);
//       console.log('Successfully logged out');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
