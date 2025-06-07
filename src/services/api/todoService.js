import todosData from '../mockData/todos.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let todos = [...todosData];

const todoService = {
  async getAll() {
    await delay(250);
    return [...todos];
  },

  async getById(id) {
    await delay(200);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return { ...todo };
  },

  async getByProjectId(projectId) {
    await delay(250);
    return todos.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  },

  async create(todoData) {
    await delay(400);
    const newTodo = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null,
      dueDate: null,
      ...todoData
    };
    todos = [...todos, newTodo];
    return { ...newTodo };
  },

  async update(id, updates) {
    await delay(300);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    
    todos[index] = {
      ...todos[index],
      ...updates
    };
    
    return { ...todos[index] };
  },

  async delete(id) {
    await delay(300);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    
    const deleted = todos[index];
    todos = todos.filter(t => t.id !== id);
    return { ...deleted };
  },

  async toggleComplete(id) {
    await delay(250);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date().toISOString() : null;
    
    return { ...todo };
  }
};

export default todoService;