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
          // if FoodLoggerForm expects the whole PlannerItem for editing, this is fine
          meal={editTask ?? null}
          onAddMeal={(newMealItem: PlannerItem) => {
            setTaskList((prev) => {
              // If we're editing an existing planner item, update that one
              if (editTask) {
                return prev.map((item) =>
                  item.id === editTask.id
                    ? {
                        ...item,
                        ...newMealItem,
                        // ensure we keep the same id/time block, if needed
                        id: editTask.id,
                        type: 'Meal',
                      }
                    : item
                );
              }

              // Otherwise, we're adding a brand new meal task
              return [
                ...prev,
                {
                  ...newMealItem,
                  type: 'Meal',
                },
              ];
            });

            handleOnClose();
          }}
        />
      ) : (
        <Stack spacing={2} p={3}>
          <TextField fullWidth label="Task Type" value={taskType} disabled />
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
