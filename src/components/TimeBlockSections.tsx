import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
  Dialog,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Delete, Edit, Done, DragHandle } from '@mui/icons-material';
import FoodLoggerForm from './FoodLoggerForm';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

export interface PlannerItem {
  id: string;
  text: string;
  type: 'Meal' | 'Work' | 'Errand' | 'Other';
  completed: boolean;
}

interface Props {
  label: string;
  items: PlannerItem[];
  onAdd: (item: PlannerItem) => void;
  onUpdate: (index: number, item: PlannerItem) => void;
  onDelete: (index: number) => void;
}

const SortableTask = ({
  item,
  index,
  editingIndex,
  editText,
  setEditingIndex,
  setEditText,
  onUpdate,
  onDelete,
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Stack
      ref={setNodeRef}
      style={style}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1.5,
        border: '1px solid #ddd',
        borderRadius: 2,
        bgcolor: item.completed ? '#f0f0f0' : 'inherit',
        textDecoration: item.completed ? 'line-through' : 'none',
      }}
    >
      {editingIndex === index ? (
        <>
          <TextField
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdate(index, { ...item, text: editText });
                setEditingIndex(null);
              }
            }}
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(index, { ...item, text: editText });
              setEditingIndex(null); // ✅ Exit editing mode
              setEditText('');
            }}
          >
            <Done />
          </IconButton>

        </>
      ) : (
        <>
          {/* 👇 Only this part is draggable */}
          <Typography
            sx={{ flexGrow: 1, cursor: 'grab' }}
            {...attributes}
            {...listeners}
          >
            {item.text} ({item.type})
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setEditingIndex(index);
                setEditText(item.text);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
            >
              <Delete />
            </IconButton>
          </Stack>
        </>
      )}
    </Stack>
  );
};

const TimeBlockSection = ({ label, items, onAdd, onUpdate, onDelete }: Props) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<PlannerItem['type']>('Other');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showMealForm, setShowMealForm] = useState(false);

  useEffect(() => {
    setShowMealForm(type === 'Meal');
  }, [type]);

  const handleAdd = () => {
    if (type === 'Meal') {
      setShowMealForm(true);
      return;
    }
  
    if (!text.trim()) return;
  
    const newItem: PlannerItem = {
      id: Date.now().toString(),
      text,
      type,
      completed: false,
    };
  
    onAdd(newItem);
    setText('');
    setType('Other');
  };
  

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(items, oldIndex, newIndex);
    newOrder.forEach((item, i) => onUpdate(i, item));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>

        <Stack direction="row" spacing={1}>
          {['Meal', 'Work', 'Errand', 'Other'].map((option) => (
            <Button
              key={option}
              variant={type === option ? 'contained' : 'outlined'}
              onClick={() => setType(option as PlannerItem['type'])}
            >
              +{option}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField
          fullWidth
          disabled={type === 'Meal'}
          label="Task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Stack>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Stack spacing={1}>
            {items.map((item, index) => (
              <SortableTask
                key={item.id}
                item={item}
                index={index}
                editingIndex={editingIndex}
                editText={editText}
                setEditingIndex={setEditingIndex}
                setEditText={setEditText}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      <Dialog
        open={showMealForm}
        onClose={() => setShowMealForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <FoodLoggerForm
          onClose={() => setShowMealForm(false)}
          onAddMeal={(details: string) => {
            const newItem: PlannerItem = {
              id: Date.now().toString(),
              text: details,
              type: 'Meal',
              completed: false,
            };
            onAdd(newItem);
            setShowMealForm(false);
            setType('Other'); // ✅ reset type for clean UX
          }}
        />
      </Dialog>


    </Paper>
  );
};

export default TimeBlockSection;
