import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const WelcomeFeature = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-4xl mx-auto"
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mx-auto mb-6">
                    <ApperIcon name="Flame" className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">
                    Welcome to Campfire PM
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    Your team collaboration hub is ready. Navigate using the sidebar to explore projects, assignments, and team management.
                </p>
            </div>
        </motion.div>
    );
};

export default WelcomeFeature;