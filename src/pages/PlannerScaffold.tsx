import { Container, Typography, Stack } from '@mui/material';
import TimeBlockSection from '../components/TimeBlockSection';
import { useState } from 'react';

const PlannerScaffold = () => {
  const [morningItems, setMorningItems] = useState<string[]>([]);
  const [afternoonItems, setAfternoonItems] = useState<string[]>([]);
  const [eveningItems, setEveningItems] = useState<string[]>([]);

  const updateItem = (
    section: 'morning' | 'afternoon' | 'evening',
    index: number,
    newValue: string
  ) => {
    const updater = {
      morning: setMorningItems,
      afternoon: setAfternoonItems,
      evening: setEveningItems,
    }[section];

    updater((prev) => {
      const copy = [...prev];
      copy[index] = newValue;
      return copy;
    });
  };

  const deleteItem = (
    section: 'morning' | 'afternoon' | 'evening',
    index: number
  ) => {
    const updater = {
      morning: setMorningItems,
      afternoon: setAfternoonItems,
      evening: setEveningItems,
    }[section];

    updater((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Daily Planner
      </Typography>

      <Stack spacing={4}>
        <TimeBlockSection
          label="Morning"
          icon="🌅"
          items={morningItems}
          onAdd={(item) => setMorningItems((prev) => [...prev, item])}
          onUpdate={(idx, val) => updateItem('morning', idx, val)}
          onDelete={(idx) => deleteItem('morning', idx)}
        />

        <TimeBlockSection
          label="Afternoon"
          icon="🌤"
          items={afternoonItems}
          onAdd={(item) => setAfternoonItems((prev) => [...prev, item])}
          onUpdate={(idx, val) => updateItem('afternoon', idx, val)}
          onDelete={(idx) => deleteItem('afternoon', idx)}
        />

        <TimeBlockSection
          label="Evening"
          icon="🌙"
          items={eveningItems}
          onAdd={(item) => setEveningItems((prev) => [...prev, item])}
          onUpdate={(idx, val) => updateItem('evening', idx, val)}
          onDelete={(idx) => deleteItem('evening', idx)}
        />
      </Stack>
    </Container>
  );
};

export default PlannerScaffold;
