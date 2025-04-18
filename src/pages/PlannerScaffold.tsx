import {
  Container,
  Typography,
  Stack,
  Paper,
  IconButton,
  Button,
  Box,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import TimeBlockSections, { PlannerItem } from '../components/TimeBlockSections'
import {
  Edit,
  Done,
  Clear,
  ContentCopy,
  Add,
} from '@mui/icons-material'

import { v4 as uuidv4 } from 'uuid'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import SortableTab from '../components/SortableTab'

interface PlannerBlock {
  id: string
  label: string
  items: PlannerItem[]
  editing?: boolean
}

const PlannerScaffold = () => {
  const [blocks, setBlocks] = useState<PlannerBlock[]>([
    { id: uuidv4(), label: '1', items: [] },
  ])
  const [activeIndex, setActiveIndex] = useState(0)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleAddBlock = () => {
    const newBlock = {
      id: uuidv4(),
      label: `${blocks.length + 1}`,
      items: [],
    }
    setBlocks((prev) => [...prev, newBlock])
    setActiveIndex(blocks.length)
  }

  const handleDuplicateBlock = (index: number) => {
    const original = blocks[index]
    const duplicated = {
      id: uuidv4(),
      label: `${original.label} (Copy)`,
      items: original.items.map((item) => ({ ...item, id: uuidv4() })),
    }
    setBlocks((prev) => [...prev, duplicated])
    setActiveIndex(blocks.length)
  }

  const handleUpdateItem = (
    index: number,
    itemIndex: number,
    newItem: PlannerItem
  ) => {
    const updated = [...blocks]
    updated[index].items[itemIndex] = newItem
    setBlocks(updated)
  }

  const handleAddItem = (index: number, newItem: PlannerItem) => {
    const updated = [...blocks]
    updated[index].items.push(newItem)
    setBlocks(updated)
  }

  const handleDeleteItem = (index: number, itemIndex: number) => {
    const updated = [...blocks]
    updated[index].items.splice(itemIndex, 1)
    setBlocks(updated)
  }

  const toggleEdit = (index: number) => {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === index ? { ...block, editing: !block.editing } : block
      )
    )
  }

  const updateBlockLabel = (index: number, newLabel: string) => {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === index ? { ...block, label: newLabel, editing: false } : block
      )
    )
  }

  const deleteBlock = (index: number) => {
    const updated = blocks.filter((_, i) => i !== index)
    setBlocks(updated)
    setActiveIndex((prev) => (prev === index ? 0 : prev > index ? prev - 1 : prev))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = [...blocks]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)
      setBlocks(reordered)
      setActiveIndex(newIndex)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Daily Planner Tabs
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box
          sx={{
            maxWidth: '85%',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            pr: 1,
          }}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <Box sx={{ display: 'inline-flex' }}>
                {blocks.map((block, index) => (
                  <SortableTab
                    key={block.id}
                    block={block}
                    index={index}
                    isActive={activeIndex === index}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        </Box>
        <Button onClick={handleAddBlock} startIcon={<Add />} variant="outlined">
          Add Block
        </Button>
      </Stack>
      {blocks.map((block, index) => (
        <Box key={block.id} hidden={index !== activeIndex}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              {block.editing ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    defaultValue={block.label}
                    onBlur={(e) => updateBlockLabel(index, e.target.value.trim())}
                    autoFocus
                  />
                  <IconButton onClick={() => toggleEdit(index)}>
                    <Done />
                  </IconButton>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">{block.label}</Typography>
                  <IconButton onClick={() => toggleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Stack>
              )}
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => handleDuplicateBlock(index)}>
                  <ContentCopy fontSize="small" />
                </IconButton>
                <IconButton onClick={() => deleteBlock(index)}>
                  <Clear fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
            <TimeBlockSections
              label=""
              items={block.items}
              onAdd={(item) => handleAddItem(index, item)}
              onUpdate={(i, item) => handleUpdateItem(index, i, item)}
              onDelete={(i) => handleDeleteItem(index, i)}
            />
          </Paper>
        </Box>
      ))}
    </Container>
  )
}

export default PlannerScaffold
