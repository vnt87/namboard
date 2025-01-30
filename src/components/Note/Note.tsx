import { Paper, ActionIcon, Group, Textarea } from '@mantine/core';
import { IconTrash, IconLayoutSidebarRightCollapse, IconCode } from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { Note as NoteType } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';

interface NoteProps {
  note: NoteType;
  listId: string;
  index: number;
}

export function Note({ note, listId, index }: NoteProps) {
  const { updateNoteText, deleteNote, toggleNoteRaw, toggleNoteCollapsed } = useStore();
  const timeoutRef = useRef<number>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: note.id,
    data: { type: 'note', listId, index }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  };

  const handleTextChange = (value: string) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      updateNoteText(listId, note.id, value);
    }, 500);
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      shadow="xs"
      p="xs"
      withBorder
      bg={note.isRaw ? 'transparent' : undefined}
    >
      <Group gap="sm" mb="xs" {...attributes} {...listeners}>
        <Group gap={4} ml="auto">
          <ActionIcon
            size="sm"
            variant="light"
            onClick={() => toggleNoteRaw(listId, note.id)}
            color={note.isRaw ? 'blue' : undefined}
          >
            <IconCode size={14} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="light"
            onClick={() => toggleNoteCollapsed(listId, note.id)}
            color={note.isCollapsed ? 'blue' : undefined}
          >
            <IconLayoutSidebarRightCollapse size={14} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            color="red"
            variant="light"
            onClick={() => deleteNote(listId, note.id)}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Group>

      <Textarea
        placeholder="Note text"
        defaultValue={note.text}
        onChange={(e) => handleTextChange(e.target.value)}
        minRows={note.isCollapsed ? 1 : 2}
        maxRows={note.isCollapsed ? 1 : 10}
        styles={{
          input: {
            fontFamily: note.isRaw ? 'monospace' : undefined,
            fontWeight: note.isRaw ? 500 : undefined,
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            '&:focus': {
              border: 'none',
              outline: 'none'
            }
          }
        }}
      />
    </Paper>
  );
}
