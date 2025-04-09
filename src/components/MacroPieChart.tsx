import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const COLORS = ['#FE4A49', '#009FB7', '#FED766']; // Protein, Carbs, Fats

interface MacroPieChartProps {
  protein: number;
  carbs: number;
  fats: number;
}

const MacroPieChart = ({ protein, carbs, fats }: MacroPieChartProps) => {
  const data = [
    { name: 'Protein', value: protein },
    { name: 'Carb', value: carbs },
    { name: 'Fat', value: fats },
  ];

  return (
    <Paper sx={{ mt: 4, p: 2, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Macronutrient Breakdown
      </Typography>
      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MacroPieChart;
