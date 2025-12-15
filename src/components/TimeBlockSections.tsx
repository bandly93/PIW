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
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from './SortableTask';
import TaskModal from './TaskModal';
import TaskTypeButtons from './TaskTypeButtons';
import { fetchApi } from '../utils/fetch';
import { useDispatch } from 'react-redux';

export interface PlannerItem {
  id: string;
  text: string;
  type: 'Meal' | 'Work' | 'Errand' | 'Other';
  completed: boolean;
  notes: string;
  order: number;
  plannerId: string;
  logId?: number;   // 🔽 NEW
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
  plannerId: '',
  logId: undefined,
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
  const [taskList, setTaskList] = useState<PlannerItem[]>([]);
  const [showModal, setShowModal] = useState(false);
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
          setTaskList(data);
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
      notes,
      plannerId,
      order: taskList.length,
      date: selectedDate, // 🔽 ADD THIS
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
      alert('Error adding task.');
    }
  };

  const handleEdit = async (updatedTask: PlannerItem) => {
    try {
      const response = await fetchApi(
        'PUT',
        `/api/tasks/${updatedTask.id}`,
        {
          ...updatedTask,
          date: selectedDate, // 🔽 ADD THIS
        }
      );
      if (response.status === 200 && response.data) {
        setTaskList((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
      } else {
        alert('Failed to update task.');
      }
    } catch (error) {
      console.error('Error editing task:', error);
      alert('Error editing task.');
    }
  };

  const handleSave = async () => {
    if (!plannerItem.text.trim()) return;

    if (editTask) {
      await handleEdit(plannerItem);
      setEditTask(null);
    } else {
      await handleAdd();
    }

    setPlannerItem(initialTask);
    setShowModal(false);
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetchApi('DELETE', `/api/tasks/${taskId}`);
      if (response.status === 200 || response.status === 204) {
        setTaskList((prev) => prev.filter((task) => task.id !== taskId));
      } else {
        alert('Failed to delete task.');
      }
    } catch (error) {
      alert('An error occurred while deleting.');
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = taskList.findIndex((i) => i.id === active.id);
    const newIndex = taskList.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(taskList, oldIndex, newIndex).map((task, idx) => ({
      ...task,
      order: idx,
    }));

    setTaskList(newOrder);
  };

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <TaskTypeButtons
        showModal={showModal}
        setTaskType={(type) => setPlannerItem({ type })}
        setShowModal={setShowModal}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={taskList.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1}>
            {taskList
              .sort((a, b) => a.order - b.order)
              .map((task, index) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  index={index}
                  onEditTask={handleEdit}
                  onDeleteTask={handleDelete}
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
        Completed: {taskList.filter((i) => i.completed).length} / {taskList.length}
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
        setTaskList={setTaskList}
        setEditTask={setEditTask}
      />
    </Paper>
  );
};

export default TimeBlockSection;
