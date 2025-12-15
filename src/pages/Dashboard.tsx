import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardComponent from '../components/Dashboard';
import { fetchApi } from '../utils/fetch';

interface TaskStats {
  completedToday: number;
  totalTasksToday: number;
  completedWeek: number;
  totalTasksWeek: number;
  completedMonth: number;
  totalTasksMonth: number;
}

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data, status } = await fetchApi<TaskStats>('GET', '/api/stats/tasks-stats');
        if (status === 200 && data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || 'User'}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Use the buttons below to explore your fitness tools.
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button variant="contained" component={Link} to="/bmr">
            BMR Calculator
          </Button>
          <Button variant="contained" component={Link} to="/">
            Planner Scaffold (Working Feature!)
          </Button>
          <Button variant="contained" component={Link} to="/fitness">
            Fitness Overview
          </Button>
          <Button variant="contained" component={Link} to="/report">
            Progress Report
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <CircularProgress />
      ) : stats ? (
        <DashboardComponent
          completedToday={stats.completedToday}
          totalTasksToday={stats.totalTasksToday}
          completedWeek={stats.completedWeek}
          totalTasksWeek={stats.totalTasksWeek}
          completedMonth={stats.completedMonth}
          totalTasksMonth={stats.totalTasksMonth}
        />
      ) : (
        <Typography>Unable to load statistics</Typography>
      )}
    </Container>
  );
};

export default Dashboard;
