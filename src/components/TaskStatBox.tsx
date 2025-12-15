import { Paper, Stack, Typography, LinearProgress, Grid } from '@mui/material';

interface TaskStatBoxProps {
  label: string;
  completed: number;
  total: number;
}

const TaskStatBox = ({
  label,
  completed,
  total
}: TaskStatBoxProps) => {
  const percent = (completed / total) * 100 || 0;

  return (
    <Grid>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          height: '100%',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            {label}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          {completed} / {total}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: 6,
            borderRadius: 3,
            opacity: 0.3,
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
            },
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
          {percent.toFixed(0)}% Complete
        </Typography>
      </Paper>
    </Grid>
  );
};

export default TaskStatBox;
