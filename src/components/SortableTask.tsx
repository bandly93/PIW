import { useState } from 'react';
import { IconButton, Stack, Typography, Box } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, Edit } from '@mui/icons-material';
import NoteIcon from '@mui/icons-material/Note';
import { PlannerItem } from './TimeBlockSections';

interface Props {
  task: PlannerItem;
  index: number;
  openEditModal: (item: PlannerItem) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: PlannerItem) => void;
}

const SortableTask = ({
  task,
  index,
  openEditModal,
  onDeleteTask,
  onEditTask,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.8 : 1,
  };

  const [showNotes, setShowNotes] = useState(false);

  const handleToggleCompleted = async () => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      await onEditTask(updatedTask); // Call onEditTask with the updated task
    } catch (error) {
      console.error('Error toggling completed status:', error);
    }
  };

  return (
    <Stack spacing={0.5}>
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
          bgcolor: task.completed ? 'action.selected' : 'background.paper',
          color: task.completed ? 'text.primary' : 'inherit',
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleCompleted} // Toggle completed status
            style={{ cursor: 'pointer' }}
          />
          <Typography
            {...attributes}
            {...listeners}
            sx={{ cursor: 'grab', flexGrow: 1 }}
          >
            {task.text} ({task.type})
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          {task.notes && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowNotes((prev) => !prev);
              }}
            >
              <NoteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </IconButton>
          )}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(task);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
          >
            <Delete />
          </IconButton>
        </Stack>
      </Stack>
      {showNotes && task.notes && (
        <Box ml="5">
          <Typography
            variant="h5"
            component="div"
            sx={{
              ml: 3, // aligns with checkbox + spacing
              mt: 0.5,
              px: 2,
              py: 1,
              bgcolor: 'background.paper',
              border: '1px solid #ddd',
              borderRadius: 1,
              fontStyle: 'italic',
              color: 'text.secondary',
              maxHeight: 300,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {task.notes}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default SortableTask;
