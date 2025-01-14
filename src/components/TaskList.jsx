import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const TaskList = ({ tasks, toggleCompletion, deleteTask, theme }) => {
  return (
    <ul className={`task-list ${theme}`}>
      {tasks.map((task, index) => (
        <li key={index} className="task-item">
          <div>
            <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleCompletion(index)}
            />
          </div>
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <strong>{task.task}</strong>
            <br />
            - {task.category} {task.deadline && `(Due: ${task.deadline})`}
          </span>
          <button
            className="delete-button"
            onClick={() => deleteTask(index)}
            title="Delete Task"
          >
            <FaTrashAlt />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
