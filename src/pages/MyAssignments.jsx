import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { todoService, projectService } from '../services';

const AssignmentCard = ({ todo, project, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleSave = async () => {
    if (editValue.trim() === todo.title) {
      setIsEditing(false);
      return;
    }

    try {
      await onUpdate(todo.id, { title: editValue.trim() });
      setIsEditing(false);
      toast.success('Todo updated successfully');
    } catch (err) {
      toast.error('Failed to update todo');
      setEditValue(todo.title);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  const getDueDateColor = () => {
    if (!todo.dueDate) return 'text-gray-500';
    const dueDate = new Date(todo.dueDate);
    if (isPast(dueDate) && !isToday(dueDate)) return 'text-red-600';
    if (isToday(dueDate)) return 'text-orange-600';
    if (isTomorrow(dueDate)) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getDueDateText = () => {
    if (!todo.dueDate) return null;
    const dueDate = new Date(todo.dueDate);
    if (isToday(dueDate)) return 'Due today';
    if (isTomorrow(dueDate)) return 'Due tomorrow';
    if (isPast(dueDate)) return 'Overdue';
    return `Due ${format(dueDate, 'MMM d')}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
        todo.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(todo.id)}
          className={`mt-1 w-5 h-5 border-2 rounded transition-all ${
            todo.completed
              ? 'bg-primary border-primary'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {todo.completed && (
            <ApperIcon name="Check" className="w-3 h-3 text-white" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => !todo.completed && setIsEditing(true)}
              className={`font-medium cursor-pointer hover:text-primary transition-colors ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>
          )}

          <div className="flex items-center space-x-4 mt-2 text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <ApperIcon name="FolderOpen" className="w-4 h-4" />
              <span>{project?.name || 'Unknown Project'}</span>
            </div>

            {todo.dueDate && (
              <div className={`flex items-center space-x-1 ${getDueDateColor()}`}>
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span className="font-medium">{getDueDateText()}</span>
              </div>
            )}

            <div className="flex items-center space-x-1 text-gray-500">
              <ApperIcon name="User" className="w-4 h-4" />
              <span>{todo.assignee}</span>
            </div>
          </div>

          {todo.completed && todo.completedAt && (
            <p className="text-xs text-gray-400 mt-2">
              Completed {format(new Date(todo.completedAt), 'MMM d, h:mm a')}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!todo.completed && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </motion.button>
          )}
          <ApperIcon name="MoreVertical" className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};

const FilterTabs = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'overdue', label: 'Overdue', count: counts.overdue }
  ];

  return (
    <div className="border-b border-gray-200 bg-white rounded-t-lg">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeFilter === filter.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeFilter === filter.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

const MyAssignments = () => {
  const [todos, setTodos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [todosData, projectsData] = await Promise.all([
          todoService.getAll(),
          projectService.getAll()
        ]);

        // Filter todos assigned to current user
        const myTodos = todosData.filter(todo => 
          todo.assignee === 'You' || todo.assignee === 'you'
        );

        setTodos(myTodos);
        setProjects(projectsData);
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const handleToggleTodo = async (todoId) => {
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

  const handleUpdateTodo = async (todoId, updates) => {
    const updated = await todoService.update(todoId, updates);
    setTodos(todos.map(t => t.id === todoId ? updated : t));
    return updated;
  };

  const getFilteredTodos = () => {
    switch (activeFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'overdue':
        return todos.filter(todo => {
          if (!todo.dueDate || todo.completed) return false;
          const dueDate = new Date(todo.dueDate);
          return isPast(dueDate) && !isToday(dueDate);
        });
      default:
        return todos;
    }
  };

  const getCounts = () => {
    const all = todos.length;
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;
    const overdue = todos.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const dueDate = new Date(t.dueDate);
      return isPast(dueDate) && !isToday(dueDate);
    }).length;

    return { all, active, completed, overdue };
  };

  const filteredTodos = getFilteredTodos();
  const counts = getCounts();

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load assignments</h3>
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">
          My Assignments
        </h1>
        <p className="text-gray-600">
          Keep track of all your tasks across projects
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: counts.all, color: 'bg-blue-500', icon: 'List' },
          { label: 'Active', count: counts.active, color: 'bg-green-500', icon: 'Play' },
          { label: 'Completed', count: counts.completed, color: 'bg-primary', icon: 'CheckCircle' },
          { label: 'Overdue', count: counts.overdue, color: 'bg-red-500', icon: 'AlertTriangle' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      >
        <FilterTabs 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* Todos List */}
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <div className="animate-pulse flex items-center space-x-4">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : filteredTodos.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon 
                  name={
                    activeFilter === 'completed' ? 'CheckCircle' :
                    activeFilter === 'overdue' ? 'AlertTriangle' :
                    'CheckSquare'
                  } 
                  className="w-16 h-16 text-gray-300 mx-auto" 
                />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {activeFilter === 'completed' ? 'No completed tasks' :
                 activeFilter === 'overdue' ? 'No overdue tasks' :
                 activeFilter === 'active' ? 'No active tasks' :
                 'No assignments yet'}
              </h3>
              <p className="mt-2 text-gray-500">
                {activeFilter === 'completed' ? 'Complete some tasks to see them here' :
                 activeFilter === 'overdue' ? 'Great! You\'re all caught up' :
                 activeFilter === 'active' ? 'All your tasks are completed' :
                 'Tasks assigned to you will appear here'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AssignmentCard
                    todo={todo}
                    project={projects.find(p => p.id === todo.projectId)}
                    onToggle={handleToggleTodo}
                    onUpdate={handleUpdateTodo}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MyAssignments;