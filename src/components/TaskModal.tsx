import { Dialog, Stack, TextField, Button } from '@mui/material';
import FoodLoggerForm from './FoodLoggerForm';
import { PlannerItem } from './TimeBlockSections';

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;

  // Current planner item state (for non-meal tasks)
  text: string;
  notes: string;
  taskType: string;

  // State updater from TimeBlockSection
  setPlannerItem: (value: Partial<PlannerItem>) => void;

  // Generic save handler (non-meal)
  handleSave: () => void;

  // Editing info
  editTask?: PlannerItem | null;
  setEditTask: (task: PlannerItem | null) => void;

  // Full task list state (for updating UI)
  setTaskList: (fn: (prev: PlannerItem[]) => PlannerItem[]) => void;
}

const TaskModal = ({
  setShowModal,
  showModal,
  setPlannerItem,
  text,
  taskType,
  notes,
  handleSave,
  setTaskList,
  editTask,
  setEditTask,
}: Props) => {
  const handleOnClose = () => {
    setShowModal(false);
    // Reset the draft planner item
    setPlannerItem({ text: '', type: 'Other', notes: '' });
    setEditTask(null);
  };

  return (
    <Dialog
      open={showModal}
      onClose={handleOnClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { pb: 4 } }}
    >
      {taskType === 'Meal' ? (
        <FoodLoggerForm
          onClose={handleOnClose}
          meal={editTask ?? null}
          onAddMeal={(newMealItem: PlannerItem) => {
            // FoodLoggerForm has already handled API calls.
            // Here we only sync the UI task list.
            setTaskList((prev) => {
              const index = prev.findIndex((t) => t.id === newMealItem.id);
              if (index === -1) {
                // New meal task
                return [...prev, newMealItem];
              }
              // Updated existing meal task
              const next = [...prev];
              next[index] = { ...next[index], ...newMealItem };
              return next;
            });

            handleOnClose();
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
            onChange={(e) => setPlannerItem({ text: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            label="Optional Notes"
            value={notes}
            onChange={(e) => setPlannerItem({ notes: e.target.value })}
          />
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!text.trim()}
            sx={{ alignSelf: 'flex-end' }}
          >
            Save
          </Button>
        </Stack>
      )}
    </Dialog>
  );
};

export default TaskModal;
