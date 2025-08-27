import { useState } from 'react'
import './ToDo.css'

export default function ToDoList(){
    const [toDo, setToDo] = useState()


    return (<>
    <div className='main-container'>
    <div className="todo-container">
        <h1>To Do List!</h1>
        <ul>
            <li>thing1</li>
            <li>thing2</li>
        </ul>
    </div>
    <div className='input-container'>
        <h2>Add items to the To Do List.</h2>
        <input type="text" placeholder="Feed the chickens" />
    </div>
    </div>
    </>)
}