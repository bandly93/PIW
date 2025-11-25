import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import MacroPieChart from '../components/MacroPieChart';
import { fetchApi } from '../utils/fetch';
import { useAppDispatch } from '../store'

type LogEntry = {
  id: number;
  date: string;
  type: string;
  details: string;
  calories?: number;
};

const Fitness = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 });
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchLogs = async () => {
      if (!selectedDate) return;

      setLoading(true);
      const date = format(selectedDate, 'yyyy-MM-dd');

      try {
        const { data } = await fetchApi<LogEntry[]>('GET', `/api/logs?type=Food&date=${date}`, null, dispatch);
        setLogs(data);

        const totals = data.reduce(
          (acc, log) => {
            const match = log.details.match(/Protein: ([\d.]+)g, Carbs: ([\d.]+)g, Fats: ([\d.]+)g/);
            if (!match) return acc;
            acc.protein += parseFloat(match[1]);
            acc.carbs += parseFloat(match[2]);
            acc.fats += parseFloat(match[3]);
            return acc;
          },
          { protein: 0, carbs: 0, fats: 0 }
        );

        console.log('Calculated macros:', totals);

        setMacros(totals);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedDate]); // 👈 ✅ Dependency added here

  type MacroGoals = {
    proteinGoal: number;
    carbsGoal: number;
    fatsGoal: number;
    calorieGoal: number;
  };

  const [goals, setGoals] = useState<MacroGoals | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const { data } = await fetchApi<MacroGoals>('GET', `/api/user/goals`, null);
        setGoals(data);
      } catch (err) {
        console.error('Failed to fetch macro goals:', err);
      }
    };
    fetchGoals();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Daily Macro Breakdown
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={3}>
          <Button
            variant="outlined"
            onClick={() => {
              if (selectedDate) {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - 1);
                setSelectedDate(newDate);
              }
            }}
          >
            {"<"}
          </Button>
          <DatePicker
            label="Select a date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            disableFuture
          />
          <Button
            variant="outlined"
            disabled={
              !selectedDate || format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            }
            onClick={() => {
              if (selectedDate) {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() + 1);
                setSelectedDate(newDate);
              }
            }}
          >
            {">"}
          </Button>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
              <Typography variant="h6" align="center" gutterBottom>
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
              </Typography>
              <MacroPieChart
                protein={macros.protein}
                carbs={macros.carbs}
                fats={macros.fats}
              />
              <Typography
                align="center"
                sx={{ mt: 2, fontWeight: 600, fontSize: 18, color: '#388e3c' }}
              >
                Total Calories: {
                  logs.reduce((sum, log) => sum + (typeof log.calories === 'number' ? log.calories : 0), 0).toFixed(1)
                } kcal
              </Typography>
            </Paper>
            {goals && (
              <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: 400, mx: 'auto', borderRadius: 2 }}>
                <Typography variant="subtitle1" align="center" fontWeight="bold" gutterBottom>
                  Daily Goals
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                  <Stack alignItems="center">
                    <Typography variant="body2" color="primary">Protein</Typography>
                    <Typography fontWeight="bold">{goals.proteinGoal}g</Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="body2" color="secondary">Carbs</Typography>
                    <Typography fontWeight="bold">{goals.carbGoal}g</Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="body2" color="warning.main">Fat</Typography>
                    <Typography fontWeight="bold">{goals.fatGoal}g</Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="body2" color="success.main">Calories</Typography>
                    <Typography fontWeight="bold">{goals.calorieGoal} kcal</Typography>
                  </Stack>
                </Stack>
              </Paper>
            )}
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Calories</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>{log.calories ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default Fitness;
