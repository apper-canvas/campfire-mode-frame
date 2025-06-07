import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { projectService, messageService, todoService } from '@/services';
import HeroBanner from '@/components/organisms/HeroBanner';
import ProjectGrid from '@/components/organisms/ProjectGrid';
import ActivityFeedList from '@/components/organisms/ActivityFeedList';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';

const HomePage = () => {
    const [projects, setProjects] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [projectsData, messagesData, todosData] = await Promise.all([
                projectService.getAll(),
                messageService.getAll(),
                todoService.getAll()
            ]);

            const enhancedProjects = projectsData.map(project => ({
                ...project,
                todos: todosData.filter(todo => todo.projectId === project.id),
                messageCount: messagesData.filter(msg => msg.projectId === project.id).length
            }));

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

    useEffect(() => {
        loadDashboardData();
    }, []);

    const handleProjectClick = (project) => {
        toast.info(`Opening ${project.name}...`);
    };

    const handleCreateProject = () => {
        toast.info('Create project feature coming soon!');
    };

    if (error) {
        return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <HeroBanner 
                title="Welcome back to Campfire PM" 
                subtitle="Keep your team's work organized and moving forward together" 
            />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ProjectGrid 
                        projects={projects} 
                        loading={loading} 
                        onProjectClick={handleProjectClick} 
                        onCreateProject={handleCreateProject}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">Recent Activity</h2>
                    <ActivityFeedList activities={activities} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;