import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filter from './components/Filter';
import LoadingScreen from './components/LoadingScreen'; // Import the LoadingScreen component
import { FaMoon, FaSun } from 'react-icons/fa';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [theme, setTheme] = useState('light'); // Light or dark theme
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State for the loading screen

  useEffect(() => {
    // Display the loading screen for 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load tasks from localStorage
    try {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      if (Array.isArray(savedTasks)) {
        setTasks(savedTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    // Save tasks to localStorage
    if (hasLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, hasLoaded]);

  const addTask = (newTask) => setTasks([...tasks, newTask]);

  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return true;
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme; // Update body class for global theme
  };

  // Render loading screen if still loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`container ${theme}`}>
      <header className="header">
        <h1>Priorify</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </header>
      <TaskForm addTask={addTask} />
      <Filter filter={filter} setFilter={setFilter} />
      <TaskList 
        tasks={filteredTasks} 
        toggleCompletion={toggleCompletion} 
        deleteTask={deleteTask} 
        theme={theme} 
      />
    </div>
  );
};

export default App;
