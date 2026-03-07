import { useEffect, useState } from 'react';
import Chart from '../components/Chart';
import { Container, Typography, Paper } from '@mui/material';
import { fetchApi } from '../utils/fetch';
import { useAppDispatch } from '../store';

type LogEntry = {
  date: string;
  calories?: number;
};

const Report = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: logs, status } = await fetchApi<LogEntry[]>(
        'GET',
        '/api/logs',
        null,
        dispatch
      );
      if (status === 200 && Array.isArray(logs)) {
        const chartData = logs
          .filter((log) => log.calories != null)
          .map((log) => ({
            date: log.date,
            value: log.calories!,
          }));
        setData(chartData);
      }
    };
    load();
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Calories Over Time</Typography>
        <Chart data={data} title="Calories Burned / Consumed" label="Calories" />
      </Paper>
    </Container>
  );
};

export default Report;
