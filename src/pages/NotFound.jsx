import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="w-32 h-32 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <ApperIcon name="Flame" className="w-16 h-16 text-white" />
        </motion.div>

        <h1 className="text-6xl font-bold font-heading text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Looks like this campfire has gone out. The page you're looking for doesn't exist.
        </p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2 inline" />
            Back to Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2 inline" />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;