import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorDisplay = ({ message, onRetry }) => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load dashboard</h3>
                <p className="text-red-700 mb-4">{message}</p>
                <Button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </Button>
            </div>
        </div>
    );
};

export default ErrorDisplay;