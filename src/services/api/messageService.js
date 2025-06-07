import messagesData from '../mockData/messages.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let messages = [...messagesData];

const messageService = {
  async getAll() {
    await delay(250);
    return [...messages];
  },

  async getById(id) {
    await delay(200);
    const message = messages.find(m => m.id === id);
    if (!message) {
      throw new Error('Message not found');
    }
    return { ...message };
  },

  async getByProjectId(projectId) {
    await delay(250);
    return messages.filter(m => m.projectId === projectId).map(m => ({ ...m }));
  },

  async create(messageData) {
    await delay(400);
    const newMessage = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      comments: [],
      ...messageData
    };
    messages = [newMessage, ...messages];
    return { ...newMessage };
  },

  async update(id, updates) {
    await delay(300);
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    
    messages[index] = {
      ...messages[index],
      ...updates
    };
    
    return { ...messages[index] };
  },

  async delete(id) {
    await delay(300);
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    
    const deleted = messages[index];
    messages = messages.filter(m => m.id !== id);
    return { ...deleted };
  },

  async addComment(messageId, commentData) {
    await delay(300);
    const message = messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    const newComment = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...commentData
    };

    message.comments = [...(message.comments || []), newComment];
    return { ...message };
  }
};

export default messageService;