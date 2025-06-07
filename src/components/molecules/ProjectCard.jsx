import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/molecules/ProgressBar';
import AvatarGroup from '@/components/molecules/AvatarGroup';
import StatItem from '@/components/molecules/StatItem';

const ProjectCard = ({ project, onClick, ...rest }) => {
    const completedTodos = project.todos?.filter(todo => todo.completed).length || 0;
    const totalTodos = project.todos?.length || 0;
    const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            {...rest}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                </div>
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
                <ProgressBar progress={progress} label="Progress" />

                <div className="flex items-center justify-between">
                    <AvatarGroup members={project.members} />
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <StatItem iconName="MessageSquare" count={project.messageCount || 0} />
                        <StatItem iconName="CheckSquare" count={totalTodos} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;