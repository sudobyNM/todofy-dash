// Mock Task Model - In production, replace with Mongoose Task model
let tasks = [];

// @desc    Get tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  const userTasks = tasks.filter(task => task.userId === req.user.id);
  res.status(200).json(userTasks);
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: 'Please add a title' });
  }

  const task = {
    id: Date.now().toString(),
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description || '',
    priority: req.body.priority || 'MEDIUM',
    status: req.body.status || 'TODO',
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  res.status(200).json(task);
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Ensure user owns the task
  if (tasks[taskIndex].userId !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const updatedTask = { ...tasks[taskIndex], ...req.body };
  tasks[taskIndex] = updatedTask;

  res.status(200).json(updatedTask);
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.userId !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(200).json({ id: req.params.id });
};

export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};