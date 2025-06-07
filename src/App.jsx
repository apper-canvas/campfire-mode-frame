import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { routes, routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

const Sidebar = ({ routes, activeRoute, onRouteChange, isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.5 : 0 }}
        className="fixed inset-0 bg-black z-30 lg:hidden"
        style={{ display: isOpen ? 'block' : 'none' }}
        onClick={onToggle}
      />
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ 
          x: isOpen ? 0 : -280 
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed lg:static top-0 left-0 z-40 w-80 h-screen bg-white border-r border-gray-200 lg:translate-x-0 lg:block lg:!transform-none"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Flame" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold font-heading text-primary">Campfire PM</h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto scrollbar-thin-auto p-3 space-y-1">
          {routes.map((route) => (
            <motion.button
              key={route.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRouteChange(route.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeRoute === route.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-surface-200'
              }`}
            >
              <ApperIcon name={route.icon} className="w-5 h-5" />
              <span className="font-medium">{route.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

const MainLayout = () => {
  const [activeRoute, setActiveRoute] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const currentRoute = routes[activeRoute];
return (
    <div className="flex min-h-screen bg-surface-100">
      <Sidebar
        routes={routeArray}
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="Menu" className="w-6 h-6" />
            </button>
            <h2 className="font-heading font-semibold text-gray-900">{currentRoute.label}</h2>
            <div className="w-10" />
          </div>
</header>
{/* Main content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoute}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-full"
            >
              <currentRoute.component />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="bg-white shadow-lg rounded-lg border border-gray-200"
        bodyClassName="text-gray-700"
        progressClassName="bg-primary"
      />
    </Router>
  );
}

export default App;