import { useState } from 'react';
import './ToDo.css';

export default function ToDoList(){
    const [todos, setTodos] = useState([
  { id: 1, text: "Task 1", completed: true },
  { id: 2, text: "Task 2", completed: false }
]);

 const [newTodos, setnewTodos] = useState("");


 const handleInputChange = (e)=>{
    setnewTodos(e.target.value);
}

    return (<>
    <div className='main-container'>
    <div className="todo-container">
        <h1>To-do List!</h1>
        <ul>
            {
            todos.map((item, id)=>{
               return <li key={id}>{item.text}</li>     
            })
            }
        </ul>
    </div>
    <div className='input-container'>
        <h2>Add tasks to the To-do List.</h2>
        <input type="text" placeholder="Feed the chickens" onChange={handleInputChange} />
        <button>Add task</button>
    </div>
    </div>
    </>);
}