import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
// import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import UsersPage from './pages/UsersPage';
import IssuesPage from './pages/IssuesPage';

const App = () => {
  // const { loading } = useAuth();

  // if (loading) {
  //   return <div className='loading'>Yükleniyor...</div>;
  // }

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path='/'
              element={
                <>
                  <Sidebar />
                  <OverviewPage />
                </>
              }
            />
            <Route
              path='/overview'
              element={
                <>
                  <Sidebar />
                  <OverviewPage />
                </>
              }
            />
            <Route
              path='/users'
              element={
                <>
                  <Sidebar />
                  <UsersPage />
                </>
              }
            />
            <Route
              path='/issues'
              element={
                <>
                  <Sidebar />
                  <IssuesPage />
                </>
              }
            />
          </Route>
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
