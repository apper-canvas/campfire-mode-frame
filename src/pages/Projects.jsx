import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { projectService, messageService, todoService, fileService } from '../services';

const ProjectTabs = ({ activeTab, onTabChange, projectId }) => {
  const tabs = [
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'todos', label: 'To-dos', icon: 'CheckSquare' },
    { id: 'files', label: 'Files', icon: 'Paperclip' },
    { id: 'activity', label: 'Activity', icon: 'Activity' }
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

const MessageBoard = ({ projectId, loading }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const allMessages = await messageService.getAll();
        const projectMessages = allMessages.filter(msg => msg.projectId === projectId);
        setMessages(projectMessages);
      } catch (err) {
        toast.error('Failed to load messages');
      }
    };

    if (projectId) {
      loadMessages();
    }
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.title.trim() || !newMessage.content.trim()) return;

    setSubmitting(true);
    try {
      const message = await messageService.create({
        projectId,
        title: newMessage.title,
        content: newMessage.content,
        author: 'You',
        comments: []
      });

      setMessages([message, ...messages]);
      setNewMessage({ title: '', content: '' });
      toast.success('Message posted successfully');
    } catch (err) {
      toast.error('Failed to post message');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* New Message Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Post a Message</h3>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Message title..."
              value={newMessage.title}
              onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <textarea
              placeholder="Write your message..."
              value={newMessage.content}
              onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !newMessage.title.trim() || !newMessage.content.trim()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post Message'}
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Messages */}
      {messages.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <ApperIcon name="MessageSquare" className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
          <p className="mt-2 text-gray-500">Start the conversation by posting the first message</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{message.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <span>{message.author}</span>
                    <span>•</span>
                    <span>{format(new Date(message.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                </div>
                <ApperIcon name="MoreVertical" className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-700 whitespace-pre-line">{message.content}</p>
              
              {message.comments && message.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">{message.comments.length} comment{message.comments.length !== 1 ? 's' : ''}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const TodoList = ({ projectId, loading }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const allTodos = await todoService.getAll();
        const projectTodos = allTodos.filter(todo => todo.projectId === projectId);
        setTodos(projectTodos);
      } catch (err) {
        toast.error('Failed to load todos');
      }
    };

    if (projectId) {
      loadTodos();
    }
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setSubmitting(true);
    try {
      const todo = await todoService.create({
        projectId,
        listId: 'general',
        title: newTodo,
        assignee: 'You',
        completed: false
      });

      setTodos([...todos, todo]);
      setNewTodo('');
      toast.success('Todo added successfully');
    } catch (err) {
      toast.error('Failed to add todo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (todoId) => {
    try {
      const todo = todos.find(t => t.id === todoId);
      const updated = await todoService.update(todoId, {
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : null
      });

      setTodos(todos.map(t => t.id === todoId ? updated : t));
      toast.success(updated.completed ? 'Todo completed!' : 'Todo reopened');
    } catch (err) {
      toast.error('Failed to update todo');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="p-6 space-y-6">
      {/* New Todo Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a To-do</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || !newTodo.trim()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding...' : 'Add'}
          </motion.button>
        </div>
      </motion.form>

      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">To-do ({activeTodos.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {activeTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggle(todo.id)}
                    className="w-5 h-5 border-2 border-gray-300 rounded hover:border-primary transition-colors"
                  />
                  <span className="flex-1 text-gray-900">{todo.title}</span>
                  <span className="text-sm text-gray-500">{todo.assignee}</span>
                  {todo.dueDate && (
                    <span className="text-sm text-gray-500">
                      {format(new Date(todo.dueDate), 'MMM d')}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Completed ({completedTodos.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {completedTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggle(todo.id)}
                    className="w-5 h-5 bg-primary border-2 border-primary rounded flex items-center justify-center"
                  >
                    <ApperIcon name="Check" className="w-3 h-3 text-white" />
                  </motion.button>
                  <span className="flex-1 text-gray-500 line-through">{todo.title}</span>
                  <span className="text-sm text-gray-400">{todo.assignee}</span>
                  {todo.completedAt && (
                    <span className="text-sm text-gray-400">
                      {format(new Date(todo.completedAt), 'MMM d')}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No todos yet</h3>
          <p className="mt-2 text-gray-500">Add your first todo to get started</p>
        </motion.div>
      )}
    </div>
  );
};

const FileList = ({ projectId, loading }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const allFiles = await fileService.getAll();
        const projectFiles = allFiles.filter(file => file.projectId === projectId);
        setFiles(projectFiles);
      } catch (err) {
        toast.error('Failed to load files');
      }
    };

    if (projectId) {
      loadFiles();
    }
  }, [projectId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const newFile = await fileService.create({
        projectId,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        uploadedBy: 'You'
      });

      setFiles([newFile, ...files]);
      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="animate-pulse space-y-3">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
      >
        <label className="block">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload files or drag and drop'}
            </p>
          </div>
        </label>
      </motion.div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <ApperIcon name="Paperclip" className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No files yet</h3>
          <p className="mt-2 text-gray-500">Upload your first file to get started</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg mb-3">
                <ApperIcon name="File" className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                <span>{file.uploadedBy}</span>
                <span>{Math.round(file.size / 1024)}KB</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(file.uploadedAt), 'MMM d, h:mm a')}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await projectService.getAll();
        setProjects(data);
        if (data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load projects</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="animate-pulse">
            <div className="h-24 bg-gray-200"></div>
            <div className="h-16 bg-gray-100"></div>
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="FolderOpen" className="w-20 h-20 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-6 text-2xl font-bold text-gray-900">No projects yet</h3>
          <p className="mt-4 text-gray-500 max-w-md mx-auto">
            Create your first project to start organizing your team's work and communications
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.info('Create project feature coming soon!')}
            className="mt-8 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Create Your First Project
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Project Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-gray-900">Projects</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.info('Create project feature coming soon!')}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {projects.map((project) => (
              <motion.button
                key={project.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedProject(project);
                  setActiveTab('messages');
                }}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedProject?.id === project.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <h3 className="font-semibold truncate">{project.name}</h3>
                <p className={`text-sm mt-1 truncate ${
                  selectedProject?.id === project.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {project.description}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <div className="flex -space-x-1">
                    {project.members?.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                          selectedProject?.id === project.id
                            ? 'bg-white text-primary border-white'
                            : 'bg-gray-200 text-gray-600 border-white'
                        }`}
                      >
                        {member.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  {project.members?.length > 3 && (
                    <span className={`text-xs ${
                      selectedProject?.id === project.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      +{project.members.length - 3}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="flex-1 flex flex-col">
        {selectedProject && (
          <>
            {/* Project Header */}
            <div className="bg-gradient-to-r from-primary to-accent text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-heading">{selectedProject.name}</h1>
                  <p className="text-white/90 mt-1">{selectedProject.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {selectedProject.members?.map((member, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white flex items-center justify-center text-sm font-medium"
                      >
                        {member.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <ApperIcon name="Settings" className="w-6 h-6 text-white/80 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Project Tabs */}
            <ProjectTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              projectId={selectedProject.id}
            />

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto bg-surface-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'messages' && <MessageBoard projectId={selectedProject.id} />}
                  {activeTab === 'todos' && <TodoList projectId={selectedProject.id} />}
                  {activeTab === 'files' && <FileList projectId={selectedProject.id} />}
                  {activeTab === 'activity' && (
                    <div className="p-6">
                      <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
                        <ApperIcon name="Activity" className="w-16 h-16 text-gray-300 mx-auto" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Activity Feed</h3>
                        <p className="mt-2 text-gray-500">Project activity tracking coming soon</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;