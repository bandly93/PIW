import {
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { useState, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { fetchApi } from '../utils/fetch';

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
  selectedDate: string;
  plannerId: string;
}

const TimeBlockSection = ({ label, items, onAdd, onUpdate, onDelete, selectedDate, plannerId }: Props) => {
  const [text, setText] = useState('');
  const [notes, setNotes] = useState('')
  const [taskType, setTaskType] = useState<PlannerItem['type']>('Other');
  const [editTask, setEditTask] = useState<PlannerItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useState<PlannerItem[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadTasks() {
      const { data, status } = await fetchApi<PlannerItem[]>(
        'GET',
        `/api/tasks?date=${selectedDate}`,
        undefined,
        dispatch
      );
      if (status === 200 && data) setTaskList(data);
    }

    loadTasks();
  }, [selectedDate]);

  const handleAdd = async () => {
    if (!text.trim()) return;

    const newItem: PlannerItem = {
      id: editTask ? editTask.id : Date.now().toString(),
      text,
      type: taskType,
      completed: editTask ? editTask.completed : false,
      notes,
    };

    try {
      if (editTask) {
        const { data, status } = await fetchApi<PlannerItem>(
          'PUT',
          `/api/tasks/${editTask.id}`,
          { ...newItem, plannerId },
          dispatch
        );
        if (status === 200 && data) {
          const updatedList = taskList.map((i) => (i.id === data.id ? data : i));
          setTaskList(updatedList);
        }
      } else {
        const { data, status } = await fetchApi<PlannerItem>(
          'POST',
          '/api/tasks',
          { ...newItem, date: selectedDate, plannerId },
          dispatch
        );
        if (status === 201 && data) {
          setTaskList((prev) => [...prev, data]);
        }
      }

      setText('');
      setNotes('');
      setEditTask(null);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <Paper sx={{ p: 3 }}>
      <TaskTypeButtons setTaskType={setTaskType} setShowModal={setShowModal} />
      <DndContext sensors={sensors} collisionDetection={closestCenter}>
        <SortableContext items={taskList.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Stack spacing={1}>
            {taskList.map((item, index) => (
              <SortableTask
                key={item.id}
                item={item}
                index={index}
                onUpdate={onUpdate}
                onDelete={onDelete}
                openEditModal={(task) => {
                  setEditTask(task);
                  setText(task.text);
                  setNotes(task.notes);
                  setTaskType(task.type);
                  setShowModal(true);
                }}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
      <Typography variant="body2" align="right" sx={{ mt: 2 }}>
        Completed: {taskList.filter((item) => item.completed).length} / {taskList.length}
      </Typography>
      <TaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        onAdd={onAdd}
        text={text}
        setText={setText}
        notes={notes}
        setNotes={setNotes}
        taskType={taskType}
        handleAdd={handleAdd}
        editTask={editTask}
      />
    </Paper>
  );
};

export default TimeBlockSection;
