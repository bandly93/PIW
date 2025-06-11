import {
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { useState, useEffect, useReducer } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from './SortableTask';
import TaskTypeButtons from './TaskTypeButtons';
import TaskModal from './TaskModal';
import { useDispatch } from 'react-redux';
import { fetchApi } from '../utils/fetch';

export interface PlannerItem {
  id: string;
  text: string;
  type: 'Meal' | 'Work' | 'Errand' | 'Other';
  completed: boolean;
  notes: string;
  order: number; // New field for task order
}

interface Props {
  selectedDate: string;
  plannerId: string;
}

const initialTask: PlannerItem = {
  id: '',
  text: '',
  type: 'Other',
  completed: false,
  notes: '',
  order: 0,
};

const TimeBlockSection = ({ selectedDate, plannerId }: Props) => {
  const [plannerItem, setPlannerItem] = useReducer(
    (state: PlannerItem, newState: Partial<PlannerItem>) => ({
      ...state,
      ...newState,
    }),
    initialTask
  );

  const [editTask, setEditTask] = useState<PlannerItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useState<PlannerItem[]>([]);
  const dispatch = useDispatch();

  const { text, type, notes, completed } = plannerItem;

  useEffect(() => {
    async function loadTasks() {
      try {
        const { data, status } = await fetchApi<PlannerItem[]>(
          'GET',
          `/api/tasks?date=${selectedDate}`
        );
        if (status === 200 && data) {
          setTaskList(data); // Sort tasks by order
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    loadTasks();
  }, [selectedDate]);

  const handleAdd = async () => {
    if (!text.trim()) return;

    const newItem = {
      text,
      type,
      completed,
      date: selectedDate,
      notes,
      plannerId,
      order: taskList.length, // Set order based on the current task count
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
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const onEditTask = async (updatedTask: PlannerItem) => {
    try {
      const response = await fetchApi('PUT', `/api/tasks/${updatedTask.id}`, updatedTask);
      if (response.status === 200 && response.data) {
        setTaskList((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
      } else {
        console.error('Failed to update task:', response);
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleSave = async () => {
    if (editTask) {
      await onEditTask(plannerItem);
      setEditTask(null);
    } else {
      await handleAdd();
    }
    setPlannerItem(initialTask);
    setShowModal(false);
  };

  const onDeleteTask = async (taskId: string) => {
    try {
      const response = await fetchApi('DELETE', `/api/tasks/${taskId}`);
      if (response.status === 200 || response.status === 204) {
        setTaskList((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
        alert('Task deleted successfully!');
      } else {
        alert('Failed to delete task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTaskList((prevTasks) => {
        const oldIndex = prevTasks.findIndex((task) => task.id === active.id);
        const newIndex = prevTasks.findIndex((task) => task.id === over?.id);

        const updatedTasks = [...prevTasks];
        const [movedTask] = updatedTasks.splice(oldIndex, 1);
        updatedTasks.splice(newIndex, 0, movedTask);

        // Update the order field for all tasks
        const reorderedTasks = updatedTasks.map((task, index) => ({
          ...task,
          order: index,
        }));

        // Send the reordered tasks to the backend
        fetchApi('PUT', '/api/tasks/reorder', reorderedTasks);

        return reorderedTasks;
      });
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <Paper sx={{ p: 3 }}>
      <TaskTypeButtons
        showModal={showModal}
        setTaskType={(type) => setPlannerItem({ type })}
        setShowModal={setShowModal}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd} // Add this line
      >
        <SortableContext
          items={taskList.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1}>
            {taskList
              .map((task, index) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  index={index}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  openEditModal={(task) => {
                    setEditTask(task);
                    setPlannerItem(task);
                    setShowModal(true);
                  }}
                />
              ))}
          </Stack>
        </SortableContext>
      </DndContext>
      <Typography variant="body2" align="right" sx={{ mt: 2 }}>
        Completed: {taskList.filter((item) => item.completed).length} /{' '}
        {taskList.length}
      </Typography>
      <TaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        text={text}
        taskType={type}
        setPlannerItem={setPlannerItem}
        notes={notes}
        handleSave={handleSave}
        editTask={editTask}
        onEditTask={onEditTask}
        setTaskList={setTaskList}
      />
    </Paper>
  );
};

export default TimeBlockSection;
