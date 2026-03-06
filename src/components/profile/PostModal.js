import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Post from '../post';

export default function PostModal({ photo, onClose }) {
    const modalRef = useRef(null);

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

    if (!photo) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-all duration-300"
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className="relative bg-white dark:bg-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-1">
                    <Post content={photo} />
                </div>
            </div>
        </div>
    );
}

PostModal.propTypes = {
    photo: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};
