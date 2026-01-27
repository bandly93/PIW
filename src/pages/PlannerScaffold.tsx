import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Stack,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
import { format, addDays, subDays } from 'date-fns';
import TimeBlockSections from '../components/TimeBlockSections';
import { fetchApi } from '../utils/fetch';
import { useAppDispatch } from '../store';

interface Planner {
  id: string;
  date: string;
  label?: string;
}

// Helper: Get LOCAL date string (YYYY-MM-DD) - USE THIS FOR "TODAY"
const getLocalDateString = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Parse date string as local date
const parseLocalDate = (dateString: string) => {
  return new Date(dateString + 'T00:00:00'); // No 'Z' = local time
};

const PlannerScaffold = () => {
  const dispatch = useAppDispatch();
  
  // Store selectedDate in LOCAL format (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(() => {
    return getLocalDateString(); // 🔽 Use local date
  });

  const [planner, setPlanner] = useState<Planner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigate to previous day
  const goToPreviousDay = () => {
    const current = parseLocalDate(selectedDate);
    const prev = subDays(current, 1);
    setSelectedDate(getLocalDateString(prev));
  };

  // Navigate to next day
  const goToNextDay = () => {
    const current = parseLocalDate(selectedDate);
    const next = addDays(current, 1);
    setSelectedDate(getLocalDateString(next));
  };

  // Navigate to today
  const goToToday = () => {
    setSelectedDate(getLocalDateString());
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const today = getLocalDateString();
    const tomorrow = getLocalDateString(addDays(new Date(), 1));
    const yesterday = getLocalDateString(subDays(new Date(), 1));

    if (dateString === today) return 'Today';
    if (dateString === tomorrow) return 'Tomorrow';
    if (dateString === yesterday) return 'Yesterday';

    const date = parseLocalDate(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Format date for subtitle display
  const formatSubtitleDate = (dateString: string) => {
    const date = parseLocalDate(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  // Load or create planner
  useEffect(() => {
    async function loadPlanner() {
      setLoading(true);
      setError(null);

      try {
        const { data, status } = await fetchApi<Planner>(
          'GET',
          `/api/planners?date=${selectedDate}`,
          null,
          dispatch
        );

        if (status === 200 && data) {
          setPlanner(data);
        } else if (status === 404) {
          // Create new planner if not found
          const res = await fetchApi<Planner>(
            'POST',
            '/api/planners',
            { date: selectedDate },
            dispatch
          );
          if (res.status === 201 && res.data) {
            setPlanner(res.data);
          } else {
            setError('Failed to create planner');
          }
        } else {
          setError('Failed to load planner');
        }
      } catch (err) {
        console.error('Error loading planner:', err);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadPlanner();
  }, [selectedDate, dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {/* Date Navigation Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <IconButton onClick={goToPreviousDay} sx={{ color: '#fff' }}>
            <ChevronLeft />
          </IconButton>

          <Box textAlign="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
              {formatDisplayDate(selectedDate)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {formatSubtitleDate(selectedDate)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={goToToday} sx={{ color: '#fff' }} title="Go to today">
              <Today />
            </IconButton>
            <IconButton onClick={goToNextDay} sx={{ color: '#fff' }}>
              <ChevronRight />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Paper sx={{ p: 3, mt: 2, backgroundColor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Planner Content */}
      {!loading && !error && planner && (
        <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
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
