import { IconButton, Stack, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, Edit } from '@mui/icons-material';
import { PlannerItem } from './TimeBlockSections';

interface Props {
  item: PlannerItem;
  index: number;
  onUpdate: (index: number, item: PlannerItem) => void;
  onDelete: (index: number) => void;
  openEditModal: (item: PlannerItem) => void;
}

const SortableTask = ({
  item,
  index,
  onUpdate,
  onDelete,
  openEditModal,
}: Props) => {
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
        bgcolor: item.completed ? 'action.selected' : 'background.paper',
        color: item.completed ? 'text.primary' : 'inherit',
        textDecoration: item.completed ? 'line-through' : 'none',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onUpdate(index, { ...item, completed: !item.completed })}
          style={{ cursor: 'pointer' }}
        />
        <Typography
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', flexGrow: 1 }}
        >
          {item.text} ({item.type})
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(item);
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
    </Stack>
  );
};

export default SortableTask;
