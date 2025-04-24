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
            const match = log.details.match(/Protein: (\d+)g, Carbs: (\d+)g, Fats: (\d+)g/);
            if (match) {
              acc.protein += parseInt(match[1]);
              acc.carbs += parseInt(match[2]);
              acc.fats += parseInt(match[3]);
            }
            return acc;
          },
          { protein: 0, carbs: 0, fats: 0 }
        );

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
            </Paper>
            {goals && (
              <Box textAlign="center" mb={2}>
                <Typography variant="subtitle1">Daily Goals:</Typography>
                <Typography>Protein: {goals.proteinGoal}g</Typography>
                <Typography>Carb: {goals.carbGoal}g</Typography>
                <Typography>Fat: {goals.fatGoal}g</Typography>
                <Typography>Calories: {goals.calorieGoal} kcal</Typography>
              </Box>
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
