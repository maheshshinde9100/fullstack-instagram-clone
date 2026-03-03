import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { DEFAULT_IMAGE_PATH } from "../../constants/paths";

const Header = ({ username, avatarUrl }) => {
  return (
    <div className='flex border-b border-gray-primary dark:border-gray-600 h-4 p-4 py-8'>
      <div className='flex items-center'>
        <Link to={`/p/${username}`} className='flex items-center'>
          <img
            className='rounded-full h-8 w-8 flex mr-3'
            src={avatarUrl || `/images/avatars/${username}.jpg`}
            alt={`${username} profile pic`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
          <p className='font-bold text-gray-900 dark:text-gray-100'>{username}</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;

Header.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
};