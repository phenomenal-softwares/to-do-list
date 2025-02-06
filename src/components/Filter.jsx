import React from 'react';

const Filter = ({ filter, setFilter, completedCount, pendingCount }) => {
  return (
    <div className="filter-buttons">
      <button
        className={filter === 'Pending' ? 'active' : ''}
        onClick={() => setFilter('Pending')}
      >
        Pending <sup>{pendingCount}</sup>
      </button>
      <button
        className={filter === 'Completed' ? 'active' : ''}
        onClick={() => setFilter('Completed')}
      >
        Accomplished <sup>{completedCount}</sup>
      </button>
    </div>
  );
};

export default Filter;
