import filesData from '../mockData/files.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let files = [...filesData];

const fileService = {
  async getAll() {
    await delay(300);
    return [...files];
  },

  async getById(id) {
    await delay(200);
    const file = files.find(f => f.id === id);
    if (!file) {
      throw new Error('File not found');
    }
    return { ...file };
  },

  async getByProjectId(projectId) {
    await delay(250);
    return files.filter(f => f.projectId === projectId).map(f => ({ ...f }));
  },

  async create(fileData) {
    await delay(500); // Longer delay to simulate upload
    const newFile = {
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
      ...fileData
    };
    files = [newFile, ...files];
    return { ...newFile };
  },

  async update(id, updates) {
    await delay(300);
    const index = files.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('File not found');
    }
    
    files[index] = {
      ...files[index],
      ...updates
    };
    
    return { ...files[index] };
  },

  async delete(id) {
    await delay(300);
    const index = files.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('File not found');
    }
    
    const deleted = files[index];
    files = files.filter(f => f.id !== id);
    return { ...deleted };
  }
};

export default fileService;