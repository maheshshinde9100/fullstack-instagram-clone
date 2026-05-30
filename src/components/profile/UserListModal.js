import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUserByUserId } from '../../services/firebase';

export default function UserListModal({ title, userIds, onClose }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const modalRef = useRef(null);

    useEffect(() => {
        async function fetchUsers() {
            if (!userIds || userIds.length === 0) {
                setUsers([]);
                setLoading(false);
                return;
            }

            try {
                const userPromises = userIds.map((id) => getUserByUserId(id));
                const userResults = await Promise.all(userPromises);
                const validUsers = userResults.map(res => res[0]).filter(Boolean);
                setUsers(validUsers);
            } catch (error) {
                console.error('Error fetching users for list:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [userIds]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-all duration-300"
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-fade-in-up"
            >
                <div className="flex items-center justify-between border-b border-gray-primary dark:border-gray-700 px-4 py-3">
                    <div className="w-8" />
                    <h2 className="font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="p-10 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-medium"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                            No users found
                        </div>
                    ) : (
                        <div className="py-2">
                            {users.map((user) => (
                                <Link
                                    key={user.userId}
                                    to={`/p/${user.username}`}
                                    onClick={onClose}
                                    className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <img
                                        src={user.avatarUrl || `/images/avatars/${user.username}.jpg`}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-primary dark:border-gray-600"
                                        onError={(e) => e.target.src = '/images/avatars/default.png'}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{user.username}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{user.fullName}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

UserListModal.propTypes = {
    title: PropTypes.string.isRequired,
    userIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};
