import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type, count = 1, className = '' }) => {
    const renderSkeleton = (key, delay) => {
        if (type === 'activity') {
            return (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay }}
                    className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}
                >
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </motion.div>
            );
        } else if (type === 'project') {
            return (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay }}
                    className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 ${className}`}
                >
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <>
            {[...Array(count)].map((_, i) => renderSkeleton(i, i * 0.1))}
        </>
    );
};

export default LoadingSkeleton;