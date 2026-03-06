import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserContext from '../context/user';
import * as ROUTES from '../constants/routes';
import useUser from '../hooks/use-user';

export default function MobileNav() {
    const { user: authUser } = useContext(UserContext);
    const { user } = useUser();
    const location = useLocation();

    if (!authUser) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-primary dark:border-gray-700 h-12 z-50 flex items-center justify-around px-4">
            <Link to={ROUTES.DASHBOARD}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={isActive(ROUTES.DASHBOARD) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-black-light dark:text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </Link>

            <Link to={ROUTES.SEARCH}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={isActive(ROUTES.SEARCH) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-black-light dark:text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </Link>

            <Link to={ROUTES.UPLOAD}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-black-light dark:text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
            </Link>

            <Link to={ROUTES.ALL_USERS}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={isActive(ROUTES.ALL_USERS) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-black-light dark:text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </Link>

            <Link to={`/p/${user?.username}`}>
                {user?.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt="profile"
                        className={`w-7 h-7 rounded-full object-cover border ${isActive(`/p/${user.username}`) ? 'border-black dark:border-white' : 'border-transparent'}`}
                    />
                ) : (
                    <div className={`w-7 h-7 rounded-full bg-gray-200 border ${isActive(`/p/${user.username}`) ? 'border-black dark:border-white' : 'border-transparent'}`} />
                )}
            </Link>
        </div>
    );
}
