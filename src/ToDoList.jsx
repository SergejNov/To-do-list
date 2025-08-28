import { useState } from 'react';
import './ToDo.css';

export default function ToDoList(){
    const [todos, setTodos] = useState([
  { id: 1, text: "Task 1", completed: true },
  { id: 2, text: "Task 2", completed: false },
])

 const [newTodo, setnewTodo] = useState("");


 const handleInputChange = (e)=>{
    setnewTodo(e.target.value);
}

 const addTask = ()=> {
    if(newTodo.trim() !== ''){
        setTodos([...todos, 
        {id: Date.now(), text: newTodo, completed: false}
        ])
        setnewTodo('');

    }
 }

const toggleComplete = (id)=>{
    setTodos(todos.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed}: todo
    ))
}

  const handleDelete = (id)=>{
    setTodos(todos.filter(todo => todo.id !== id))

  }

    return (<>
    <div className='main-container'>
    <div className="todo-container">
        <h1>To-do List!</h1>
        <ul>
            {
            todos.map((item, id)=>{
               return <li key={id} className={`task-li ${item.completed && 'completed-task'}`} > <span onClick={()=> toggleComplete(item.id)} className='task-text'>{item.text}</span>
               <button className='delete-button' onClick={()=>handleDelete(item.id)}>Delete</button>
               </li>     
            })
            }
        </ul>
    </div>
    <div className='input-container'>
        <h2>Add tasks to the To-do List.</h2>
        <input className='input-field' type="text" placeholder="Feed the chickens" value={newTodo} onChange={handleInputChange} />
        <button className='add-button' onClick={addTask}>Add task</button>
    </div>
    </div>
    </>);
}