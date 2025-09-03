import React, { useEffect } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';

const Dashboard = () => {
  useEffect(() => {
    document.title = "Instagram";
  }, []);

  return (
    <div className='bg-gray-background dark:bg-gray-900 min-h-screen'>
      {/* Header with Logo, Home, Logout, and Profile icons */}
      <Header />
      
      {/* Three-column layout with merged first two columns for Timeline */}
      <div className="grid grid-cols-3 gap-4 mx-auto max-w-screen-lg p-4">
        
        {/* Timeline spanning the first two columns and centered */}
        <div className="col-span-2 flex justify-center">
          <Timeline />
        </div>

        {/* Sidebar in the third column for suggestions */}
        <div className="col-span-1 flex justify-end">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
