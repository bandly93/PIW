import {
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { useState } from 'react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from './SortableTask'
import TaskTypeButtons from './TaskTypeButtons';
import TaskModal from './TaskModal'

export interface PlannerItem {
  id: string;
  text: string;
  type: 'Meal' | 'Work' | 'Errand' | 'Other';
  completed: boolean;
  notes: string;
}

interface Props {
  label: string;
  items: PlannerItem[];
  onAdd: (item: PlannerItem) => void;
  onUpdate: (index: number, item: PlannerItem) => void;
  onDelete: (index: number) => void;
}

const TimeBlockSection = ({ label, items, onAdd, onUpdate, onDelete }: Props) => {
  const [text, setText] = useState('');
  const [notes, setNotes] = useState('')
  const [taskType, setTaskType] = useState<PlannerItem['type']>('Other');
  const [editTask, setEditTask] = useState<PlannerItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
  
    const newItem: PlannerItem = {
      id: editTask ? editTask.id : Date.now().toString(),
      text,
      type: taskType,
      completed: editTask ? editTask.completed : false,
      notes,
    };
  
    if (editTask) {
      const index = items.findIndex(i => i.id === editTask.id);
      onUpdate(index, newItem);
    } else {
      onAdd(newItem);
    }
  
    setText('');
    setNotes('');
    setEditTask(null);
    setShowModal(false);
  };
  

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(items, oldIndex, newIndex);
    newOrder.forEach((item, i) => onUpdate(i, item));
  };

  const openEditModal = (task: PlannerItem) => {
    setEditTask(task);
    setText(task.text);
    setNotes(task.notes);
    setTaskType(task.type);
    setShowModal(true);
  };
  
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <TaskTypeButtons setTaskType={setTaskType} showModal={showModal} setShowModal={setShowModal} />
      </Stack>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Stack spacing={1}>
            {items.map((item, index) => (
              <SortableTask
                key={item.id}
                item={item}
                index={index}
                onUpdate={onUpdate}
                onDelete={onDelete}
                openEditModal={openEditModal}
            />            
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
      <Typography variant="body2" align="right" sx={{ mt: 2 }}>
        Completed: {items.filter((item) => item.completed).length} / {items.length}
      </Typography>
      <TaskModal
        text={text}
        showModal={showModal}
        setShowModal={setShowModal}
        onAdd={onAdd}
        setText={setText}
        setNotes={setNotes}
        notes={notes}
        taskType={taskType}
        handleAdd={handleAdd}
      />
    </Paper>
  );
};

export default TimeBlockSection;
