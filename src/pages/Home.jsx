import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { projectService, messageService, todoService } from '../services';

const ActivityFeed = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Activity" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No recent activity</h3>
        <p className="mt-2 text-gray-500">Start by creating a project or adding a message</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              activity.type === 'message' ? 'bg-blue-100' :
              activity.type === 'todo' ? 'bg-green-100' :
              'bg-primary/10'
            }`}>
              <ApperIcon 
                name={
                  activity.type === 'message' ? 'MessageSquare' :
                  activity.type === 'todo' ? 'CheckSquare' :
                  'FolderOpen'
                } 
                className={`w-4 h-4 ${
                  activity.type === 'message' ? 'text-blue-600' :
                  activity.type === 'todo' ? 'text-green-600' :
                  'text-primary'
                }`}
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{activity.title}</p>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{activity.projectName}</span>
                <span>•</span>
                <span>{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</span>
                <span>•</span>
                <span>{activity.author}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ProjectCard = ({ project, onClick }) => {
  const completedTodos = project.todos?.filter(todo => todo.completed).length || 0;
  const totalTodos = project.todos?.length || 0;
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
        </div>
        <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-primary h-2 rounded-full"
            />
          </div>
        </div>

        {/* Team members */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members?.slice(0, 3).map((member, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
              >
                {member.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.members?.length > 3 && (
              <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="MessageSquare" className="w-4 h-4" />
              <span>{project.messageCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="CheckSquare" className="w-4 h-4" />
              <span>{totalTodos}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [projectsData, messagesData, todosData] = await Promise.all([
          projectService.getAll(),
          messageService.getAll(),
          todoService.getAll()
        ]);

        // Enhance projects with stats
        const enhancedProjects = projectsData.map(project => ({
          ...project,
          todos: todosData.filter(todo => todo.projectId === project.id),
          messageCount: messagesData.filter(msg => msg.projectId === project.id).length
        }));

        // Create activity feed from messages and todos
        const messageActivities = messagesData.map(msg => ({
          id: `msg-${msg.id}`,
          type: 'message',
          title: msg.title,
          description: `New message posted`,
          projectName: enhancedProjects.find(p => p.id === msg.projectId)?.name || 'Unknown Project',
          author: msg.author,
          createdAt: msg.createdAt
        }));

        const todoActivities = todosData
          .filter(todo => todo.completed)
          .map(todo => ({
            id: `todo-${todo.id}`,
            type: 'todo',
            title: todo.title,
            description: `Todo completed`,
            projectName: enhancedProjects.find(p => p.id === todo.projectId)?.name || 'Unknown Project',
            author: todo.assignee,
            createdAt: todo.completedAt || todo.createdAt
          }));

        const allActivities = [...messageActivities, ...todoActivities]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        setProjects(enhancedProjects);
        setActivities(allActivities);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleProjectClick = (project) => {
    toast.info(`Opening ${project.name}...`);
  };

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load dashboard</h3>
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold font-heading mb-2">
          Welcome back to Campfire PM
        </h1>
        <p className="text-white/90 text-lg">
          Keep your team's work organized and moving forward together
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-heading text-gray-900">Active Projects</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.info('Create project feature coming soon!')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2 inline" />
              New Project
            </motion.button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                >
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="FolderOpen" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="mt-2 text-gray-500 mb-6">Create your first project to start collaborating with your team</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.info('Create project feature coming soon!')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Create First Project
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard 
                    project={project} 
                    onClick={() => handleProjectClick(project)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">Recent Activity</h2>
          <ActivityFeed activities={activities} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Home;