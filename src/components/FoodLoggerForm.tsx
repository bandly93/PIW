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
import { PlannerItem } from './TimeBlockSections';
import { fetchApi } from '../utils/fetch';
import { getLocalDateString } from '../utils/getLocalDateString';

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
  meal?: PlannerItem | null;
}

export default function FoodLoggerForm({
  value,
  onChange,
  onSuccess,
  onClose,
  onAddMeal,
  meal = null,
}: FoodLoggerFormProps) {
  const { control, handleSubmit, setValue, reset, watch } = useForm<FoodFormData>({
    defaultValues: value || {
      foodName: '',
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  });

  // Parse "Chicken - Protein: 30g, Carbs: 10g, Fats: 12g"
  function parseDetails(details: string) {
    const [foodNamePart, macrosPart] = details.split(' - ');
    let protein, carbs, fats;

    if (macrosPart) {
      const macros = macrosPart.split(',').map((s) => s.trim());
      macros.forEach((macro) => {
        if (macro.startsWith('Protein:')) protein = Number(macro.replace(/[^0-9.]/g, ''));
        if (macro.startsWith('Carbs:')) carbs = Number(macro.replace(/[^0-9.]/g, ''));
        if (macro.startsWith('Fats:')) fats = Number(macro.replace(/[^0-9.]/g, ''));
      });
    }

    return {
      foodName: foodNamePart || '',
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
    };
  }

  // When editing existing meal
  useEffect(() => {
    if (meal) {
      const parsed = parseDetails(meal.notes || meal.text || '');
      setValue('foodName', parsed.foodName);
      setValue('protein', parsed.protein);
      setValue('carbs', parsed.carbs);
      setValue('fats', parsed.fats);
    } else if (value) {
      Object.entries(value).forEach(([key, val]) => {
        setValue(key as keyof FoodFormData, val as any);
      });
    }
  }, [meal, value, setValue]);

  const protein = Number(watch('protein')) || 0;
  const carbs = Number(watch('carbs')) || 0;
  const fats = Number(watch('fats')) || 0;

  const estimatedCalories = protein * 4 + carbs * 4 + fats * 9;
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FoodFormData) => {
    const details = `${data.foodName} - Protein: ${protein}g, Carbs: ${carbs}g, Fats: ${fats}g`;
    const date = getLocalDateString();

    // ---------------------------
    // EDIT EXISTING MEAL
    // ---------------------------
    if (meal && meal.id) {
      const taskUpdatePayload = {
        text: data.foodName,
        type: 'Meal',
        completed: meal.completed ?? false,
        notes: details,
        plannerId: meal.plannerId,
        id: meal.id,
        logId: meal.logId,
      };

      // Update Task
      const taskRes = await fetchApi('PUT', `/api/tasks/${meal.id}`, taskUpdatePayload);

      // Update Log (if linked)
      let logResOk = true;
      if (meal.logId) {
        const logUpdatePayload = {
          details,
          calories: estimatedCalories,
          type: 'Food',
        };
        const logRes = await fetchApi('PUT', `/api/logs/${meal.logId}`, logUpdatePayload);
        logResOk = logRes.status === 200;
      }

      if (taskRes.status === 200 && taskRes.data && logResOk) {
        onAddMeal?.(taskRes.data as PlannerItem);
        onSuccess?.();
        if (!onChange) setOpen(true);
        onClose?.();
        return;
      } else {
        alert('Failed to update meal.');
        return;
      }
    }

    // ---------------------------
    // CREATE NEW MEAL
    // ---------------------------
    const payload = {
      date,
      type: 'Food',
      details,
      calories: estimatedCalories,
    };

    const logRes = await fetchApi('POST', '/api/logs', payload);

    const plannerRes = await fetchApi('GET', `/api/planners?date=${date}`);
    const plannerId = (plannerRes?.data as { id?: string })?.id;

    let taskResData = null;

    if (plannerId && (logRes.status === 200 || logRes.status === 201)) {
      const createdLog = logRes.data as { id: number };

      const taskPayload = {
        text: data.foodName,
        type: 'Meal',
        completed: false,
        notes: details,
        plannerId,
        logId: createdLog.id,
      };

      const taskRes = await fetchApi('POST', '/api/tasks', taskPayload);
      taskResData = taskRes?.data;
    }

    if (logRes.status === 200 || logRes.status === 201) {
      reset();
      onSuccess?.();
      onAddMeal?.(taskResData as PlannerItem);
      if (!onChange) setOpen(true);
      onClose?.();
    } else {
      alert('Failed to log entry.');
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper sx={{ p: 4, mt: 4, borderRadius: 3 }} elevation={3}>
          <Typography variant="h5" gutterBottom align="center">
            {meal && meal.id ? 'Edit Meal' : 'Log a Meal'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              {/* FOOD NAME */}
              <Controller
                name="foodName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField label="Food Name" fullWidth required value={field.value ?? ''} onChange={field.onChange} />
                )}
              />

              {/* MACROS */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
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
                        InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
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
                        InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
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
                        InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Typography align="center" fontWeight="bold">
                Estimated Calories: {estimatedCalories} kcal
              </Typography>

              <Button type="submit" variant="contained" size="large">
                {meal && meal.id ? 'Save Changes' : 'Log Meal'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </motion.div>

      <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setOpen(false)}>
          Meal {meal && meal.id ? 'updated' : 'logged'} successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
