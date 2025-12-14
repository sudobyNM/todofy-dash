import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { taskService } from '../services/mockBackend';
import { Task, TaskPriority, TaskStatus } from '../types';
import Button from '../components/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Modal from '../components/Modal';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdate = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
      } else {
        await taskService.createTask(taskData as Task);
      }
      await fetchTasks();
      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Operation failed', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tasks, filterStatus, searchQuery]);

  // Chart Data
  const statsData = [
    { name: 'To Do', value: tasks.filter(t => t.status === TaskStatus.TODO).length, color: '#FCD34D' }, 
    { name: 'In Progress', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#60A5FA' }, 
    { name: 'Completed', value: tasks.filter(t => t.status === TaskStatus.COMPLETED).length, color: '#34D399' }, 
  ].filter(d => d.value > 0);

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.HIGH: return 'bg-red-100 text-red-800';
      case TaskPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case TaskPriority.LOW: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (s: TaskStatus) => {
    switch(s) {
      case TaskStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 ">
        
        {/* Top Header & Stats */}
        <div className="flex flex-col md:flex-row gap-6 ">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your projects and tasks efficiently.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                 <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                 <p className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</p>
               </div>
               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                 <p className="text-sm font-medium text-gray-500">Pending</p>
                 <p className="text-2xl font-bold text-orange-600 mt-1">
                   {tasks.filter(t => t.status !== TaskStatus.COMPLETED).length}
                 </p>
               </div>
               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                 <p className="text-sm font-medium text-gray-500">Completed</p>
                 <p className="text-2xl font-bold text-green-600 mt-1">
                   {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
                 </p>
               </div>
            </div>
          </div>
          
          {/* Simple Chart */}
          <div className="hidden lg:block w-72 h-48 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
             <h3 className="text-sm font-medium text-gray-500 mb-2">Task Distribution</h3>
             <div className="h-36 w-full">
               {statsData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={statsData}
                       cx="50%"
                       cy="50%"
                       innerRadius={30}
                       outerRadius={50}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {statsData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex items-center justify-center h-full text-xs text-gray-400">No data available</div>
               )}
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative w-full sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
            >
              <option value="ALL">All Status</option>
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
            </select>
            <Button onClick={openCreateModal} className="whitespace-nowrap">
              + New Task
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
             <div className="p-12 text-center">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
               </svg>
               <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
               <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
               <div className="mt-6">
                 <Button onClick={openCreateModal}>Create Task</Button>
               </div>
             </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <li key={task.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 truncate">{task.title}</p>
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask}
      />
    </Layout>
  );
};

export default Dashboard;