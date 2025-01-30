import { Paper, Stack, TextInput, Button, ActionIcon, Group } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { List as ListType } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note } from '../Note/Note';
import { useRef, useState, useEffect } from 'react';

interface ListProps {
  list: ListType;
}

export function List({ list }: ListProps) {
  const { updateListTitle, deleteList, addNote } = useStore();
  const timeoutRef = useRef<number>();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: list.id,
    data: { type: 'list' }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  };

  useEffect(() => {
    // If this is a new list (empty title), start in editing mode
    if (!list.title) {
      setIsEditing(true);
    }
  }, [list.title]);

  useEffect(() => {
    // Focus input when entering edit mode
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleChange = (value: string) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      updateListTitle(list.id, value);
    }, 500);
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      shadow="xs"
      p="md"
      w={300}
      h="fit-content"
      withBorder
    >
      <Stack gap="sm">
        <Group gap="sm" {...attributes} {...listeners}>
          {isEditing ? (
            <TextInput
              ref={inputRef}
              placeholder="List Title"
              defaultValue={list.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{ flex: 1 }}
            />
          ) : (
            <TextInput
              placeholder="List Title"
              value={list.title}
              onClick={handleTitleClick}
              readOnly
              style={{ flex: 1, cursor: 'pointer' }}
            />
          )}
          <ActionIcon 
            color="red" 
            variant="light"
            onClick={() => deleteList(list.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>

        <Stack gap="xs">
          {list.notes.map((note, index) => (
            <Note 
              key={note.id}
              note={note}
              listId={list.id}
              index={index}
            />
          ))}
        </Stack>

        <Button
          leftSection={<IconPlus size={16} />}
          variant="light"
          onClick={() => addNote(list.id)}
        >
          Add Note
        </Button>
      </Stack>
    </Paper>
  );
}
