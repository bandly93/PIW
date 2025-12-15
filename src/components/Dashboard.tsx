import {  Paper, Typography, Stack, LinearProgress, Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskStatBox from './TaskStatBox';

const Dashboard = ({
  completedToday = 0,
  completedWeek = 0,
  completedMonth = 0,
  totalTasksToday = 0,
  totalTasksWeek = 0,
  totalTasksMonth = 0,
}: {
  completedToday?: number;
  completedWeek?: number;
  completedMonth?: number;
  totalTasksToday?: number;
  totalTasksWeek?: number;
  totalTasksMonth?: number;
}) => {
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <TrendingUpIcon sx={{ fontSize: 28, color: '#1976d2' }} />
        <Typography variant="h5" fontWeight="bold">
          Your Dashboard
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <TaskStatBox
          label='Today'
          completed={completedToday}
          total={totalTasksToday}
          
        />
         <TaskStatBox
          label='This Week'
          completed={completedWeek}
          total={totalTasksWeek}
        />
        <TaskStatBox
          label='This Month'
          completed={completedMonth}
          total={totalTasksMonth}
        />
      </Grid>
    </Paper>
  );
};

export default Dashboard;
