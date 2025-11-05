import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import { getSuggestedProfiles } from '../services/firebase';
import { Link } from 'react-router-dom';
import UserContext from '../context/user';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    document.title = 'All Users - Instagram';
    
    async function getAllUsers() {
      try {
        setLoading(true);
        // Get all users by passing empty following array to get all suggestions
        const allUsers = await getSuggestedProfiles(user?.uid || '', []);
        setUsers(allUsers);
      } catch (e) {
        setError('Failed to load users. Please try again.');
        console.error('Error loading users:', e);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      getAllUsers();
    }
  }, [user]);

  return (
    <div className='bg-gray-background dark:bg-gray-900 min-h-screen'>
      <Header />
      <div className='mx-auto max-w-screen-lg p-4'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4'>
            All Users
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Discover and connect with other users on Instagram
          </p>

          {loading && (
            <div className='flex justify-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
            </div>
          )}

          {error && !loading && (
            <div className='text-center py-8'>
              <p className='text-red-500'>{error}</p>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-gray-500 dark:text-gray-400'>No users found</p>
            </div>
          )}

          <div className='grid gap-4'>
            {users.map((u) => (
              <div key={u.docId} className='bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow'>
                <div className='flex items-center'>
                  <img
                    className='rounded-full h-12 w-12 mr-4 object-cover'
                    src={u.avatar || `/images/avatars/${u.username}.jpg`}
                    alt={`${u.username} avatar`}
                    onError={(e) => {
                      e.target.src = '/images/avatars/default.png';
                    }}
                  />
                  <div>
                    <p className='font-bold text-gray-800 dark:text-gray-200'>{u.username}</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{u.fullName}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-500'>
                      {u.followers?.length || 0} followers • {u.following?.length || 0} following
                    </p>
                  </div>
                </div>
                <Link 
                  className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors' 
                  to={`/p/${u.username}`}
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
