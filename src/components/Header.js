import React, { useContext } from 'react';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import { useDarkMode } from '../context/dark-mode';
import * as ROUTES from '../constants/routes';
import { Link } from 'react-router-dom';

const Header = () => {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
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
          {user ? (
            <>
              <Link to={ROUTES.SEARCH}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 mr-4 text-black-light dark:text-gray-300">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 104.216 12.033l3.75 3.75a.75.75 0 101.06-1.06l-3.75-3.75A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link to={ROUTES.UPLOAD}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 mr-4 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </Link>
              <button
                onClick={toggleDarkMode}
                className="w-7 h-7 mr-4 text-black-light dark:text-gray-300 hover:text-blue-medium dark:hover:text-blue-400 transition-colors"
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
              <Link to={ROUTES.DASHBOARD}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 mr-6 text-black-light dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </Link>
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
                <Link to={`/p/${user.displayName}`}>
                  <img className='rounded-full h-8 w-8 flex' src={`/images/avatars/${user.displayName}.jpg`} alt={`${user.displayName} profile`} />
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
