import { useState, useEffect, forwardRef } from 'react';
import './ToDo.css';
import { 
  generateCode, 
  isValidCode, 
  saveTodosToStorage, 
  loadTodosFromStorage, 
  todoListExists 
} from './utils';

import {
    Container,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Box,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Slide,
    Divider,
    Snackbar,
    Alert
  } from '@mui/material';

  import {
    Delete as DeleteIcon,
    ContentCopy as CopyIcon,
    Add as AddIcon,
    Check as CheckIcon,
    Refresh as RefreshIcon,
    Link as LinkIcon
  } from '@mui/icons-material';

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });



export default function ToDoList(){
    const [todos, setTodos] = useState([]);
    const [newTodo, setnewTodo] = useState("");
    const [currentCode, setCurrentCode] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    // Get code from URL or generate new one
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const codeFromUrl = urlParams.get('code');
        
        if (codeFromUrl && isValidCode(codeFromUrl)) {
            // Load existing todo list
            const existingTodos = loadTodosFromStorage(codeFromUrl);
            if (existingTodos) {
                setTodos(existingTodos);
                setCurrentCode(codeFromUrl);
            } else {
                // Code doesn't exist, create new list
                const newCode = generateCode();
                setCurrentCode(newCode);
                setTodos([]);
                updateUrl(newCode);
            }
        } else {
            // Generate new code
            const newCode = generateCode();
            setCurrentCode(newCode);
            setTodos([]);
            updateUrl(newCode);
        }
    }, []);

    // Save todos whenever they change
    useEffect(() => {
        if (currentCode && todos.length >= 0) {
            saveTodosToStorage(currentCode, todos);
        }
    }, [todos, currentCode]);

    const updateUrl = (code) => {
        const newUrl = `${window.location.pathname}?code=${code}`;
        window.history.pushState({}, '', newUrl);
    };

    const handleInputChange = (e) => {
        setnewTodo(e.target.value);
    };

    const addTask = () => {
        if(newTodo.trim() !== ''){
            setTodos([...todos, 
                {id: Date.now(), text: newTodo, completed: false}
            ]);
            setnewTodo('');
        }
    };

    const toggleComplete = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? {...todo, completed: !todo.completed}: todo
        ));
    };

    const handleDelete = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const showDialog = (title, message) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setOpenDialog(true);
      };
      
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };

    const handleJoinList = () => {
        if (inputCode && isValidCode(inputCode.toUpperCase())) {
            const code = inputCode.toUpperCase();
            const existingTodos = loadTodosFromStorage(code);
            
            if (existingTodos) {
                setTodos(existingTodos);
                setCurrentCode(code);
                updateUrl(code);
                setInputCode("");
                setShowCodeInput(false);
            } else {
                showDialog("Not Found", "No todo list found with that code!");
            }
        } else {
            showDialog("Invalid Code", "Please enter a valid 4-letter code!");
        }
    };

    const createNewList = () => {
        const newCode = generateCode();
        setCurrentCode(newCode);
        setTodos([]);
        updateUrl(newCode);
        setShowCodeInput(false);
    };

    const copyShareLink = () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?code=${currentCode}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setToast({
                open: true,
                message: 'Share link copied to clipboard!',
                severity: 'success'
            });
        }).catch(() => {
            setToast({
                open: true,
                message: 'Failed to copy link. Please try again.',
                severity: 'error'
            });
        });
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToast(prev => ({ ...prev, open: false }));
    }
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Snackbar
            open={toast.open}
            autoHideDuration={3000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseToast} 
              severity={toast.severity} 
              sx={{ width: '100%' }}
              elevation={6}
              variant="filled"
            >
              {toast.message}
            </Alert>
          </Snackbar>

          <Box 
            textAlign="center" 
            mb={4}
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              p: 3,
              borderRadius: 1,
              boxShadow: 3
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 2
              }}
            >
              To-Do List
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                opacity: 0.9
              }}
            >
              Add your tasks to this shared list. Share the link with others to collaborate in real-time!
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Code: ${currentCode}`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '1.2rem', p: 1 }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<CopyIcon />}
                  onClick={copyShareLink}
                  sx={{ textTransform: 'none' }}
                >
                  Copy Link
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<RefreshIcon />}
                  onClick={createNewList}
                  sx={{ textTransform: 'none' }}
                >
                  New List
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<LinkIcon />}
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  sx={{ textTransform: 'none' }}
                >
                  Join List
                </Button>
              </Box>
      
              {showCodeInput && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Enter code"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    inputProps={{ maxLength: 4, style: { textTransform: 'uppercase' } }}
                    sx={{ flexGrow: 1, maxWidth: 200 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleJoinList}
                    sx={{ textTransform: 'none' }}
                  >
                    Join
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
      
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                size="small"
                label="Add a new task"
                value={newTodo}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                sx={{ flexGrow: 1, maxWidth: 500 }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={addTask}
                sx={{ textTransform: 'none' }}
              >
                Add Task
              </Button>
            </Box>
      
            <Divider sx={{ my: 2 }} />
      
            {todos.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No tasks yet. Add one above!
              </Typography>
            ) : (
              <List>
                {todos.map((item) => (
                  <ListItem
                    key={item.id}
                    divider
                    sx={{
                      backgroundColor: item.completed ? 'action.hover' : 'background.paper',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        sx: {
                          textDecoration: item.completed ? 'line-through' : 'none',
                          color: item.completed ? 'text.secondary' : 'text.primary',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          maxWidth: '100%',
                        }
                      }}
                      onClick={() => toggleComplete(item.id)}
                      sx={{ 
                        cursor: 'pointer',
                        width: '100%',
                        '& .MuiListItemText-primary': {
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
          <Dialog
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">
              {dialogTitle}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {dialogMessage}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
    );
}