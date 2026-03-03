import React, { useEffect } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';
import StoriesBar from '../components/stories/StoriesBar';

const Dashboard = () => {
  useEffect(() => {
    document.title = "Instagram";
  }, []);

  return (
    <div className='bg-gray-background dark:bg-gray-900 min-h-screen'>
      <Header />
      <div className="mx-auto max-w-screen-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col space-y-4">
            <StoriesBar />
            <div className="flex justify-center">
              <Timeline />
            </div>
          </div>
          <div className="col-span-1 flex justify-end">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
