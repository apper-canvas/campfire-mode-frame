import projectsData from '../mockData/projects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let projects = [...projectsData];

const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(400);
    const newProject = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...projectData
    };
    projects = [newProject, ...projects];
    return { ...newProject };
  },

  async update(id, updates) {
    await delay(300);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(300);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const deleted = projects[index];
    projects = projects.filter(p => p.id !== id);
    return { ...deleted };
  }
};

export default projectService;