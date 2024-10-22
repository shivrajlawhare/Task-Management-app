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
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Task List</h2>
      <ul className="space-y-4">
        {tasks.map((task, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{task.taskID}</p>
              <p>{task.taskName}</p>
              <p>{task.description}</p>
              <p>{task.dueDate}</p>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => deleteTask(task.taskID)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => startEditing(task)}
                className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingTaskID && (
        <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4">Update Task</h3>
          <input
            type="text"
            placeholder="Task Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={updatedDueDate}
            onChange={(e) => setUpdatedDueDate(e.target.value)}
            className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={updateTask}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            Save
          </button>
          <button
            onClick={() => setEditingTaskID(null)}
            className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
