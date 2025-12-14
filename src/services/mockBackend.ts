import { Task, User, TaskStatus, TaskPriority, LoginResponse } from '../types';

// Constants for LocalStorage keys
const USERS_KEY = 'app_users';
const TASKS_KEY = 'app_tasks';
const TOKEN_KEY = 'app_token';

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// --- Auth Service Simulation ---

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(800); // Simulate network latency

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: (User & { password: string })[] = usersStr ? JSON.parse(usersStr) : [];

    // In a real app, passwords would be hashed.
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    const token = `fake-jwt-token-${user.id}-${Date.now()}`;
    
    localStorage.setItem(TOKEN_KEY, token);
    return { user: safeUser, token };
  },

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    await delay(800);

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: (User & { password: string })[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.some((u) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: generateId(),
      name,
      email,
      password, // Note: storing plain text here just for demo purposes.
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = newUser;
    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;

    localStorage.setItem(TOKEN_KEY, token);
    return { user: safeUser, token };
  },

  async getProfile(): Promise<User> {
    await delay(500);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Unauthorized');

    // Extract user ID from our fake token structure
    const parts = token.split('-');
    const userId = parts[3]; 

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: (User & { password: string })[] = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// --- Task Service Simulation ---

export const taskService = {
  async getTasks(): Promise<Task[]> {
    await delay(600);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Unauthorized');
    const userId = token.split('-')[3];

    const tasksStr = localStorage.getItem(TASKS_KEY);
    const tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];
    
    // Filter tasks for the current user
    return tasks.filter(t => t.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createTask(task: Omit<Task, 'id' | 'userId' | 'createdAt'>): Promise<Task> {
    await delay(600);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Unauthorized');
    const userId = token.split('-')[3];

    const tasksStr = localStorage.getItem(TASKS_KEY);
    const tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];

    const newTask: Task = {
      ...task,
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay(400);
    const tasksStr = localStorage.getItem(TASKS_KEY);
    let tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');

    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[index];
  },

  async deleteTask(id: string): Promise<void> {
    await delay(400);
    const tasksStr = localStorage.getItem(TASKS_KEY);
    let tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];

    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
};