import {
  Container,
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import TimeBlockSections, { PlannerItem } from '../components/TimeBlockSections';
import { useState } from 'react';
import { Edit, Save, Delete } from '@mui/icons-material';

interface PlannerBlock {
  id: string;
  label: string;
  items: PlannerItem[];
  editing?: boolean;
}

const PlannerScaffold = () => {
  const [blocks, setBlocks] = useState<PlannerBlock[]>([
    { id: 'test', label: 'Test Block', items: [] },
  ]);

  const updateItem = (blockId: string, index: number, newItem: PlannerItem) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
            ...block,
            items: block.items.map((item, i) =>
              i === index ? newItem : item
            ),
          }
          : block
      )
    );
  };

  const deleteItem = (blockId: string, index: number) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
            ...block,
            items: block.items.filter((_, i) => i !== index),
          }
          : block
      )
    );
  };

  const addItem = (blockId: string, item: PlannerItem) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, items: [...block.items, item] }
          : block
      )
    );
  };

  const toggleEditBlockLabel = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, editing: !block.editing } : block
      )
    );
  };

  const updateBlockLabel = (blockId: string, label: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, label, editing: false } : block
      )
    );
  };

  const addNewBlock = () => {
    const newId = Date.now().toString();
    setBlocks((prev) => [
      ...prev,
      { id: newId, label: 'New Block', items: [], editing: true },
    ]);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Planner Scaffold
      </Typography>

      <Stack spacing={4}>
        {blocks.map((block) => (
          <div key={block.id}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1} justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                {block.editing ? (
                  <>
                    <TextField
                      size="small"
                      defaultValue={block.label}
                      onBlur={(e) => updateBlockLabel(block.id, e.target.value.trim())}
                      autoFocus
                    />
                    <IconButton onClick={() => toggleEditBlockLabel(block.id)}>
                      <Save />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">{block.label}</Typography>
                    <IconButton onClick={() => toggleEditBlockLabel(block.id)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Stack>
            </Stack>
            <TimeBlockSections
              label=""
              icon=""
              items={block.items}
              onAdd={(item) => addItem(block.id, item)}
              onUpdate={(idx, item) => updateItem(block.id, idx, item)}
              onDelete={(idx) => deleteItem(block.id, idx)}
            />
          </div>
        ))}
        <Button variant="outlined" onClick={addNewBlock}>
          ➕ Add New Block
        </Button>
      </Stack>
    </Container>
  );
};

export default PlannerScaffold;
