import { Dialog, Stack, TextField, Button } from '@mui/material'
import FoodLoggerForm from './FoodLoggerForm';
import { PlannerItem } from './TimeBlockSections';

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  text: string;
  setPlannerItem: (value: Object) => void;
  notes: string;
  taskType: string;
  handleSave: () => void;
  editTask?: PlannerItem | null;
  setTaskList: any;
  onEditTask: (task: PlannerItem) => void;
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
  onEditTask
}: Props) => {

  const handleOnClose = () => {
    setShowModal(false);
    setPlannerItem({ text: '', type: 'Other', notes: '' });
  }

  return (
    <Dialog
      open={showModal}
      onClose={() => handleOnClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { pb: 4 } }}
    >
      {taskType === 'Meal' ? (
        <FoodLoggerForm
          onClose={() => handleOnClose()}
          onAddMeal={(newMealItem: PlannerItem) => {
            setTaskList((prev: PlannerItem[]) => [...prev, newMealItem]);
            handleOnClose()
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
