import { MantineProvider, createTheme, MantineThemeColors } from '@mantine/core';
import { ColorSchemeScript } from '@mantine/core';
import { Layout } from './components/Layout';
import '@mantine/core/styles.css';

interface ThemeParams {
  colorScheme: 'light' | 'dark';
  colors: MantineThemeColors;
  white: string;
}

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  fontFamily: 'Bai Jamjuree, sans-serif',
  components: {
    AppShell: {
      styles: {
        main: ({ colorScheme, colors }: ThemeParams) => ({
          background: colorScheme === 'dark' 
            ? colors.dark[8] 
            : colors.gray[0]
        })
      }
    },
    Paper: {
      defaultProps: {
        withBorder: true,
        shadow: 'sm'
      },
      styles: {
        root: ({ colorScheme, colors, white }: ThemeParams) => ({
          backgroundColor: colorScheme === 'dark' 
            ? colors.dark[7] 
            : white,
          borderColor: colorScheme === 'dark'
            ? colors.dark[4]
            : colors.gray[3]
        })
      }
    },
    TextInput: {
      styles: {
        input: ({ colorScheme, colors, white }: ThemeParams) => ({
          backgroundColor: colorScheme === 'dark' 
            ? colors.dark[6] 
            : white,
          borderColor: colorScheme === 'dark'
            ? colors.dark[4]
            : colors.gray[3],
          '&:focus': {
            borderColor: colorScheme === 'dark'
              ? colors.blue[8]
              : colors.blue[5]
          }
        })
      }
    },
    Textarea: {
      styles: {
        input: ({ colorScheme, colors, white }: ThemeParams) => ({
          backgroundColor: colorScheme === 'dark' 
            ? colors.dark[6] 
            : white,
          borderColor: colorScheme === 'dark'
            ? colors.dark[4]
            : colors.gray[3],
          '&:focus': {
            borderColor: colorScheme === 'dark'
              ? colors.blue[8]
              : colors.blue[5]
          }
        })
      }
    },
    ActionIcon: {
      styles: {
        root: ({ colorScheme, colors }: ThemeParams) => ({
          '&[data-variant="light"]': {
            backgroundColor: colorScheme === 'dark'
              ? colors.dark[6]
              : colors.gray[0],
            '&:hover': {
              backgroundColor: colorScheme === 'dark'
                ? colors.dark[5]
                : colors.gray[1]
            }
          }
        })
      }
    }
  }
});

function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider 
        defaultColorScheme="auto" 
        theme={theme}
      >
        <Layout />
      </MantineProvider>
    </>
  );
}

export default App;
