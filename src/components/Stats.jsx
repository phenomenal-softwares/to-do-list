import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Stats.css';
import 'chart.css';

const Stats = ({
  tasks,
  goalsSetToday = tasks.length,
  existingTotalGoalsSet = parseInt(localStorage.getItem("totalGoalsSet")) || 0,
  existingTotalGoalsAchieved = parseInt(localStorage.getItem("totalGoalsAchieved")) || 0,
  totalGoalsSet = existingTotalGoalsSet + goalsSetToday,
  totalGoalsAchieved = existingTotalGoalsAchieved + tasks.filter((task) => task.completed).length,
  totalGoalsMissed = totalGoalsSet - totalGoalsAchieved,
  AchievementRate = totalGoalsSet > 0 ? (totalGoalsAchieved / totalGoalsSet) * 100 : 0,
  currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0,
  highestStreak = parseInt(localStorage.getItem("highestStreak")) || 0,
  mostGoalsAchieved = parseInt(localStorage.getItem("mostGoalsAchieved")) || 0,
}) => {
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'narrow' });
  const currentDate = now.toISOString().split('T')[0];

  // State to track goals achieved today
  const [goalsAchievedToday, setGoalsAchievedToday] = useState(
    tasks.filter((task) => task.completed).length
  );

  // Fetch weekly stats from localStorage
  const [weeklyStats, setWeeklyStats] = useState(() => {
    const storedStats = JSON.parse(localStorage.getItem('weeklyStats')) || [];
    return storedStats;
  });

  // Update weeklyStats and localStorage when goalsAchievedToday changes
  useEffect(() => {
    setWeeklyStats((prevStats) => {
      const updatedStats = [...prevStats];
      const todayIndex = updatedStats.findIndex((stat) => stat.date === currentDate);

      if (todayIndex !== -1) {
        // Update today's goalsAchieved
        updatedStats[todayIndex].goalsAchieved = goalsAchievedToday;
      } else {
        // Add new entry for today
        updatedStats.push({ day: currentDay, date: currentDate, goalsAchieved: goalsAchievedToday });
        if (updatedStats.length > 7) updatedStats.shift(); // Keep the last 7 days
      }

      localStorage.setItem('weeklyStats', JSON.stringify(updatedStats));
      return updatedStats;
    });
  }, [goalsAchievedToday, currentDay, currentDate]);

  // Find the maximum value for scaling the chart
  const maxValue = Math.max(...weeklyStats.map((s) => s.goalsAchieved), 1); // Ensure maxValue is at least 1

  // Handler for task completion toggling
  const handleTaskToggle = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    const newGoalsAchievedToday = updatedTasks.filter((task) => task.completed).length;
    setGoalsAchievedToday(newGoalsAchievedToday);
  };

  return (
    <div className="stats">
      <div className="chart-container">
        <h4>Goals achieved this week</h4>
        <table className="charts-css column show-labels show-2-secondary-axes">
          <caption>Weekly Goals Achieved</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Progress</th>
            </tr>
          </thead>
          <tbody>
            {weeklyStats.map((stat) => (
              <tr key={stat.date}>
                <th scope="row">{stat.day}</th>
                <td style={{ "--size": stat.goalsAchieved / maxValue }}>
                  <span className="data">{stat.goalsAchieved}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Existing Stats */}
    <div className="stat-container">
      <h4>Goals stats</h4>
      <div className="stat-item">
        <span className="stat-title">Goals Set Today:</span>
        <span className="stat-value">{goalsSetToday}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Goals Achieved Today:</span>
        <span className="stat-value">{goalsAchievedToday}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Total Goals Set:</span>
        <span className="stat-value">{totalGoalsSet}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Total Goals Achieved:</span>
        <span className="stat-value">{existingTotalGoalsAchieved + goalsAchievedToday}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Total Goals Missed:</span>
        <span className="stat-value">{totalGoalsMissed}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Goals Achievement Rate:</span>
        <span className="stat-value">{AchievementRate.toFixed(2)}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Current Streak:</span>
        <span className="stat-value" style={{ color: currentStreak > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
          {currentStreak}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Highest Streak:</span>
        <span className="stat-value" style={{ color: highestStreak > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
          {highestStreak}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Most Goals Achieved in a Day:</span>
        <span className="stat-value">{mostGoalsAchieved}</span>
      </div>
    </div>
  </div>
  );
};

// Prop validation
Stats.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      repeatDays: PropTypes.number,
    })
  ).isRequired,
};

export default Stats;