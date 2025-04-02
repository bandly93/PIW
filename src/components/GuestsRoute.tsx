import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

type GuestRouteProps = {
  children: React.ReactNode;
};
const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, isLoaded } = useSelector((state: RootState) => state.auth);

  if (!isLoaded) return <div>Loading...</div>; // 👀 wait for auth state

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};


export default GuestRoute;
