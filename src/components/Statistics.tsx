import { Box, Paper, Typography, Stack } from '@mui/material';


const Statistics = ({
  completedToday = 0,
  completedWeek = 0,
  completedMonth = 0,
}: {
  completedToday?: number;
  completedWeek?: number;
  completedMonth?: number;
}) => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Statistics
      </Typography>
      <Paper
        elevation={1}
        sx={{
          mt: 4,
          p: 2,
          borderRadius: 2,
        }}  
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Completed Tasks
        </Typography>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="body2" color="primary">Today</Typography>
            <Typography fontWeight="bold" fontSize={22}>{completedToday}</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="body2" color="secondary">This Week</Typography>
            <Typography fontWeight="bold" fontSize={22}>{completedWeek}</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="body2" color="success.main">This Month</Typography>
            <Typography fontWeight="bold" fontSize={22}>{completedMonth}</Typography>
          </Box>
        </Stack>
      </Paper>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Here you can find an overview of your fitness journey.
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">BMR: 2000 kcal</Typography>
        <Typography variant="h6">Daily Steps: 8000</Typography>
        <Typography variant="h6">Workouts This Week: 3</Typography>
      </Box>
      
    </Paper>
  );
};


export default Statistics;
