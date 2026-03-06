import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { DEFAULT_IMAGE_PATH } from "../../constants/paths";
import { deletePhoto } from "../../services/firebase";
import UserContext from "../../context/user";
import * as ROUTES from "../../constants/routes";

const Header = ({ username, avatarUrl, docId, userId }) => {
  const { user } = useContext(UserContext);
  const isOwner = user?.uid === userId;
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePhoto(docId);
        // On success, refresh or redirect
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete photo:', error);
        alert('Failed to delete photo. Please try again.');
      }
    }
  };

  return (
    <div className='flex items-center justify-between border-b border-gray-primary dark:border-gray-600 h-4 p-4 py-8'>
      <div className='flex items-center'>
        <Link to={`/p/${username}`} className='flex items-center group'>
          <img
            className='rounded-full h-8 w-8 flex mr-3 object-cover border border-gray-primary dark:border-gray-700'
            src={avatarUrl || `/images/avatars/${username}.jpg`}
            alt={`${username} profile pic`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
          <p className='font-bold text-gray-900 dark:text-gray-100 group-hover:underline'>{username}</p>
        </Link>
      </div>

      {isOwner && (
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-primary transition-colors focus:outline-none"
          title="Delete post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Header;

Header.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  docId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};