import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box
} from '@mui/material';
import MacroPieChart from '../components/MacroPieChart';

const API = import.meta.env.VITE_API_URL;

type LogEntry = {
  id: number;
  date: string;
  type: string;
  details: string;
  calories?: number;
};

const Fitness = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API}/api/logs/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const totals = logs.reduce(
    (acc, log) => {
      const { details, type } = log;

      if (type === 'Food') {
        const match = details.match(/Protein: (\d+)g, Carbs: (\d+)g, Fats: (\d+)g/);
        if (match) {
          acc.protein += parseInt(match[1]);
          acc.carbs += parseInt(match[2]);
          acc.fats += parseInt(match[3]);
        }
      }

      return acc;
    },
    { protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Fitness Logs
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
          <MacroPieChart
            protein={totals.protein}
            carbs={totals.carbs}
            fats={totals.fats}
          />
        </>
      )}
    </Container>
  );
};

export default Fitness;
