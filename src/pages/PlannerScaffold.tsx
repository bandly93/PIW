import {
  Container,
  Typography,
  Stack,
  Paper,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import TimeBlockSections, { PlannerItem } from '../components/TimeBlockSections';
import { useState } from 'react';
import { Edit, Done, Clear, ContentCopy } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

interface PlannerBlock {
  id: string;
  label: string;
  items: PlannerItem[];
  editing?: boolean;
}

const PlannerScaffold = () => {
  const [blocks, setBlocks] = useState<PlannerBlock[]>([
    { id: 'unlabeled', label: 'Unlabeled', items: [] },
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

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  const duplicateBlock = (blockId: string) => {
    const original = blocks.find((b) => b.id === blockId);
    if (!original) return;
  
    const copiedItems = original.items.map((item) => ({
      ...item,
      id: uuidv4(),
    }));
  
    const copy: PlannerBlock = {
      id: uuidv4(),
      label: `${original.label} (Copy)`,
      items: copiedItems,
      editing: false,
    };
  
    setBlocks((prev) => [...prev, copy]);
  };
  
  
  const addNewBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: uuidv4(),
        label: 'Unlabeled (new)',
        items: [],
        editing: true,
      },
    ]);
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center">
        Planner Scaffold
      </Typography>
      <Stack alignItems="end">
        <Button variant="outlined" onClick={addNewBlock}>
          ➕ Add New Block
        </Button>
      </Stack>

      <Paper>
        <Stack spacing={4} sx={{ p: 3, borderRadius: 2, borderColor: 'black' }}>
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
                        <Done />
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
                <Stack direction="row">
                  <IconButton onClick={() => duplicateBlock(block.id)}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => deleteBlock(block.id)}>
                    <Clear fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <TimeBlockSections
                label=""
                items={block.items}
                onAdd={(item) => addItem(block.id, item)}
                onUpdate={(idx, item) => updateItem(block.id, idx, item)}
                onDelete={(idx) => deleteItem(block.id, idx)}
              />
            </div>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default PlannerScaffold;
