import React from 'react';

const Filter = ({ filter, setFilter }) => {
  return (
    <div className="filter-buttons">
      <button
        className={filter === 'All' ? 'active' : ''}
        onClick={() => setFilter('All')}
      >
        All
      </button>
      <button
        className={filter === 'Completed' ? 'active' : ''}
        onClick={() => setFilter('Completed')}
      >
        Completed
      </button>
      <button
        className={filter === 'Pending' ? 'active' : ''}
        onClick={() => setFilter('Pending')}
      >
        Pending
      </button>
    </div>
  );
};

export default Filter;
