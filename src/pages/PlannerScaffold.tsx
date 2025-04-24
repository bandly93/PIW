import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Stack,
  Paper,
  IconButton,
  Button,
  Box,
  TextField,
} from '@mui/material';
import TimeBlockSections, { PlannerItem } from '../components/TimeBlockSections';
import { fetchApi } from '../utils/fetch';
import {
  Edit, Done, Clear, ContentCopy, Add
} from '@mui/icons-material';

interface Planner {
  id: string;
  date: string;
  label?: string;
}

const PlannerScaffold = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [planner, setPlanner] = useState<Planner | null>(null);

  useEffect(() => {
    async function loadPlanner() {
      const { data, status } = await fetchApi<Planner>(
        'GET',
        `/api/planners?date=${selectedDate}`
      );

      if (status === 200 && data) {
        setPlanner(data);
      } else if (status === 404) {
        const res = await fetchApi<Planner>('POST', '/api/planners', { date: selectedDate });
        if (res.status === 201 && res.data) {
          setPlanner(res.data);
        }
      }
    }

    loadPlanner();
  }, [selectedDate]);

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Planner Scaffold
      </Typography>

      <TextField
        type="date"
        label="Select Date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      {planner && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <TimeBlockSections
            label={selectedDate}
            items={[]} // placeholder, handled inside TimeBlockSections
            onAdd={() => {}}
            onUpdate={() => {}}
            onDelete={() => {}}
            selectedDate={selectedDate}
            plannerId={planner.id}
          />
        </Paper>
      )}
    </Container>
  );
};

export default PlannerScaffold;
