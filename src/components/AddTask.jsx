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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Task</h2>
      <input
        type="text"
        placeholder="Task ID"
        value={taskID}
        onChange={(e) => setTaskID(e.target.value)}
        className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={addTask}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTask;
