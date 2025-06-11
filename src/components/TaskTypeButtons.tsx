import { Stack, Button } from '@mui/material'
import { PlannerItem } from './TimeBlockSections'

interface Props {
  setTaskType: (value: PlannerItem['type']) => void;
  setShowModal: (value: boolean) => void;
  showModal: boolean
}

const options = ['Meal', 'Work', 'Errand', 'Other']

const TaskTypeButtons = ({ setTaskType, setShowModal, showModal}: Props) => {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      {options.map((option) => (
        <Button
          key={option}
          variant='outlined'
          onClick={() => {
            setTaskType(option as PlannerItem['type'])
            setShowModal(!showModal)
          }}
        >
          +{option}
        </Button>
      ))}
    </Stack>
  )
}

export default TaskTypeButtons