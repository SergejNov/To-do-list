// Utility functions for todo list code generation and data persistence

/**
 * Generates a random 4-letter code using uppercase letters
 * @returns {string} A 4-letter code like "ABCD"
 */
export const generateCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
};

/**
 * Validates if a code is in the correct 4-letter format
 * @param {string} code - The code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidCode = (code) => {
  return /^[A-Z]{4}$/.test(code);
};

/**
 * Saves todo list data to localStorage with a specific code
 * @param {string} code - The 4-letter code
 * @param {Array} todos - The todo list array
 */
export const saveTodosToStorage = (code, todos) => {
  try {
    localStorage.setItem(`todolist_${code}`, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

/**
 * Loads todo list data from localStorage using a code
 * @param {string} code - The 4-letter code
 * @returns {Array|null} The todo list array or null if not found
 */
export const loadTodosFromStorage = (code) => {
  try {
    const stored = localStorage.getItem(`todolist_${code}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    return null;
  }
};

/**
 * Checks if a todo list exists for a given code
 * @param {string} code - The 4-letter code
 * @returns {boolean} True if exists, false otherwise
 */
export const todoListExists = (code) => {
  return localStorage.getItem(`todolist_${code}`) !== null;
};

/**
 * Gets all existing todo list codes
 * @returns {Array} Array of existing codes
 */
export const getAllCodes = () => {
  const codes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('todolist_')) {
      codes.push(key.replace('todolist_', ''));
    }
  }
  return codes;
};
