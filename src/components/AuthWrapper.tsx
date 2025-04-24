import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  exp: number;
}

const checkTokenExpired = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true; // Malformed or invalid
  }
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkTokenExpired()) {
      dispatch(logout());
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return <>{children}</>;
};

export default AuthWrapper;
