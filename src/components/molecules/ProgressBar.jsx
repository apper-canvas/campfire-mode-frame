import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, label }) => {
    return (
        <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{label}</span>
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
    );
};

export default ProgressBar;