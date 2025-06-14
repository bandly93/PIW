import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Paper,
  Snackbar,
  Alert,
  Grid,
  InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLocalDateString } from '../utils/getLocalDateString';
import { fetchApi } from '../utils/fetch';
import { PlannerItem } from './TimeBlockSections';

export interface FoodFormData {
  foodName: string;
  protein?: number;
  carbs?: number;
  fats?: number;
}

interface FoodLoggerFormProps {
  value?: FoodFormData;
  onChange?: (data: FoodFormData) => void;
  onSuccess?: () => void;
  onClose?: () => void;
  onAddMeal?: (data: PlannerItem) => void;
}

const FoodLoggerForm = ({
  value,
  onChange,
  onSuccess,
  onClose,
  onAddMeal,
}: FoodLoggerFormProps) => {
  const { control, handleSubmit, watch, reset, setValue } = useForm<FoodFormData>({
    defaultValues: value ?? {
      foodName: '',
      protein: undefined,
      carbs: undefined,
      fats: undefined,
    },
  });

  useEffect(() => {
    if (value) {
      Object.entries(value).forEach(([key, val]) =>
        setValue(key as keyof FoodFormData, val)
      );
    }
  }, [value, setValue]);

  const protein = Number(watch('protein')) || 0;
  const carbs = Number(watch('carbs')) || 0;
  const fats = Number(watch('fats')) || 0;

  const estimatedCalories = protein * 4 + carbs * 4 + fats * 9;
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FoodFormData) => {
    const details = `${data.foodName} - Protein: ${protein}g, Carbs: ${carbs}g, Fats: ${fats}g`;
    const date = getLocalDateString();

    const payload = {
      date,
      type: 'Food',
      details,
      calories: estimatedCalories,
    };

    const logRes = await fetchApi('POST', '/api/logs', payload);

    // 👇 New: also log as a Planner Task
    const plannerRes = await fetchApi('GET', `/api/planners?date=${date}`);
    const plannerId = (plannerRes?.data as { id?: string })?.id;

    let taskResData = null;
    if (plannerId) {
      const taskPayload = {
        text: details, // Use details as the task name
        type: 'Meal',
        completed: false,
        notes: details,
        plannerId,
      };

      const taskRes = await fetchApi('POST', '/api/tasks', taskPayload);
      taskResData = taskRes?.data; // Capture the resolved task data
    }

    if (logRes.status === 200 || logRes.status === 201) {
      reset();
      onSuccess?.();
      onAddMeal?.((taskResData || logRes?.data) as PlannerItem); // Explicitly cast to PlannerItem

      if (!onChange) setOpen(true);
      onClose?.();
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
            Log a Meal
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              <Controller
                name="foodName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Food Name"
                    fullWidth
                    required
                    value={field.value ?? ''}
                    onChange={field.onChange}
                  />
                )}
              />

              <Grid container spacing={2}>
                <Grid>
                  <Controller
                    name="protein"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Protein"
                        type="number"
                        fullWidth
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid>
                  <Controller
                    name="carbs"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Carbs"
                        type="number"
                        fullWidth
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid>
                  <Controller
                    name="fats"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Fats"
                        type="number"
                        fullWidth
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Typography align="center" fontWeight="bold">
                Estimated Calories: {estimatedCalories} kcal
              </Typography>

              <Button type="submit" variant="contained" size="large">
                Log Meal
              </Button>
            </Stack>
          </Box>
        </Paper>
      </motion.div>

      {!onChange && (
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" onClose={() => setOpen(false)}>
            Meal logged successfully!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default FoodLoggerForm;
