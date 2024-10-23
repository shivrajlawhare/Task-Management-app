import React, { useEffect, useState } from 'react';
import dynamoDB from '../awsConfig';
import { ScanCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskID, setEditingTaskID] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedDueDate, setUpdatedDueDate] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const params = {
        TableName: 'TasksTable',
      };

      try {
        const command = new ScanCommand(params);
        const data = await dynamoDB.send(command);
        setTasks(data.Items);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (taskID) => {
    const params = {
      TableName: 'TasksTable',
      Key: {
        taskID: taskID,
      },
    };

    try {
      const command = new DeleteCommand(params);
      await dynamoDB.send(command);
      setTasks(tasks.filter((task) => task.taskID !== taskID));
      alert('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskID(task.taskID);
    setUpdatedName(task.taskName);
    setUpdatedDescription(task.description);
    setUpdatedDueDate(task.dueDate);
  };

  const updateTask = async () => {
    const params = {
      TableName: 'TasksTable',
      Key: {
        taskID: editingTaskID,
      },
      UpdateExpression: 'set #name = :name, #description = :description, #dueDate = :dueDate',
      ExpressionAttributeNames: {
        '#name': 'taskName',
        '#description': 'description',
        '#dueDate': 'dueDate',
      },
      ExpressionAttributeValues: {
        ':name': updatedName,
        ':description': updatedDescription,
        ':dueDate': updatedDueDate,
      },
    };

    try {
      const command = new UpdateCommand(params);
      await dynamoDB.send(command);
      setTasks(
        tasks.map((task) =>
          task.taskID === editingTaskID
            ? { ...task, taskName: updatedName, description: updatedDescription, dueDate: updatedDueDate }
            : task
        )
      );
      setEditingTaskID(null);
      setUpdatedName('');
      setUpdatedDescription('');
      setUpdatedDueDate('');
      alert('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <h2 className="text-3xl font-semibold text-blue-700 mb-8">Your Task List</h2>
      <ul className="space-y-6">
        {tasks.map((task, index) => (
          <li key={index} className="p-6 bg-white border-l-4 border-blue-500 shadow-md rounded-md flex justify-between">
            <div>
              <p className="text-lg font-bold text-blue-700">{task.taskID}</p>
              <p className="text-blue-600">{task.taskName}</p>
              <p className="text-gray-700">{task.description}</p>
              <p className="text-gray-500">{task.dueDate}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => deleteTask(task.taskID)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-300 ease-in-out"
              >
                Delete
              </button>
              <button
                onClick={() => startEditing(task)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-all duration-300 ease-in-out"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingTaskID && (
        <div className="mt-10 p-8 bg-gray-100 shadow-lg rounded-lg">
          <h3 className="text-xl font-bold text-green-700 mb-4">Update Task</h3>
          <input
            type="text"
            placeholder="Task Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="w-full mb-4 p-3 border border-green-300 rounded-md bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="w-full mb-4 p-3 border border-green-300 rounded-md bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
          />
          <input
            type="date"
            value={updatedDueDate}
            onChange={(e) => setUpdatedDueDate(e.target.value)}
            className="w-full mb-4 p-3 border border-green-300 rounded-md bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
          />
          <button
            onClick={updateTask}
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all duration-300 ease-in-out"
          >
            Save
          </button>
          <button
            onClick={() => setEditingTaskID(null)}
            className="w-full mt-3 py-3 px-6 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-all duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
