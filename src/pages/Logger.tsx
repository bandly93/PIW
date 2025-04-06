import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getLocalDateString } from '../utils/getLocalDateString';
import { fetchApi } from '../utils/fetch';

type LogType = 'Workout' | 'Food' | 'Other';

interface LogFormData {
  type: LogType;
  details: string;
  calories?: string | number;
  protein?: string | number;
  carbs?: string | number;
  fats?: string | number;
  foodName?: string;
}

const Logger = () => {
  const { control, handleSubmit, watch, reset } = useForm<LogFormData>({
    defaultValues: {
      type: 'Food',
      details: '',
      calories: undefined,
      foodName: '',
      protein: undefined,
      carbs: undefined,
      fats: undefined,
    },
  });

  const type = watch('type');
  const protein = Number(watch('protein')) || 0;
  const carbs = Number(watch('carbs')) || 0;
  const fats = Number(watch('fats')) || 0;

  const estimatedCalories =
    type === 'Food' ? protein * 4 + carbs * 4 + fats * 9 : null;

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: LogFormData) => {
    const calories =
      type === 'Food' ? estimatedCalories : data.calories || 0;

    const payload = {
      date: getLocalDateString(),
      type,
      details:
        type === 'Food'
          ? `${data.foodName} - Protein: ${protein}g, Carbs: ${carbs}g, Fats: ${fats}g`
          : data.details,
      calories,
    };

    const { status } = await fetchApi('POST', '/api/logs', payload)

    if (status) {
      setOpen(true);                // ✅ Show snackbar
      reset({
        type: 'Food',
        details: '',
        calories: 0,
        foodName: '',
        protein: '',
        carbs: '',
        fats: '',
      });   // ✅ Clear form
    } else {
      alert('Failed to log entry.');
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper sx={{ p: 4, mt: 4, borderRadius: 3 }} elevation={3}>
          <Typography variant="h5" gutterBottom align="center">
            Log Entry
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField select label="Type" fullWidth {...field}>
                    <MenuItem value="Workout">Workout</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                )}
              />

              {type === 'Food' ? (
                <>
                  <Controller
                    name="foodName"
                    control={control}
                    render={({ field }) => (
                      <TextField label="Food Name" fullWidth required {...field} />
                    )}
                  />
                  <Controller
                    name="protein"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        label="Protein (g)"
                        type="number"
                        fullWidth
                        required
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="carbs"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        label="Carbs (g)"
                        type="number"
                        fullWidth
                        required
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="fats"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        label="Fats (g)"
                        type="number"
                        fullWidth
                        required
                        {...field}
                      />
                    )}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Estimated Calories: {estimatedCalories} kcal
                  </Typography>
                </>
              ) : (
                <>
                  <Controller
                    name="details"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Details"
                        fullWidth
                        multiline
                        rows={3}
                        required
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="calories"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Calories"
                        type="number"
                        fullWidth
                        required
                        {...field}
                      />
                    )}
                  />
                </>
              )}

              <Button type="submit" variant="contained" size="large">
                Submit Log
              </Button>
            </Stack>
          </Box>
        </Paper>
      </motion.div>

      {/* ✅ Snackbar for feedback */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setOpen(false)}>
          Log submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Logger;
