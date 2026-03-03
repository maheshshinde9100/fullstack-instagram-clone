import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { updateLoggedInUserFollowing, updateFollowedUserFollowers } from '../../services/firebase';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

const SuggestedProfile = ({ profileDocId, username, avatarUrl, profileId, userId, loggedInUserDocId }) => {
  const [followed, setFollowed] = useState(false);

  async function handleFollowUser() {
    setFollowed(true);
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);


  }
  return !followed ? (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex items-center justify-between'>
        <img
          className='rounded-full h-8 w-8 object-cover flex mr-3'
          src={avatarUrl || `/images/avatars/${username}.jpg`}
          alt={username}
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE_PATH;
          }}
        />
        <Link to={`/p/${username}`}>
          <p className='font-bold text-sm'>{username}</p>
        </Link>
      </div>
      <button className='text-sm font-bold text-blue-medium' type='button' onClick={handleFollowUser}>Follow</button>

    </div>
  ) : null;
};

export default SuggestedProfile;
SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string,
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  profileId: PropTypes.string,
  userId: PropTypes.string,
  loggedInUserDocId: PropTypes.string,
}