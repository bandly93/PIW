import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import Fitness from './pages/Fitness';
import BMR from './pages/BMR';
import Report from './pages/Report';
import Logger from './pages/Logger';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestsRoute';
import { loadAuthFromStorage } from './store/authSlice';

const App = () => {
  const dispatch = useDispatch()

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
    <BrowserRouter>
      <NavBar />
      <Routes>

        <Route path="/" element={<GuestRoute> <Login /> </GuestRoute>} />
        <Route path="/login" element={<GuestRoute> <Login /> </GuestRoute>} />
        <Route path="/register" element={<GuestRoute> <Register /> </GuestRoute>} />

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