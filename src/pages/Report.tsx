import { useEffect, useState } from 'react';
import Chart from '../components/Chart';
import { Container, Typography, Paper } from '@mui/material';

type LogEntry = {
  date: string;
  calories?: number;
};

const Report = () => {
  const [data, setData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then((logs: LogEntry[]) => {
        const chartData = logs
          .filter(log => log.calories)
          .map(log => ({
            date: log.date,
            value: log.calories!,
          }));

        setData(chartData);
      });
  }, []);

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
