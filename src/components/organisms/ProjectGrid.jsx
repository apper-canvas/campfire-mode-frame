import React from 'react';
import { toast } => 'react-toastify';
import Button from '@/components/atoms/Button';
import ProjectCard from '@/components/molecules/ProjectCard';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const ProjectGrid = ({ projects, loading, onProjectClick, onCreateProject }) => {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-heading text-gray-900">Active Projects</h2>
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCreateProject}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2 inline" />
                    New Project
                </Button>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                    <LoadingSkeleton type="project" count={4} />
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <EmptyState
                        iconName="FolderOpen"
                        title="No projects yet"
                        description="Create your first project to start collaborating with your team"
                    >
                        <Button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onCreateProject}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Create First Project
                        </Button>
                    </EmptyState>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => onProjectClick(project)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default ProjectGrid;