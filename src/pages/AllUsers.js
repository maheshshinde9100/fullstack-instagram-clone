import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import { getSuggestedProfiles, toggleFollow } from '../services/firebase';
import { Link } from 'react-router-dom';
import UserContext from '../context/user';
import useUser from '../hooks/use-user';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: authUser } = useContext(UserContext);
  const { user: loggedInUser } = useUser(authUser?.uid);

  useEffect(() => {
    document.title = 'All Users - Instagram';

    async function getAllUsers() {
      try {
        setLoading(true);
        // Get all users by passing empty following array to get all suggestions
        const allUsers = await getSuggestedProfiles(authUser?.uid || '', []);
        setUsers(allUsers);
      } catch (e) {
        setError('Failed to load users. Please try again.');
        console.error('Error loading users:', e);
      } finally {
        setLoading(false);
      }
    }

    if (authUser) {
      getAllUsers();
    }
  }, [authUser]);

  const handleToggleFollow = async (isFollowing, profileDocId, profileUserId) => {
    if (!loggedInUser) return;

    // Optimistic UI update
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.userId === profileUserId
          ? {
            ...u,
            followers: isFollowing
              ? u.followers.filter(id => id !== loggedInUser.userId)
              : [...(u.followers || []), loggedInUser.userId]
          }
          : u
      )
    );

    await toggleFollow(
      isFollowing,
      loggedInUser.docId,
      profileDocId,
      profileUserId,
      loggedInUser.userId
    );
  };

  return (
    <div className='bg-gray-background dark:bg-gray-900 min-h-screen pb-12'>
      <Header />
      <div className='mx-auto max-w-screen-lg p-4'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-primary dark:border-gray-700'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 underline decoration-blue-medium underline-offset-8 decoration-4'>
            Discover People
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-8 font-medium'>
            Connect with friends and creators worldwide.
          </p>

          {loading && (
            <div className='flex justify-center py-12'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500 dark:text-gray-400 italic'>No users found</p>
            </div>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {users.map((u) => {
              const isFollowing = loggedInUser?.following?.includes(u.userId);
              const isMe = u.userId === authUser?.uid;

              return (
                <div key={u.docId} className='bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center justify-between hover:scale-[1.01] transition-all group shadow-sm'>
                  <Link to={`/p/${u.username}`} className='flex items-center group'>
                    <img
                      className='rounded-full h-14 w-14 mr-4 object-cover border-2 border-transparent group-hover:border-blue-medium transition-colors'
                      src={u.avatarUrl || `/images/avatars/${u.username}.jpg`}
                      alt={`${u.username} avatar`}
                      onError={(e) => {
                        e.target.src = '/images/avatars/default.png';
                      }}
                    />
                    <div>
                      <p className='font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-medium transition-colors'>{u.username}</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>{u.fullName}</p>
                      <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                        <span className='font-bold text-gray-600 dark:text-gray-300'>{u.followers?.length || 0}</span> followers
                      </p>
                    </div>
                  </Link>
                  <div className="flex space-x-2">
                    {!isMe && (
                      <button
                        onClick={() => handleToggleFollow(isFollowing, u.docId, u.userId)}
                        className={`text-sm font-bold py-1.5 px-4 rounded-lg transition-all ${isFollowing
                            ? 'bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-primary dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-red-900/40'
                            : 'bg-blue-medium text-white hover:bg-blue-600 shadow-sm'
                          }`}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                    <Link
                      className='bg-white dark:bg-gray-800 border border-gray-primary dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm py-1.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                      to={`/p/${u.username}`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
