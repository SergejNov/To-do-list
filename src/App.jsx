import './App.css';
import ToDoList from './ToDoList';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/:code?" element={<ToDoList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;