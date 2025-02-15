import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskForm from './components/TaskForm';
import Stats from "./components/Stats";
import Achievements from "./components/Achievements";
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { FaMoon, FaSun } from 'react-icons/fa';
import TasksPage from './components/TasksPage';
import Alert from './components/Alert';
import BottomNav from './components/BottomNav';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('Pending');
  const [theme, setTheme] = useState('light');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", show: false });
  const [activeTab, setActiveTab] = useState("goals");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      if (Array.isArray(savedTasks)) {
        console.log("Loaded tasks from localStorage:", savedTasks);
        setTasks(savedTasks);
      } else {
        console.warn("Invalid tasks format in localStorage, resetting to empty array.");
        setTasks([]);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      setTasks([]);
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      try {
        console.log("Saving tasks to localStorage:", tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
    }
  }, [tasks, hasLoaded]);

  useEffect(() => {
    if (!hasLoaded) return; // Prevent running before tasks are fully loaded
      
    const checkTaskStatus = () => {
      const now = new Date();
      console.log("Running task status check at:", now);
    
      // Calculate daily stats
      const totalGoalsSet = tasks.length;
      const totalGoalsAchieved = tasks.filter((task) => task.completed).length;

      // Check if "Perfect Day" is already unlocked
      const perfectDayUnlocked = localStorage.getItem("perfectDay") === "true";

     // If condition is met and it hasn't been unlocked before, unlock it
      if (!perfectDayUnlocked && totalGoalsSet > 0 && totalGoalsSet === totalGoalsAchieved) {
        localStorage.setItem("perfectDay", "true");
      }
    
      // Retrieve existing stats from localStorage
      const existingTotalGoalsSet = parseInt(localStorage.getItem("totalGoalsSet")) || 0;
      const existingTotalGoalsAchieved = parseInt(localStorage.getItem("totalGoalsAchieved")) || 0;
      const existingCurrentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
      const existingHighestStreak = parseInt(localStorage.getItem("highestStreak")) || 0;
      const existingMostGoalsAchieved = parseInt(localStorage.getItem("mostGoalsAchieved")) || 0;
    
      // Update total stats
      const updatedTotalGoalsSet = existingTotalGoalsSet + totalGoalsSet;
      const updatedTotalGoalsAchieved = existingTotalGoalsAchieved + totalGoalsAchieved;
    
      // Update streaks
      let updatedCurrentStreak = existingCurrentStreak;
      let updatedHighestStreak = existingHighestStreak;
    
      if (totalGoalsAchieved > 0) {
        updatedCurrentStreak += 1; // Increase streak if goals were achieved
        if (updatedCurrentStreak > updatedHighestStreak) {
          updatedHighestStreak = updatedCurrentStreak; // Update highest streak if current streak exceeds it
        }
      } else {
        updatedCurrentStreak = 0; // Reset streak if no goals were achieved
      }
    
      // Update most goals achieved in a day
      const updatedMostGoalsAchieved = Math.max(existingMostGoalsAchieved, totalGoalsAchieved);
    
      // Save updated stats to localStorage
      localStorage.setItem("totalGoalsSet", updatedTotalGoalsSet);
      localStorage.setItem("totalGoalsAchieved", updatedTotalGoalsAchieved);
      localStorage.setItem("currentStreak", updatedCurrentStreak);
      localStorage.setItem("highestStreak", updatedHighestStreak);
      localStorage.setItem("mostGoalsAchieved", updatedMostGoalsAchieved);
    
      // Update weekly stats in localStorage
      const day = now.toLocaleString('en-US', { weekday: 'narrow' }); // e.g., "Mon"
      const dateKey = now.toISOString().split('T')[0]; // e.g., "2023-10-15"
    
      // Retrieve existing weekly stats from localStorage
      const weeklyStats = JSON.parse(localStorage.getItem("weeklyStats")) || [];
    
      // Generate the last 7 days (including today)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (6 - i)); // Previous 6 days + today
        return {
          day: date.toLocaleString('en-US', { weekday: 'narrow' }), // e.g., "Mon"
          date: date.toISOString().split('T')[0], // e.g., "2023-10-15"
          goalsAchieved: 0, // Default value
        };
      });
    
      // Merge existing stats with the last 7 days
      last7Days.forEach((dayData) => {
        const existingDayData = weeklyStats.find((stat) => stat.date === dayData.date);
        if (existingDayData) {
          dayData.goalsAchieved = existingDayData.goalsAchieved; // Use existing data if available
        }
      });
    
      // Add/update today's stats
      const todayStatsIndex = last7Days.findIndex((stat) => stat.date === dateKey);
      if (todayStatsIndex !== -1) {
        last7Days[todayStatsIndex].goalsAchieved = totalGoalsAchieved;
      }
    
      // Save updated weekly stats to localStorage
      localStorage.setItem("weeklyStats", JSON.stringify(last7Days));
    
      // Update tasks (your existing logic)
      const updatedTasks = tasks
        .map((task) => {
          console.log("Processing task:", task);
          console.log("Repeat Days before update:", task.repeatDays);
    
          // If repeatDays is 1, the task is removed
          if (task.repeatDays === 1) {
            console.log("Removing task with repeatDays=1:", task);
            return null;
          }
    
          // Reduce repeatDays by 1 for tasks with repeatDays > 1
          console.log("Reducing repeatDays by 1:", task);
          return { ...task, repeatDays: task.repeatDays - 1, completed: false };
        })
        .filter(Boolean);
    
      if (JSON.stringify(tasks) !== JSON.stringify(updatedTasks)) {
        console.log("Updating tasks after cleanup:", updatedTasks);
        setTasks(updatedTasks);
      } else {
        console.log("No task updates required.");
      }
    };
    
    const getNextTestTime = () => {
      const now = new Date();
      const storedTestTime = localStorage.getItem('nextTestTime');
      const testTime = storedTestTime ? new Date(storedTestTime) : null;

      // Run logic if no testTime or if the current time is past the testTime
      if (!testTime || now > testTime) {
        console.log(
          "Missed or uninitialized test time. Running logic now.",
          "Stored testTime:",
          testTime,
          "Current time:",
          now
        );
        checkTaskStatus();
    
        // Schedule next test time at midnight
        const nextMidnight = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0,
          0,
          0
        );
        localStorage.setItem('nextTestTime', nextMidnight.toISOString());
        console.log("Next test time set for:", nextMidnight);
    
        return nextMidnight;
      }
    
      console.log("Test time is valid and hasn't been reached yet:", testTime);
      return testTime;
    };
    
    const scheduleTestCheck = () => {
        const now = new Date();
        const nextTestTime = getNextTestTime();
        const delay = nextTestTime - now;

        console.log(
            `Scheduled task status check for: ${nextTestTime} (in ${Math.round(delay / 1000)} seconds)`
        );

        const timer = setTimeout(() => {
            checkTaskStatus();
            const newTestTime = new Date(
                nextTestTime.getFullYear(),
                nextTestTime.getMonth(),
                nextTestTime.getDate() + 1,
                0,
                0,
                0
            );
            localStorage.setItem('nextTestTime', newTestTime.toISOString());
        }, delay);

        return timer;
    };

    const timer = scheduleTestCheck();

    return () => {
        console.log("Clearing previous test timer.");
        if (timer) clearTimeout(timer);
    };
}, [hasLoaded]);
  
  const addTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now(),
      subtasks: [],
      createdDate: new Date().toISOString(),
    };
    setTasks([...tasks, taskWithId]);
    setAlert({ message: "Goal set successfully!", show: true });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setAlert({ message: "", show: false }), 3000);    
  };

  const toggleCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null, // Save timestamp only when marking complete
            }
          : task
      )
    );
  
    // Find the toggled task
    const toggledTask = tasks.find((task) => task.id === taskId);
  
    if (toggledTask) {
      const newCompletionState = !toggledTask.completed;
      const message = newCompletionState
        ? `Goal "${toggledTask.task}" marked as accomplished.`
        : `Goal "${toggledTask.task}" marked as pending.`;
  
      setAlert({ message, show: true });
      setTimeout(() => setAlert({ message: "", show: false }), 3000);
  
      if (newCompletionState) {
        const completedHour = new Date().getHours();
  
        // 🎯 Check for Early Bird and Night Owl
        if (completedHour < 8) {
          localStorage.setItem("earlyBird", "true");
        }
        if (completedHour >= 22) {
          localStorage.setItem("nightOwl", "true");
        }
  
        // 🎯 Check for Last-Minute Hero
        if (toggledTask.time) {
          const deadline = new Date();
          const [hours, minutes] = toggledTask.time.split(":").map(Number);
          deadline.setHours(hours, minutes, 0, 0);
  
          const now = new Date();
          const timeRemaining = (deadline - now) / 60000; // Convert to minutes
  
          if (timeRemaining > 0 && timeRemaining <= 10) {
            localStorage.setItem("lastMinuteHero", "true");
          }
        }

         // 🎯 Minimalist Achievement
          const activeGoals = tasks.filter((task) => !task.completed).length;
          if (activeGoals === 1) {
            localStorage.setItem("minimalist", "true");
          }
      }
    }
  };  
  
  const addSubtask = (taskId, subtaskName) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, { id: Date.now(), task: subtaskName, completed: false }] }
          : task
      )
    );
    setAlert({ message: "Sub-goal set successfully!", show: true });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setAlert({ message: "", show: false }), 3000);
  };

  const toggleSubtaskCompletion = (taskId, subtaskId) => {
    // Update the tasks state
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            }
          : task
      )
    );
  
    // Find the toggled task and subtask
    const parentTask = tasks.find((task) => task.id === taskId);
    if (parentTask) {
      const toggledSubtask = parentTask.subtasks.find(
        (subtask) => subtask.id === subtaskId
      );
  
      if (toggledSubtask) {
        const newCompletionState = !toggledSubtask.completed;
        const message = newCompletionState
          ? `Sub-goal marked as accomplished.`
          : `Sub-goal marked as pending.`;
  
        setAlert({ message, show: true });
        // Auto-dismiss the alert after 3 seconds
        setTimeout(() => setAlert({ message: "", show: false }), 3000);
      }
    }
  };
  
  const deleteTask = (taskId) => {setTasks((prevTasks) => 
    prevTasks.filter((task) => task.id !== taskId));
    setAlert({ message: "Goal deleted!", show: true });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setAlert({ message: "", show: false }), 3000);
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) }
          : task
      )
    );
    setAlert({ message: "Sub-goal deleted!", show: true });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setAlert({ message: "", show: false }), 3000);
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
  
    if (!taskToEdit) return;
  
    const newTaskName = prompt("Edit goal: 'I will...'", taskToEdit.task) || taskToEdit.task;
    const newLocation = prompt("Edit location:", taskToEdit.location) || taskToEdit.location;
    const newTime = prompt("Edit time (24-hr clock e.g., 14:00):", taskToEdit.time) || taskToEdit.time;
    const newRepeatDays = prompt(
      "Edit repeat days (e.g., 3):",
      taskToEdit.repeatDays
    );
  
    const updatedRepeatDays = newRepeatDays ? parseInt(newRepeatDays, 10) : taskToEdit.repeatDays;
  
    const updatedTask = {
      ...taskToEdit,
      task: newTaskName,
      location: newLocation,
      time: newTime,
      repeatDays: updatedRepeatDays,
    };
  
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
    );
    setAlert({ message: "Goal updated!", show: true });
    setTimeout(() => setAlert({ message: "", show: false }), 3000);
    console.log("Task updated successfully:", updatedTask);
  }; 

  const editSubtask = (taskId, subtaskId) => {
    const newSubtaskName = prompt("Edit sub-goal: 'I will...'");
    if (newSubtaskName) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, task: newSubtaskName }
                    : subtask
                ),
              }
            : task
        )
      );
      setAlert({ message: "Sub-goal edited!", show: true });
      // Auto-dismiss after 3 seconds
      setTimeout(() => setAlert({ message: "", show: false }), 3000);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  // Determine Rank based on totalGoalsAchieved
  const getUserRank = () => {
    const totalGoalsAchieved = parseInt(localStorage.getItem("totalGoalsAchieved")) || 0;
    if (totalGoalsAchieved >= 1000) return "🦄 Mythic Overlord";
    if (totalGoalsAchieved >= 500) return "👑 Eternal Conqueror";
    if (totalGoalsAchieved >= 200) return "🔱 Titan";
    if (totalGoalsAchieved >= 100) return "🏛️ Centurion";
    if (totalGoalsAchieved >= 50) return "🎖 Elite";
    if (totalGoalsAchieved >= 20) return "🛡️ Knight of Triumph";
    if (totalGoalsAchieved >= 10) return "⚔️ Novice Hero";
    return "🏹 Apprentice"; // Default rank for <10 goals
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <Router>
      <div className={`container ${theme}`}>
        <header className="header">
          <div className="header-text">
            <h1>Priorify</h1>
            <small>Tomorrow is a scam. I'll do it today.</small>
          </div>
          <div className="rank-icon">
            {getUserRank().split(" ")[0]}
          </div>
          <div className="streak">
            <span className="streak-icon">🔥</span>
            <span className="streak-number">{localStorage.getItem("currentStreak") || 0}</span>
          </div>
          <div className="theme-toggle-container">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </header>
        <Alert message={alert.message} onClose={() => setAlert({ message: "", show: false })} show={alert.show} />
        <ErrorBoundary>
          <Routes>
            <Route path="/task-form" element={<TaskForm addTask={addTask} />} />
            <Route path="/stats" element={<Stats tasks={tasks} />} />
            <Route 
              path="/achievements" 
              element={<Achievements
                tasks={tasks}
                totalGoalsAchieved={parseInt(localStorage.getItem("totalGoalsAchieved")) || 0}
                goalsAchievedToday={tasks.filter(task => task.completed).length} 
                highestStreak={parseInt(localStorage.getItem("highestStreak")) || 0} 
              />}
            />
            <Route
              path="/"
              element={
                <TasksPage
                  tasks={filteredTasks}
                  toggleCompletion={toggleCompletion}
                  deleteTask={deleteTask}
                  addSubtask={addSubtask}
                  toggleSubtaskCompletion={toggleSubtaskCompletion}
                  deleteSubtask={deleteSubtask}
                  editTask={editTask}
                  editSubtask={editSubtask}
                  filter={filter}
                  setFilter={setFilter}
                  completedCount={completedCount}
                  pendingCount={pendingCount}
                />
              }
            />
          </Routes>
        </ErrorBoundary>
        <div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div>
    </div>
      </div>
    </Router>
  );
};

export default App;
