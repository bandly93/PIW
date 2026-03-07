import {
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from './SortableTask';
import TaskModal from './TaskModal';
import TaskTypeButtons from './TaskTypeButtons';
import { fetchApi } from '../utils/fetch';
import { useAppDispatch } from '../store';

export interface PlannerItem {
  id: string;
  text: string;
  type: 'Meal' | 'Work' | 'Errand' | 'Other';
  completed: boolean;
  notes: string;
  order: number;
  plannerId: string;
  date?: string;
  logId?: number;
}

interface Props {
  selectedDate: string;
  plannerId: string;
}

const INITIAL_TASK: PlannerItem = {
  id: '',
  text: '',
  type: 'Other',
  completed: false,
  notes: '',
  order: 0,
  plannerId: '',
  logId: undefined,
};

const TimeBlockSection = ({ selectedDate, plannerId }: Props) => {
  const dispatch = useAppDispatch();
  
  const [taskList, setTaskList] = useState<PlannerItem[]>([]);
  const [editTask, setEditTask] = useState<PlannerItem | null>(null);
  const [currentTask, setCurrentTask] = useState<PlannerItem>(INITIAL_TASK);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Prevent accidental drags
    })
  );

  // Load tasks for the selected date
  const loadTasks = useCallback(async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const { data, status } = await fetchApi<PlannerItem[]>(
        'GET',
        `/api/tasks?date=${selectedDate}&plannerId=${plannerId}`,
        null,
        dispatch
      );
      if (status === 200 && data) {
        setTaskList(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, plannerId, dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Reset form when closing modal
  const resetForm = useCallback(() => {
    setCurrentTask(INITIAL_TASK);
    setEditTask(null);
    setShowModal(false);
  }, []);

  // Add a new task
  const handleAdd = useCallback(async () => {
    if (!currentTask.text.trim()) return;

    const newItem = {
      text: currentTask.text,
      type: currentTask.type,
      completed: currentTask.completed,
      notes: currentTask.notes,
      plannerId,
      order: taskList.length,
      date: selectedDate,
    };

    try {
      const { data, status } = await fetchApi<PlannerItem>(
        'POST',
        '/api/tasks',
        newItem,
        dispatch
      );
      if (status === 201 && data) {
        setTaskList((prev) => [...prev, data]);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task.');
    }
  }, [currentTask, plannerId, selectedDate, taskList.length, dispatch, resetForm]);

  // Edit an existing task
  const handleEdit = useCallback(async (updatedTask: PlannerItem) => {
    try {
      const { data, status } = await fetchApi<PlannerItem>(
        'PUT',
        `/api/tasks/${updatedTask.id}`,
        { ...updatedTask, date: selectedDate },
        dispatch
      );
      
      if (status === 200 && data) {
        setTaskList((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? data : task))
        );
        resetForm();
      } else {
        alert('Failed to update task.');
      }
    } catch (error) {
      console.error('Error editing task:', error);
      alert('Error editing task.');
    }
  }, [selectedDate, dispatch, resetForm]);

  // Delete a task
  const handleDelete = useCallback(async (taskId: string) => {
    try {
      const { status } = await fetchApi('DELETE', `/api/tasks/${taskId}`, null, dispatch);
      
      if (status === 200 || status === 204) {
        setTaskList((prev) => prev.filter((task) => task.id !== taskId));
      } else {
        alert('Failed to delete task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting.');
    }
  }, [dispatch]);

  // Save (add or edit)
  const handleSave = useCallback(async () => {
    if (!currentTask.text.trim()) return;

    if (editTask) {
      await handleEdit({ ...currentTask, id: editTask.id });
    } else {
      await handleAdd();
    }
  }, [currentTask, editTask, handleAdd, handleEdit]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTaskList((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);

      const reordered = arrayMove(prev, oldIndex, newIndex).map((task, idx) => ({
        ...task,
        order: idx,
      }));

      // TODO: Persist order to backend
      // fetchApi('PUT', '/api/tasks/reorder', { tasks: reordered }, dispatch);

      return reordered;
    });
  }, []);

  // Open edit modal
  const openEditModal = useCallback((task: PlannerItem) => {
    setEditTask(task);
    setCurrentTask(task);
    setShowModal(true);
  }, []);

  // Update current task field
  const updateCurrentTask = useCallback((updates: Partial<PlannerItem>) => {
    setCurrentTask((prev) => ({ ...prev, ...updates }));
  }, []);

  const completedCount = taskList.filter((t) => t.completed).length;
  const sortedTasks = [...taskList].sort((a, b) => a.order - b.order);

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <TaskTypeButtons
        showModal={showModal}
        setTaskType={(type) => updateCurrentTask({ type })}
        setShowModal={setShowModal}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1}>
            {sortedTasks.map((task, index) => (
              <SortableTask
                key={task.id}
                task={task}
                index={index}
                onEditTask={handleEdit}
                onDeleteTask={handleDelete}
                openEditModal={openEditModal}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      <Typography variant="body2" align="right" sx={{ mt: 2 }}>
        Completed: {completedCount} / {taskList.length}
      </Typography>

      <TaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        text={currentTask.text}
        taskType={currentTask.type}
        setPlannerItem={updateCurrentTask}
        notes={currentTask.notes}
        handleSave={handleSave}
        editTask={editTask}
        setTaskList={setTaskList}
        setEditTask={setEditTask}
      />
    </Paper>
  );
};

export default TimeBlockSection;
