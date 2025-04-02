import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Paper, Typography } from '@mui/material';

interface DailyCaloriesChartProps {
  data: { date: string; calories: number }[];
}

const DailyCaloriesChart = ({ data }: DailyCaloriesChartProps) => {
  return (
    <Paper sx={{ p: 2, mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Daily Calorie Intake
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calories" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DailyCaloriesChart;
