
  import {
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    IconButton,
    Stack,
    Select,
    MenuItem,
    Checkbox,
    Chip,
  } from '@mui/material';
  import { Edit, Delete, Save } from '@mui/icons-material';
  import { useState } from 'react';

  type PlannerItemType = 'Meal' | 'Task' | 'Workout';

  export interface PlannerItem {
    id: string;
    type: PlannerItemType;
    text: string;
    completed: boolean;
  }

  interface Props {
    label: string;
    icon: string;
    items: PlannerItem[];
    onAdd: (item: PlannerItem) => void;
    onUpdate?: (index: number, newItem: PlannerItem) => void;
    onDelete?: (index: number) => void;
  }

  const TimeBlockSection = ({ label, items, onAdd, onUpdate, onDelete }: Props) => {
    const [input, setInput] = useState('');
    const [type, setType] = useState<PlannerItemType>('Task');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [editType, setEditType] = useState<PlannerItemType>('Task');

    const handleAdd = () => {
      if (!input.trim()) return;
      onAdd({
        id: Date.now().toString(),
        text: input.trim(),
        type,
        completed: false,
      });
      setInput('');
      setType('Task');
    };

    const handleSaveEdit = (index: number) => {
      if (!editValue.trim() || !onUpdate) return;
      onUpdate(index, {
        ...items[index],
        text: editValue.trim(),
        type: editType,
      });
      setEditingIndex(null);
      setEditValue('');
    };

    return (
      <Paper sx={{ p: 3, borderRadius: 1, borderStyle: 'dashed', borderColor: 'lightGray' }} elevation={2}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>

        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            fullWidth
            size="small"
            label="Add item"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as PlannerItemType)}
            size="small"
          >
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="Meal">Meal</MenuItem>
            <MenuItem value="Workout">Workout</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Stack>

        <List>
          {items.map((item, idx) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <>
                  {editingIndex === idx ? (
                    <IconButton edge="end" onClick={() => handleSaveEdit(idx)}>
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton edge="end" onClick={() => {
                      setEditingIndex(idx);
                      setEditValue(item.text);
                      setEditType(item.type);
                    }}>
                      <Edit />
                    </IconButton>
                  )}
                  <IconButton edge="end" onClick={() => onDelete?.(idx)}>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <Checkbox
                checked={item.completed}
                onChange={() =>
                  onUpdate?.(idx, { ...item, completed: !item.completed })
                }
              />
              {editingIndex === idx ? (
                <>
                  <TextField
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <Select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as PlannerItemType)}
                    size="small"
                  >
                    <MenuItem value="Task">Task</MenuItem>
                    <MenuItem value="Meal">Meal</MenuItem>
                    <MenuItem value="Workout">Workout</MenuItem>
                  </Select>
                </>
              ) : (
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label={item.type} size="small" />
                      <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                        {item.text}
                      </span>
                    </Box>
                  }
                />
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  export default TimeBlockSection;
