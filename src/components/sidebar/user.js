import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

const User = ({ username, fullName, avatarUrl }) => {
  return (
    !username || !fullName ? (
      <Skeleton count={1} height={61} />
    ) : (
      <Link to={`/p/${username}`} className="grid grid-cols-4 gap-4 mb-6 items-center">
        <div className="flex items-center justify-between col-span-1">
          <img
            src={avatarUrl || `/images/avatars/${username}.jpg`}
            className="rounded-full w-16 h-16 object-cover flex mr-3"
            alt={`${username}'s avatar`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
        </div>
        <div className="col-span-3">
          <p className="font-bold text-sm tracking-tight text-gray-900 dark:text-gray-100">{username}</p>
          <p className="text-sm text-gray-base dark:text-gray-400">{fullName}</p>
        </div>
      </Link>
    )
  );
};

User.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  avatarUrl: PropTypes.string,
};

export default User;
