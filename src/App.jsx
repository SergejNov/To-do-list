import './App.css';
import ToDoList from './ToDoList';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToDoList />
    </ThemeProvider>
  );
}

export default App;