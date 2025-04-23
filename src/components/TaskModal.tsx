import { Dialog, Stack, TextField, Button } from '@mui/material'
import FoodLoggerForm from './FoodLoggerForm';
import { PlannerItem } from './TimeBlockSections';

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onAdd: (value: PlannerItem) => void;
  text: string;
  setText: (value: string) => void;
  setNotes: (value: string) => void;
  notes: string;
  taskType: string;
  handleAdd: () => void;
}

const TaskModal = ({
  setShowModal,
  showModal,
  onAdd,
  setText,
  text,
  taskType,
  notes,
  setNotes,
  handleAdd
}: Props) => {
  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { pb: 4 } }} // ✅ fix bottom padding
    >
      {taskType === 'Meal' ? (
        <FoodLoggerForm
          onClose={() => {
            setShowModal(false);
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
          }}
        />
      ) : (
        <Stack spacing={2} p={3}>
          <TextField
            fullWidth
            label="Task Type"
            value={taskType}
            disabled
          />
          <TextField
            fullWidth
            label="Task Name"
            value={text}
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
            sx={{ alignSelf: 'flex-end' }}
          >
            Save
          </Button>
        </Stack>
      )}
    </Dialog>
  )
}

export default TaskModal
