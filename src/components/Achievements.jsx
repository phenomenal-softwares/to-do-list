import React, { useState, useEffect } from "react";
import { FaLock, FaTrophy } from "react-icons/fa";
import "./Achievements.css";

const Achievements = ({ tasks, goalsAchievedToday, totalGoalsAchieved, highestStreak }) => {
  // Load unlocked achievements from localStorage
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    return JSON.parse(localStorage.getItem("unlockedAchievements")) || [];
  });

  // Load time-based achievements from localStorage
  const [earlyBird, setEarlyBird] = useState(localStorage.getItem("earlyBird") === "true");
  const [nightOwl, setNightOwl] = useState(localStorage.getItem("nightOwl") === "true");
  const [lastMinuteHero, setLastMinuteHero] = useState(localStorage.getItem("lastMinuteHero") === "true");

  const checkWeekendWarrior = () => {
    // Retrieve weekly stats from localStorage
    const weeklyStats = JSON.parse(localStorage.getItem("weeklyStats")) || [];
  
    // Find Saturday and Sunday in the weekly stats
    const saturdayStats = weeklyStats.find(
      (stat) => stat.day === "S" && new Date(stat.date).getDay() === 6 // Saturday is day 6
    );
    const sundayStats = weeklyStats.find(
      (stat) => stat.day === "S" && new Date(stat.date).getDay() === 0 // Sunday is day 0
    );
  
    // Ensure both days exist and goalsAchieved > 0
    return (
      saturdayStats &&
      sundayStats &&
      saturdayStats.goalsAchieved > 0 &&
      sundayStats.goalsAchieved > 0
    );
  };

  // Listen for changes in localStorage to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      setEarlyBird(localStorage.getItem("earlyBird") === "true");
      setNightOwl(localStorage.getItem("nightOwl") === "true");
      setLastMinuteHero(localStorage.getItem("lastMinuteHero") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // List of all achievements
  const achievementsList = [
    { id: "first_goal", title: "First Step", condition: "Complete 1 goal", check: () => totalGoalsAchieved >= 1 },
    { id: "three_goals", title: "On a Roll", condition: "Complete 3 goals in a single day", check: () => goalsAchievedToday >= 3 },
    { id: "five_goals", title: "Goal Crusher", condition: "Complete 5+ goals in a day", check: () => goalsAchievedToday >= 5 },
    { id: "perfect_day", title: "Perfect Day", condition: "Complete all goals for a day", check: () => localStorage.getItem("perfectDay") === "true" },
    { id: "streak_3", title: "Consistency is key", condition: "Complete at least 1 goal for 3 consecutive days", check: () => highestStreak >= 3 },
    { id: "streak_5", title: "5-Day Streak", condition: "Complete at least 1 goal for 5 days straight", check: () => highestStreak >= 5 },
    { id: "streak_7", title: "Week of Wins", condition: "Achieve a 7-day streak", check: () => highestStreak >= 7 },
    { id: "streak_14", title: "Two-Week Warrior", condition: "Maintain a 14-day streak", check: () => highestStreak >= 14 },
    { id: "streak_30", title: "Habit Builder", condition: "Maintain a 30-day streak", check: () => highestStreak >= 30 },
    { id: "streak_100", title: "Unstoppable", condition: "Maintain a 100-day streak", check: () => highestStreak >= 100 },
    { id: "ten_goals", title: "10 Goals Down", condition: "Complete 10 goals", check: () => totalGoalsAchieved >= 10 },
    { id: "fifty_goals", title: "Fifty and Flying", condition: "Complete 50 goals", check: () => totalGoalsAchieved >= 50 },
    { id: "one_hundred_goals", title: "Centurion", condition: "Complete 100 goals", check: () => totalGoalsAchieved >= 100 },
    { id: "five_hundred_goals", title: "500-Club", condition: "Complete 500 goals", check: () => totalGoalsAchieved >= 500 },
    { id: "one_thousand_goals", title: "Goal Master", condition: "Complete 1000 goals", check: () => totalGoalsAchieved >= 1000 },
    { id: "early_bird", title: "Early Bird", condition: "Complete a goal before 8 AM", check: () => earlyBird },
    { id: "night_owl", title: "Night Owl", condition: "Complete a goal after 10 PM", check: () => nightOwl },
    { id: "last_minute_hero", title: "Last-Minute Hero", condition: "Complete a goal within 10 minutes of its deadline", check: () => lastMinuteHero },
    { id: "weekend_warrior", title: "Weekend Warrior", condition: "Complete goals on both Saturday and Sunday", check: checkWeekendWarrior },
    { id: "goal_collector", title: "Goal Collector", condition: "Have 10+ active goals at once", check: () => tasks.filter((task) => !task.completed).length >= 10 },
    { id: "minimalist", title: "Minimalist", condition: "Keep only 1 active goal at a time and complete it", check: () => localStorage.getItem("minimalist") === "true" }

  ];

  // Check for newly unlocked achievements
  useEffect(() => {
    const newlyUnlocked = achievementsList
      .filter((achievement) => achievement.check()) // Filter achievements that meet conditions
      .map((achievement) => achievement.id);

    if (newlyUnlocked.length !== unlockedAchievements.length) {
      setUnlockedAchievements(newlyUnlocked);
      localStorage.setItem("unlockedAchievements", JSON.stringify(newlyUnlocked));
    }
  }, [totalGoalsAchieved, highestStreak, earlyBird, nightOwl, lastMinuteHero]);

  return (
    <div className="achievements-container fade-in">
      <h3>Achievements</h3>
      <div className="achievements-list">
        {achievementsList.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          return (
            <div key={achievement.id} className={`achievement-item ${isUnlocked ? "unlocked" : "locked"}`}>
              <div className="achievement-content">
                <span className="achievement-title">{achievement.title}</span>
                <span className="achievement-condition">{achievement.condition}</span>
              </div>
              <span className="achievement-icon">
                {isUnlocked ? <FaTrophy className="trophy" /> : <FaLock className="locked-icon" />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
