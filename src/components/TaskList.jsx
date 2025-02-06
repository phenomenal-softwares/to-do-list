import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaRedo, FaSort, FaPlus, FaEdit } from 'react-icons/fa';

const TaskList = ({
  tasks,
  toggleCompletion,
  deleteTask,
  theme,
  filter,
  addSubtask,
  toggleSubtaskCompletion,
  deleteSubtask,
  editTask,
  editSubtask,
}) => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};

      tasks.forEach((task) => {
        if (!task.time || task.completed) return;

        const taskTime = new Date();
        const [hours, minutes] = task.time.split(':').map(Number);
        taskTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const difference = taskTime - now;

        if (difference <= 0) {
          newTimeLeft[task.id] = 'Due';
        } else {
          const hh = Math.floor(difference / 3600000);
          const mm = Math.floor((difference % 3600000) / 60000);
          const ss = Math.floor((difference % 60000) / 1000);
          newTimeLeft[task.id] = `${hh.toString().padStart(2, '0')}:${mm
            .toString()
            .padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const formatTime = (time24) => {
    if (!time24) return 'N/A';
    const [hours, minutes] = time24.split(':');
    const period = +hours >= 12 ? 'pm' : 'am';
    const hours12 = +hours % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}Z`).getTime();
    const timeB = new Date(`1970-01-01T${b.time}Z`).getTime();
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return true;
  });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div>
      <div className="task-list-header">
        <h2>Today,</h2>
        <button className="sort-button" onClick={toggleSortOrder}>
          <FaSort /> Sort by Time ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="no-tasks-message">
          "What goals do you want to achieve today? You can do it!" <br /> - Your Future Self
        </p>
      ) : (
        <ul className={`task-list ${theme}`}>
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="main-task">
                <input
                  type="checkbox"
                  id="task-complete"
                  className="main-task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                  title="Toggle Goal Completion"
                />
                <span
                  className="main-task-text"
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                >
                  I will <strong>{task.task}</strong> at <strong>{formatTime(task.time)}</strong> {task.location}
                </span>
                <button className="edit-button" onClick={() => editTask(task.id)} title="Edit Goal">
                  <FaEdit />
                </button>
                <button className="delete-button" onClick={() => deleteTask(task.id)} title="Delete Goal">
                  <FaTrashAlt />
                </button>
              </div>
              <div className="subtasks">
                <ol>
                  {(task.subtasks || []).map((subtask) => (
                    <li key={subtask.id} className="subtask-item">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                        title="Toggle Sub-goal Completion"
                      />
                      <span style={{ textDecoration: subtask.completed ? 'line-through' : 'none' }}>
                        I will <strong>{subtask.task}</strong>
                      </span>
                      <button className="edit-button" onClick={() => editSubtask(task.id, subtask.id)} title="Edit Sub-goal">
                        <FaEdit />
                      </button>
                      <button className="delete-button" onClick={() => deleteSubtask(task.id, subtask.id)} title="Delete Sub-goal">
                        <FaTrashAlt />
                      </button>
                    </li>
                  ))}
                </ol>
                <button
                  className="add-subtask-button"
                  onClick={() => {
                    const subtaskName = prompt("Enter sub-goal: 'I will ...'")?.trim();
                    if (subtaskName) {
                      addSubtask(task.id, subtaskName);
                    }
                  }}
                  disabled={task.completed}
                  title={task.completed ? 'Goal accomplished!' : 'Add Sub-goal'}
                >
                  <FaPlus /> Add Sub-goal
                </button>
              </div>
              <div className="task-details">
                <div className="task-repetition">
                  <span className="repeat-icon"><FaRedo /></span>
                  <span>{task.repeatDays} {task.repeatDays === 1 ? 'day' : 'days'}</span>
                </div>
                <div>
                  <span
                    className="due-time"
                    style={{
                      color: task.completed ? 'green' : timeLeft[task.id] === 'Due' ? 'red' : 'inherit',
                      fontWeight: task.completed || timeLeft[task.id] === 'Due' ? 'bold' : 'normal',
                    }}
                  >
                    {task.completed ? 'Completed' : timeLeft[task.id] === 'Due' ? 'Due' : `Due in ${timeLeft[task.id]}`}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
