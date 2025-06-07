import React from 'react';
import { motion } from 'framer-motion';

const HeroBanner = ({ title, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white"
        >
            <h1 className="text-3xl font-bold font-heading mb-2">
                {title}
            </h1>
            <p className="text-white/90 text-lg">
                {subtitle}
            </p>
        </motion.div>
    );
};

export default HeroBanner;