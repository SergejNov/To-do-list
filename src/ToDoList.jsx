import { useState, useEffect, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './ToDo.css';
import QrCodeIcon from '@mui/icons-material/QrCode';
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
    

    const { code: codeFromUrl } = useParams();
    const navigate = useNavigate();

    // Get code from URL or generate new one
    useEffect(() => {
        // If there's a code in the URL, validate and handle it
        if (codeFromUrl) {
            // Convert to uppercase and validate
            const upperCode = codeFromUrl.toUpperCase();
            
            // If the code is valid and different from what's in the URL (e.g., lowercase), redirect
            if (isValidCode(upperCode)) {
                if (upperCode !== codeFromUrl) {
                    navigate(`/${upperCode}`, { replace: true });
                    return;
                }
                
                // Load existing todo list
                const existingTodos = loadTodosFromStorage(upperCode);
                if (existingTodos) {
                    setTodos(existingTodos);
                    setCurrentCode(upperCode);
                    return;
                }
            }
            
            // If we get here, the code is invalid or doesn't exist
            const newCode = generateCode();
            navigate(`/${newCode}`, { replace: true });
            setCurrentCode(newCode);
            setTodos([]);
        } else {
            // No code in URL, generate new one and redirect
            const newCode = generateCode();
            navigate(`/${newCode}`, { replace: true });
            setCurrentCode(newCode);
            setTodos([]);
        }
    }, [codeFromUrl, navigate]);

    // Save todos whenever they change
    useEffect(() => {
        if (currentCode && todos.length >= 0) {
            saveTodosToStorage(currentCode, todos);
        }
    }, [todos, currentCode]);

    const updateUrl = (code) => {
        navigate(`/${code}`, { replace: true });
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

    // const handleJoinList = () => {
    //     if (inputCode && isValidCode(inputCode.toUpperCase())) {
    //         const code = inputCode.toUpperCase();
    //         const existingTodos = loadTodosFromStorage(code);
            
    //         if (existingTodos) {
    //             setTodos(existingTodos);
    //             setCurrentCode(code);
    //             updateUrl(code);
    //             setInputCode("");
    //             setShowCodeInput(false);
    //         } else {
    //             showDialog("Not Found", "No todo list found with that code!");
    //         }
    //     } else {
    //         showDialog("Invalid Code", "Please enter a valid 4-letter code!");
    //     }
    // };

    const createNewList = () => {
        const newCode = generateCode();
        setCurrentCode(newCode);
        setTodos([]);
        updateUrl(newCode);
        setShowCodeInput(false);
    };

    const copyShareLink = () => {
        const shareUrl = `${window.location.origin}/${currentCode}`;
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
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
              <Box 
                component="span" 
                sx={{ 
                  ml: 2, 
                  display: 'inline-flex',
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
                title="Scan to open on another device"
               >
                <QRCodeSVG 
                  value={window.location.href} 
                  size={40}
                  level="H"
                  fgColor="#ffffff"
                  bgColor="transparent"
                  
                />
              </Box>
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{
                maxWidth: '520px',
                mx: 'auto',
                lineHeight: 1.6,
                opacity: 0.9
              }}
            >
              Add your tasks to this list and share the link with others to collaborate in real-time!
            </Typography>
            
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center', 
                gap: 2, 
                flexWrap: 'wrap',
                '& > *': {
                  width: { xs: '100%', sm: 'auto' },
                  '& button': {
                    width: { xs: '100%', sm: 'auto' },
                  }
                }
              }}>
                <Chip 
                  label={`Code: ${currentCode}`} 
                  color="primary" 
                  variant="outlined"
                  onClick={copyShareLink}
                  sx={{ fontSize: '1.2rem', p: 1,
                    width: { xs: 'auto', sm: 'auto' },
                    minWidth: { xs: '160px', sm: '140px' },

                   }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<CopyIcon />}
                  onClick={copyShareLink}
                  sx={{ 
                    textTransform: 'none',
                    width: { xs: 'auto', sm: 'auto' },
                    minWidth: { xs: '160px', sm: '140px' },
                    px: 3,
                    py: 1,
                    height: '40px',
                    alignSelf: { xs: 'center', sm: 'center' }
                  }}
                >
                  Copy Link
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<RefreshIcon />}
                  onClick={createNewList}
                  sx={{ 
                    textTransform: 'none',
                    width: { xs: 'auto', sm: 'auto' },
                    minWidth: { xs: '160px', sm: '140px' },
                    px: 3,
                    py: 1,
                    height: '40px',
                    alignSelf: { xs: 'center', sm: 'center' }
                  }}
                >
                  New List
                </Button>
              </Box>
      
              {/* {showCodeInput && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Enter code"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    inputProps={{ maxLength: 4, style: { textTransform: 'uppercase' } }}
                    sx={{ 
                      textTransform: 'none',
                      width: { xs: 'auto', sm: 'auto' },
                      minWidth: { xs: '160px', sm: '140px' },
                      px: 3,
                      py: 1,
                      height: '40px',
                      alignSelf: { xs: 'center', sm: 'center' }
                    }}
                  />
                 [ <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleJoinList}
                    sx={{ 
                      textTransform: 'none',
                      width: { xs: 'auto', sm: 'auto' },
                      minWidth: { xs: '160px', sm: '140px' },
                      px: 3,
                      py: 1,
                      height: '40px',
                      alignSelf: { xs: 'center', sm: 'center' }
                    }}
                  >
                    Join
                  </Button>]
                </Box>
              )} */}
            </Box>
          </Paper>
      
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2, 
              mb: 2,
              alignItems: 'center',
              justifyContent: 'center',
              '& > *': {
                width: { xs: 'auto', sm: 'auto' },
                flexShrink: 0
              }
            }}>
              <TextField
                size="small"
                label="Add a new task"
                value={newTodo}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                sx={{ 
                  width: { xs: '100%', sm: 300 },
                  '& .MuiOutlinedInput-root': {
                    height: '40px'
                  }
                }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={addTask}
                sx={{ 
                  textTransform: 'none',
                  minWidth: '140px',
                  height: '40px',
                  px: 3,
                  py: 1,
                  whiteSpace: 'nowrap'
                }}
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