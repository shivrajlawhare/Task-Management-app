import React from 'react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AddTask />
      <TaskList />
    </div>
  );
};

export default App;