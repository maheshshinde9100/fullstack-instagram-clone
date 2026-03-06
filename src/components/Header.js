import React, { useContext } from 'react';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import { useDarkMode } from '../context/dark-mode';
import * as ROUTES from '../constants/routes';
import { Link } from 'react-router-dom';
import useUser from '../hooks/use-user';

const Header = () => {
  const { firebase } = useContext(FirebaseContext);
  const { user: authUser } = useContext(UserContext);
  const { user } = useUser();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className='h-16 bg-white dark:bg-gray-800 border-b border-gray-primary dark:border-gray-600 mb-8'>
      <div className='container mx-auto p-4 flex justify-between items-center'>
        <div className='text-gray-700 dark:text-gray-300 text-center flex items-center cursor-pointer'>
          <h1>
            <Link to={ROUTES.DASHBOARD}>
              <img src="/images/logo.png" alt="instagram" className='mt-2 w-6/12' />
            </Link>
          </h1>
        </div>

        <div className='text-gray-700 dark:text-gray-300 flex items-center space-x-4'>
          {authUser ? (
            <>
              <Link to={ROUTES.DASHBOARD} title="Home">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 mr-6 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </Link>
              <Link to={ROUTES.SEARCH} title="Search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 mr-6 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </Link>
              <Link to="/direct/inbox" title="Direct Messages">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 mr-6 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </Link>
              <Link to={ROUTES.UPLOAD} title="New Post">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 mr-6 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </Link>
              <Link to={ROUTES.ALL_USERS} title="Discover Users">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 mr-6 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </Link>
              <button
                onClick={toggleDarkMode}
                className="w-8 h-8 mr-6 text-black-light dark:text-gray-300 hover:text-blue-medium dark:hover:text-blue-400 transition-colors focus:outline-none"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>
              <button
                type='button'
                title='Sign out'
                onClick={() => firebase.auth().signOut()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    firebase.auth().signOut();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 mr-6 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
              </button>
              <div className='flex items-center cursor-pointer'>
                <Link to={`/p/${user.username}`}>
                  <img
                    className='rounded-full h-8 w-8 flex object-cover'
                    src={user.avatarUrl || `/images/avatars/${user.username}.jpg`}
                    alt={`${user.username} profile`}
                    onError={(e) => {
                      e.target.src = '/images/avatars/default.png';
                    }}
                  />
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <button className='bg-blue-medium font-bold text-sm rounded text-white w-20 h-8 hover:bg-blue-600 transition-colors' type='button'>
                  Log In
                </button>
              </Link>
              <Link to={ROUTES.SIGN_UP}>
                <button className='font-bold text-sm rounded text-blue-medium w-20 h-8 hover:text-blue-600 transition-colors' type="button">
                  Sign Up
                </button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
