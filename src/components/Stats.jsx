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
  // Get unlocked achievements from localStorage
  unlockedAchievements = JSON.parse(localStorage.getItem("unlockedAchievements")) || [],
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

  // Determine Rank based on totalGoalsAchieved
  const getUserRank = () => {
    if (totalGoalsAchieved >= 1000) return "🦄 Mythic Overlord";
    if (totalGoalsAchieved >= 500) return "👑 Eternal Conqueror";
    if (totalGoalsAchieved >= 200) return "🔱 Titan";
    if (totalGoalsAchieved >= 100) return "🏛️ Centurion";
    if (totalGoalsAchieved >= 50) return "🎖 Elite";
    if (totalGoalsAchieved >= 20) return "🛡️ Knight of Triumph";
    if (totalGoalsAchieved >= 10) return "⚔️ Novice Hero";
    return "🏹 Apprentice"; // Default rank for <10 goals
  };


  return (
    <div className="stats">
      <h3>Goals Stats</h3>
      <div className="chart-container">
        <h5>Goals achieved this week</h5>
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
    <div className="stat-item">
        <span className="stat-title">Rank:</span>
        <span className="stat-value">{getUserRank()}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Goals Set Today:</span>
        <span className="stat-value">{goalsSetToday}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">Goals Achieved Today:</span>
        <span className="stat-value">{goalsAchievedToday}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">All-time Goals Set:</span>
        <span className="stat-value">{totalGoalsSet}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">All-time Goals Achieved:</span>
        <span className="stat-value">{existingTotalGoalsAchieved + goalsAchievedToday}</span>
      </div>
      <div className="stat-item">
        <span className="stat-title">All-time Goals Missed:</span>
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
      <div className="stat-item">
        <span className="stat-title">Achievements Unlocked:</span>
        <span className="stat-value"> {unlockedAchievements.length} / 16</span>
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