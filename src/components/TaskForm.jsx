import React, { useState, useEffect } from 'react';

const TaskForm = ({ addTask }) => {
  const [action, setAction] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [repeatDays, setRepeatDays] = useState(1); // Default value for repeat days

  const actionPlaceholders = [
    'read three chapters', 'go for a run', 'finish the report', 'cook dinner', 'practice guitar', 
    'meditate for 20 minutes', 'water the plants', 'call a friend', 'clean the house', 'write in journal', 
    'learn a new recipe', 'do yoga', 'paint a picture', 'organize the closet', 'plan a trip', 
    'write a blog post', 'fix the bike', 'study a new language', 'practice coding', 'take photos'
  ];

  const locationPlaceholders = [
    'in the living room', 'at the park', 'in my office', 'at the gym', 'on the balcony', 
    'in the kitchen', 'at the beach', 'in the garden', 'in the cafe', 'on the terrace', 
    'at the library', 'in the backyard', 'on the rooftop', 'at a friend’s house', 'in the workshop', 
    'at the lake', 'in the studio', 'in the bedroom', 'on the hiking trail', 'in the reading nook'
  ];

  const getRandomPlaceholder = (placeholders) => {
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const [actionPlaceholder, setActionPlaceholder] = useState(getRandomPlaceholder(actionPlaceholders));
  const [locationPlaceholder, setLocationPlaceholder] = useState(getRandomPlaceholder(locationPlaceholders));

  useEffect(() => {
    const interval = setInterval(() => {
      setActionPlaceholder(getRandomPlaceholder(actionPlaceholders));
      setLocationPlaceholder(getRandomPlaceholder(locationPlaceholders));
    }, 10000); // Change placeholder every 10 seconds

    return () => clearInterval(interval);
  }, [actionPlaceholders, locationPlaceholders]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action && time && location) {
      addTask({ 
        task: action, 
        time, 
        location, 
        repeatDays,
        createdDate: new Date(), // Track the creation date of the task
        completed: false, 
        subtasks: [] // Initialize with an empty subtasks array
      });
      setAction('');
      setTime('');
      setLocation('');
      setRepeatDays(1); // Reset to default
    }
  };

  return (
    <div className="task-form-container fade-in">
      <form onSubmit={handleSubmit} className="task-form">
        <div>
          <label htmlFor="action">Today, I will</label>
          <input
            type="text"
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder={actionPlaceholder}
          />
        </div>
        <div>
          <label htmlFor="time">At what time?</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="location">Where?</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={locationPlaceholder}
          />
        </div>
        <div>
          <label htmlFor="repeatDays">Repeat for</label>
          <select
            id="repeatDays"
            value={repeatDays}
            onChange={(e) => setRepeatDays(parseInt(e.target.value))}
          >
            {[...Array(30).keys()].map((day) => (
              <option key={day + 1} value={day + 1}>
                {day + 1} {day === 0 ? 'day' : 'days'}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Set Goal</button>
      </form>
    </div>
  );
};

export default TaskForm;
