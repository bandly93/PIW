import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  MenuItem,
  Paper,
  Grid,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useState } from 'react';

type Units = {
  weight: 'kg' | 'lbs';
  height: 'cm' | 'in';
};

type BMRFormData = {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  weightUnit: Units['weight'];
  heightUnit: Units['height'];
};

const BMR = () => {
  const { control, handleSubmit } = useForm<BMRFormData>({
    defaultValues: {
      weightUnit: 'kg',
      heightUnit: 'cm',
    }
  });
  const [result, setResult] = useState<number | null>(null);

  const calculateBMR = (data: BMRFormData) => {
    const { age, weight, height, gender, weightUnit, heightUnit } = data;

    // Convert units to metric
    const weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const heightInCm = heightUnit === 'in' ? height * 2.54 : height;

    const bmr =
      gender === 'male'
        ? 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
        : 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;

    setResult(Math.round(bmr));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          BMR Calculator
        </Typography>

        <Box component="form" onSubmit={handleSubmit(calculateBMR)}>

          <Controller
            name="age"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField {...field} label="Age" type="number" fullWidth margin="normal" required />
            )}
          />

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Controller
                name="weight"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label="Weight" type="number" fullWidth margin="normal" required />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="weightUnit"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Unit" fullWidth margin="normal">
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="lbs">lbs</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Controller
                name="height"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label="Height" type="number" fullWidth margin="normal" required />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="heightUnit"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Unit" fullWidth margin="normal">
                    <MenuItem value="cm">cm</MenuItem>
                    <MenuItem value="in">in</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField {...field} select label="Gender" fullWidth margin="normal">
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            )}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Calculate
          </Button>

          {result !== null && (
            <Typography variant="h6" sx={{ mt: 3 }}>
              Your BMR is: {result} kcal/day
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default BMR;
