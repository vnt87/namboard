import { useState, useEffect } from 'react';
import { Container, AppShell, Group, Title, ActionIcon, LoadingOverlay } from '@mantine/core';
import { useStore } from '../store/useStore';
import { BoardList } from './BoardList/BoardList';
import { Board } from './Board/Board';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';

export function Layout() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { loadBoards, currentBoard } = useStore();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    loadBoards();
    setHasLoaded(true);
  }, [loadBoards]);

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  if (!hasLoaded) {
    return <LoadingOverlay visible />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Title order={3}>Nullboard</Title>
            {currentBoard && (
              <Title order={3} c="dimmed">
                / {currentBoard.title || '(Untitled Board)'}
              </Title>
            )}
          </Group>
          <ActionIcon
            variant="light"
            onClick={toggleTheme}
            size="lg"
            color={colorScheme === 'dark' ? 'yellow' : 'blue'}
          >
            {colorScheme === 'dark' ? (
              <IconSun size="1.2rem" />
            ) : (
              <IconMoon size="1.2rem" />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <BoardList />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
          {currentBoard ? (
            <Board />
          ) : (
            <Title order={2} ta="center" pt="xl" c="dimmed">
              Select or create a board to get started
            </Title>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
