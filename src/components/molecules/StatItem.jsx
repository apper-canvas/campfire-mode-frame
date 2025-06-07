import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatItem = ({ iconName, count }) => {
    return (
        <div className="flex items-center space-x-1">
            <ApperIcon name={iconName} className="w-4 h-4" />
            <span>{count}</span>
        </div>
    );
};

export default StatItem;