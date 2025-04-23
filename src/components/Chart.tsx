import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ChartProps = {
  data: { date: string; value: number }[];
  title: string;
  color?: string;
  label?: string;
};

const Chart = ({ data, title, color = '#1976d2', label = 'Value' }: ChartProps) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4 }}
            name={label}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
