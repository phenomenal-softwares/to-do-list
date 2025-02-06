import React from 'react';
import TaskList from './TaskList';
import Filter from './Filter';

const TasksPage = ({
  tasks,
  toggleCompletion,
  deleteTask,
  addSubtask,
  toggleSubtaskCompletion,
  deleteSubtask,
  editTask,
  editSubtask,
  filter,
  setFilter,
  completedCount,
  pendingCount,
  theme,
  toggleTheme,
}) => {
  return (
    <div>
      <div className="filter-container">
        <Filter filter={filter} setFilter={setFilter} completedCount={completedCount} pendingCount={pendingCount} />
      </div>
      <TaskList 
        tasks={tasks} 
        toggleCompletion={toggleCompletion} 
        deleteTask={deleteTask}
        addSubtask={addSubtask}
        toggleSubtaskCompletion={toggleSubtaskCompletion}
        deleteSubtask={deleteSubtask}
        editTask={editTask}
        editSubtask={editSubtask}
        theme={theme} 
      />
    </div>
  );
};

export default TasksPage;
