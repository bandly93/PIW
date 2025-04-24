import { 
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Typography,
  Box,
  Tooltip
} from '@mui/material'

import { DragIndicator } from '@mui/icons-material'
import { PlannerItem } from './TimeBlockSections'

interface PlannerBlock {
  id: string
  label: string
  items: PlannerItem[]
  editing?: boolean
}

const SortableTab = ({
  block,
  index,
  isActive,
  onClick,
}: {
  block: PlannerBlock
  index: number
  isActive: boolean
  onClick: () => void
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'inline-block',
    cursor: 'pointer',
  }

  return (
    <div ref={setNodeRef} style={style} onClick={onClick}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          py: 0.5,
          mr: 1,
          borderBottom: isActive ? '2px solid #1976d2' : '2px solid transparent',
        }}
      >
        <Typography variant='body1' sx={{ mr: 1 }}>{block.label}</Typography>
        <Tooltip title="Drag">
          <span {...attributes} {...listeners} style={{ cursor: 'grab' }}>
            <DragIndicator fontSize="small" color="action" />
          </span>
        </Tooltip>
      </Box>
    </div>
  )
}

export default SortableTab