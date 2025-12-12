import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import Statistics from '../components/Statistics';

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Container maxWidth="md" sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Container>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome
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
      </Container>
      <Container>
        <Statistics />
      </Container>
    </Container>
  );
};

export default Dashboard;
