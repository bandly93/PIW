import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useState } from 'react';
import { format } from 'date-fns';
import FoodLoggerForm from '../components/FoodLoggerForm';

interface TaskItem {
  id: string;
  text: string;
  type: 'Meal' | 'Errand' | 'Work' | 'Other';
  completed: boolean;
  proteins?: number;
  carbs?: number;
  fats?: number;
  calories?: number;
}

const TasksEditor = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState('');
  const [type, setType] = useState<'Meal' | 'Errand' | 'Work' | 'Other'>('Work');

  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const addTask = () => {
    if (!text.trim()) return;

    const newTask: TaskItem = {
      id: Date.now().toString(),
      text,
      type,
      completed: false,
      ...(type === 'Meal' && {
        proteins: Number(proteins),
        carbs: Number(carbs),
        fats: Number(fats),
        calories:
          Number(proteins) * 4 + Number(carbs) * 4 + Number(fats) * 9,
      }),
    };

    setTasks((prev) => [...prev, newTask]);
    setText('');
    setType('Other');
    setProteins('');
    setCarbs('');
    setFats('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mt={4} mb={2} align="center">
        Task Editor for {format(new Date(), 'PPPP')}
      </Typography>

      <Box display="flex" gap={2} mb={2} flexDirection="column">
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="New Task"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Select value={type} onChange={(e) => setType(e.target.value as any)}>
            <MenuItem value="Meal">Meal</MenuItem>
            <MenuItem value="Errand">Errand</MenuItem>
            <MenuItem value="Work">Work</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <Button variant="contained" onClick={addTask}>
            Add
          </Button>
        </Box>

        {/* Show macro inputs if Meal is selected */}
        {type === 'Meal' && <FoodLoggerForm />}
      </Box>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            onClick={() => toggleTask(task.id)}
            sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${task.text} (${task.type})`}
              secondary={
                task.type === 'Meal' && task.calories !== undefined
                  ? `Estimated Calories: ${task.calories} kcal`
                  : task.completed
                  ? 'Completed'
                  : 'Incomplete'
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TasksEditor;
