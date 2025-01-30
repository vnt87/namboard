import { Group, Stack, TextInput, Button } from '@mantine/core';
import { useStore } from '../../store/useStore';
import { IconPlus } from '@tabler/icons-react';
import { List } from '../List/List';
import { useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

export function Board() {
  const { currentBoard, updateBoardTitle, addList, moveList, moveNote, setDragging } = useStore();
  const timeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!currentBoard) return null;

  const handleTitleChange = (value: string) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      updateBoardTitle(value);
    }, 500);
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDragging(false);
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.type === 'list') {
        // Handle list reordering
        const fromIndex = currentBoard.lists.findIndex(list => list.id === active.id);
        const toIndex = currentBoard.lists.findIndex(list => list.id === over.id);
        moveList(fromIndex, toIndex);
      } else if (activeData?.type === 'note') {
        // Handle note movement
        const fromListId = activeData.listId as string;
        const fromIndex = activeData.index as number;
        const toListId = overData?.listId as string || fromListId;
        const toList = currentBoard.lists.find(list => list.id === toListId);
        
        if (!toList) return;
        
        const toIndex = overData?.index as number ?? toList.notes.length;
        moveNote(fromListId, toListId, fromIndex, toIndex);
      }
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <TextInput
          size="lg"
          placeholder="Board Title"
          defaultValue={currentBoard.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          styles={{ input: { fontSize: '1.5rem', fontWeight: 600 } }}
        />
        <Button
          leftSection={<IconPlus size={16} />}
          variant="light"
          onClick={addList}
        >
          Add List
        </Button>
      </Group>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={currentBoard.lists.map(list => list.id)}
          strategy={horizontalListSortingStrategy}
        >
          <Group align="start" wrap="nowrap" style={{ overflowX: 'auto' }}>
            {currentBoard.lists.map((list) => (
              <List key={list.id} list={list} />
            ))}
          </Group>
        </SortableContext>
        <DragOverlay>
          {/* Drag overlay content will be implemented later if needed */}
        </DragOverlay>
      </DndContext>
    </Stack>
  );
}
