import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthFromStorage } from './store/authSlice';
import { RootState } from './store';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import Fitness from './pages/Fitness';
import BMR from './pages/BMR';
import Report from './pages/Report';
import Logger from './pages/Logger';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoutes';
import NotFound from './pages/NotFound';

const App = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch(loadAuthFromStorage({ token, user: JSON.parse(user) }));
    } else {
      dispatch(loadAuthFromStorage(null));
    }
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NavBar />
      <Routes>
        <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <NotFound />} />
        {/* Public only if not logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 🔐 Protected area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logger" element={<Logger />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/bmr" element={<BMR />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
};

export default App;