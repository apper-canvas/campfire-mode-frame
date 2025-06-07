import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { projectService, todoService, messageService } from '../services';

const TeamMemberCard = ({ member, onViewProfile }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onViewProfile(member)}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {member.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{member.role}</p>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{member.projectCount}</p>
            <p className="text-xs text-gray-500">Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{member.completedTodos}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{member.activeTodos}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full ${
              member.status === 'online' ? 'bg-green-500' : 
              member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
            <span className="capitalize">{member.status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectParticipation = ({ projects, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <ApperIcon name="FolderOpen" className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
        <p className="mt-2 text-gray-500">Create projects to see team participation</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{project.members?.length || 0} members</p>
              <p className="text-xs text-gray-400">
                Updated {format(new Date(project.updatedAt), 'MMM d')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.members?.slice(0, 6).map((member, memberIndex) => (
                <div
                  key={memberIndex}
                  className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                >
                  {member.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.members?.length > 6 && (
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  +{project.members.length - 6}
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
                <span>{project.todoCount || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('members');

  useEffect(() => {
    const loadTeamData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [projectsData, todosData, messagesData] = await Promise.all([
          projectService.getAll(),
          todoService.getAll(),
          messageService.getAll()
        ]);

        // Extract unique team members from projects
        const allMembers = new Set();
        projectsData.forEach(project => {
          project.members?.forEach(member => allMembers.add(member));
        });

        // Create member stats
        const membersWithStats = Array.from(allMembers).map(memberName => {
          const memberProjects = projectsData.filter(p => 
            p.members?.includes(memberName)
          );
          
          const memberTodos = todosData.filter(t => t.assignee === memberName);
          const completedTodos = memberTodos.filter(t => t.completed).length;
          const activeTodos = memberTodos.filter(t => !t.completed).length;

          return {
            id: memberName.toLowerCase().replace(/\s+/g, ''),
            name: memberName,
            role: memberName === 'You' ? 'Project Manager' : 'Team Member',
            status: Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline',
            projectCount: memberProjects.length,
            completedTodos,
            activeTodos,
            email: `${memberName.toLowerCase().replace(/\s+/g, '.')}@company.com`
          };
        });

        // Enhance projects with counts
        const enhancedProjects = projectsData.map(project => ({
          ...project,
          messageCount: messagesData.filter(msg => msg.projectId === project.id).length,
          todoCount: todosData.filter(todo => todo.projectId === project.id).length
        }));

        setTeamMembers(membersWithStats);
        setProjects(enhancedProjects);
      } catch (err) {
        setError(err.message || 'Failed to load team data');
        toast.error('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  const handleViewProfile = (member) => {
    toast.info(`Viewing ${member.name}'s profile...`);
  };

  const handleInviteMember = () => {
    toast.info('Invite team member feature coming soon!');
  };

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load team data</h3>
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">
            Team
          </h1>
          <p className="text-gray-600">
            Manage your team members and track collaboration
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInviteMember}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2 inline" />
          Invite Member
        </motion.button>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 inline-flex"
      >
        {[
          { id: 'members', label: 'Team Members', icon: 'Users' },
          { id: 'projects', label: 'Project Participation', icon: 'FolderOpen' }
        ].map((view) => (
          <motion.button
            key={view.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedView(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedView === view.id
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name={view.icon} className="w-4 h-4" />
            <span>{view.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        key={selectedView}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedView === 'members' ? (
          <>
            {/* Team Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Members', count: teamMembers.length, icon: 'Users', color: 'bg-blue-500' },
                { label: 'Active Projects', count: projects.length, icon: 'FolderOpen', color: 'bg-green-500' },
                { label: 'Online Now', count: teamMembers.filter(m => m.status === 'online').length, icon: 'Zap', color: 'bg-primary' },
                { label: 'Total Tasks', count: teamMembers.reduce((sum, m) => sum + m.activeTodos + m.completedTodos, 0), icon: 'CheckSquare', color: 'bg-orange-500' }
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

            {/* Team Members Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                  >
                    <div className="animate-pulse text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                      <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-8 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : teamMembers.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <ApperIcon name="Users" className="w-20 h-20 text-gray-300 mx-auto" />
                </motion.div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900">No team members yet</h3>
                <p className="mt-4 text-gray-500 max-w-md mx-auto">
                  Start by creating projects and adding team members to see them here
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInviteMember}
                  className="mt-8 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  Invite Your First Team Member
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TeamMemberCard
                      member={member}
                      onViewProfile={handleViewProfile}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">
              Project Participation
            </h2>
            <ProjectParticipation projects={projects} loading={loading} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Team;