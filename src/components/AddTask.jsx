import React, { useState } from 'react';
import dynamoDB from '../awsConfig';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const AddTask = () => {
  const [taskID, setTaskID] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const addTask = async () => {
    const params = {
      TableName: 'TasksTable',
      Item: {
        taskID,
        taskName,
        description,
        dueDate,
      },
    };

    try {
      const command = new PutCommand(params);
      await dynamoDB.send(command);
      alert('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
      <input
        type="text"
        placeholder="Task ID"
        value={taskID}
        onChange={(e) => setTaskID(e.target.value)}
        className="w-full mb-4 p-3 border border-indigo-300 rounded-md bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-purple-400"
      />
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="w-full mb-4 p-3 border border-indigo-300 rounded-md bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-purple-400"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-3 border border-indigo-300 rounded-md bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-purple-400"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full mb-4 p-3 border border-indigo-300 rounded-md bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-purple-400"
      />
      <button
        onClick={addTask}
        className="w-full py-3 px-6 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 transition-all duration-300 ease-in-out shadow-lg"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTask;