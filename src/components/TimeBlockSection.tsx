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
} from '@mui/material';
import { Edit, Delete, Save } from '@mui/icons-material';
import { useState } from 'react';

interface Props {
  label: string;
  icon: string;
  items: string[];
  onAdd: (item: string) => void;
  onUpdate?: (index: number, newValue: string) => void;
  onDelete?: (index: number) => void;
}

const TimeBlockSection = ({ label, icon, items, onAdd, onUpdate, onDelete }: Props) => {
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput('');
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim() && onUpdate) {
      onUpdate(index, editValue.trim());
      setEditingIndex(null);
      setEditValue('');
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        {icon} {label}
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          fullWidth
          size="small"
          label="Add task or meal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Stack>

      <List>
        {items.map((item, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <>
                {editingIndex === idx ? (
                  <IconButton edge="end" onClick={() => handleSaveEdit(idx)}>
                    <Save />
                  </IconButton>
                ) : (
                  <IconButton edge="end" onClick={() => {
                    setEditingIndex(idx);
                    setEditValue(item);
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
            {editingIndex === idx ? (
              <TextField
                fullWidth
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <ListItemText primary={item} />
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TimeBlockSection;
