import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
} from '@mui/material';
import TimeBlockSections from '../components/TimeBlockSections';
import { fetchApi } from '../utils/fetch';

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

  /*  Load Planner otherwise create a planner if does not exist */
  useEffect(() => {
    async function loadPlanner() {
      const { data, status } = await fetchApi<Planner>(
        'GET',
        `/api/planners?date=${selectedDate}`
      );
      
      console.log('Planner fetch status:', status, data);

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
      <TextField
        type="date"
        label="Select Date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        sx={{ mb: 2 }}
      />
      {planner && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <TimeBlockSections
            selectedDate={selectedDate}
            plannerId={planner.id}
          />
        </Paper>
      )}
    </Container>
  );
};

export default PlannerScaffold;
