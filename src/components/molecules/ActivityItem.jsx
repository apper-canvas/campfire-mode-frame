import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const ActivityItem = ({ activity, index }) => {
    const iconName = activity.type === 'message' ? 'MessageSquare' :
                     activity.type === 'todo' ? 'CheckSquare' :
                     'FolderOpen';
    const bgColor = activity.type === 'message' ? 'bg-blue-100' :
                    activity.type === 'todo' ? 'bg-green-100' :
                    'bg-primary/10';
    const textColor = activity.type === 'message' ? 'text-blue-600' :
                      activity.type === 'todo' ? 'text-green-600' :
                      'text-primary';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                    <ApperIcon name={iconName} className={`w-4 h-4 ${textColor}`} />
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
    );
};

export default ActivityItem;