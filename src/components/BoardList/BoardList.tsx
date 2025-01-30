import { useStore } from '../../store/useStore';
import { Stack, Text, Button, ThemeIcon, UnstyledButton, Group } from '@mantine/core';
import { IconPlus, IconLayoutBoard } from '@tabler/icons-react';

export function BoardList() {
  const { boardList, currentBoard, createBoard, loadBoard, deleteCurrentBoard } = useStore();

  return (
    <Stack gap="xs">
      <Button 
        leftSection={<IconPlus size={16} />}
        variant="light"
        onClick={createBoard}
      >
        Add New Board
      </Button>

      {boardList.length === 0 ? (
        <Text c="dimmed" ta="center" fz="sm" py="xl">
          No boards yet. Create your first one!
        </Text>
      ) : (
        <Stack gap="xs">
          {boardList.map((board) => (
            <UnstyledButton
              key={board.id}
              onClick={() => loadBoard(board.id)}
              p="xs"
              style={{
                backgroundColor: currentBoard?.id === board.id ? 'var(--mantine-color-blue-light)' : undefined,
                borderRadius: 'var(--mantine-radius-sm)'
              }}
            >
              <Group gap="sm">
                <ThemeIcon 
                  variant={currentBoard?.id === board.id ? "filled" : "light"}
                  size="sm"
                >
                  <IconLayoutBoard size={14} />
                </ThemeIcon>
                <Text size="sm" fw={500}>
                  {board.title || '(Untitled Board)'}
                </Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      )}

      {currentBoard && (
        <Button 
          color="red" 
          variant="light"
          onClick={() => {
            if (confirm('Are you sure you want to delete this board?')) {
              deleteCurrentBoard();
            }
          }}
        >
          Delete Current Board
        </Button>
      )}
    </Stack>
  );
}
