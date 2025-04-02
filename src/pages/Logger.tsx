import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type LogEntry = {
  date: string;
  type: 'Workout' | 'Meal' | 'Weight';
  details: string;
  calories?: number;
};

const Logger = () => {
  const { control, handleSubmit, reset } = useForm<LogEntry>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'Workout',
      details: '',
      calories: undefined,
    }
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LogEntry) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });


      if (res.ok) {
        reset();
        navigate('/dashboard');
      } else {
        const error = await res.json();
        alert(error.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Log Activity</Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Type"
                fullWidth
                margin="normal"
              >
                <MenuItem value="Workout">Workout</MenuItem>
                <MenuItem value="Meal">Meal</MenuItem>
                <MenuItem value="Weight">Weight</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="details"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Details"
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            )}
          />

          <Controller
            name="calories"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Calories (optional)"
                type="number"
                fullWidth
                margin="normal"
              />
            )}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Save Entry
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Logger;
