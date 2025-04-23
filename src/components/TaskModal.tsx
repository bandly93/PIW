import { Dialog, Stack, TextField, Button } from '@mui/material'
import FoodLoggerForm from './FoodLoggerForm';
import { PlannerItem } from './TimeBlockSections';

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setTaskType: (value: PlannerItem['type']) => void;
  onAdd: (value: PlannerItem) => void;
  setText: (value: string) => void;
  setNotes: (value: string) => void;
  notes: string;
  taskType: string;
  handleAdd: () => void;
}

const TaskModal = ({
  setShowModal,
  setTaskType,
  showModal,
  onAdd,
  setText,
  taskType,
  notes,
  setNotes,
  handleAdd
}: Props) => {
  return (
    <Dialog
      open={showModal}
      onClose={() => {
        setShowModal(false);
        setTaskType('Other'); // ✅ Reset type on close
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { pb: 4 } }} // ✅ fix bottom padding
    >
      {taskType === 'Meal' ? (
        <FoodLoggerForm
          onClose={() => {
            setShowModal(false);
            setTaskType('Other');
          }}
          onAddMeal={(details: string) => {
            const newItem: PlannerItem = {
              id: Date.now().toString(),
              text: details,
              type: 'Meal',
              completed: false,
              notes: ''
            };
            onAdd(newItem);
            setShowModal(false);
            setTaskType('Other');
          }}
        />
      ) : (
        <Stack spacing={2} p={3}>
          <TextField
            fullWidth
            label="Task"
            value={taskType}
            onChange={(e) => setText(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            label="Optional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add
          </Button>
        </Stack>
      )}
    </Dialog>
  )
}

export default TaskModal
