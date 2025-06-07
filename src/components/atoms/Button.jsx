import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, ...rest }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;