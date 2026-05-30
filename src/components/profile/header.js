import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import useUser from "../../hooks/use-user";
import UserContext from "../../context/user";
import { isUserFollowingProfile, toggleFollow } from "../../services/firebase";
import { DEFAULT_IMAGE_PATH } from "../../constants/paths";
import * as ROUTES from "../../constants/routes";
import UserListModal from "./UserListModal";

const Header = ({
  photosCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    bio,
    followers = [],
    following = [],
    username: profileUsername,
    avatarUrl,
  },
  followerCount,
  setFollowerCount,
}) => {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [isFollowingProfile, setIsFollowingProfile] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'followers' or 'following'

  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const isOwnProfile = user?.username === profileUsername;

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });
    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };
    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId]);

  return (
    <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg mb-4 p-4'>
      <div className='container flex justify-center items-start'>
        {profileUsername ? (
          <img
            className='rounded-full h-16 w-16 md:h-40 md:w-40 flex object-cover border border-gray-primary dark:border-gray-700 shadow-sm'
            alt={`${fullName} profile pic`}
            src={avatarUrl || `/images/avatars/${profileUsername}.jpg`}
            onError={(e) => (e.target.src = DEFAULT_IMAGE_PATH)}
          />
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>
      <div className='flex items-start justify-center flex-col col-span-2'>
        <div className='container flex items-center mb-4'>
          <p className='text-2xl mr-4 text-gray-900 dark:text-gray-100 font-light'>{profileUsername}</p>
          {isOwnProfile ? (
            <Link
              to={ROUTES.EDIT_PROFILE}
              className='bg-white dark:bg-gray-800 border border-gray-primary dark:border-gray-700 font-bold text-sm rounded text-gray-900 dark:text-gray-100 px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              Edit Profile
            </Link>
          ) : activeBtnFollow && (
            <button
              className={`font-bold text-sm rounded w-24 h-8 transition-colors ${isFollowingProfile
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100"
                  : "bg-blue-medium text-white hover:bg-blue-600"
                }`}
              type='button'
              onClick={handleToggleFollow}
            >
              {isFollowingProfile === null ? <Skeleton width={50} /> : isFollowingProfile ? "Following" : "Follow"}
            </button>
          )
          }
        </div>
        <div className='container flex mt-2'>
          {!followers && !following ? (
            <Skeleton count={1} width={200} height={20} />
          ) : (
            <>
              <p className='mr-10 text-gray-900 dark:text-gray-100'>
                <span className='font-bold'>{photosCount}</span> posts
              </p>
              <button
                onClick={() => setActiveModal('followers')}
                className='mr-10 text-gray-900 dark:text-gray-100 hover:opacity-75'
              >
                <span className='font-bold'>{followerCount}</span> {followerCount === 1 ? "follower" : "followers"}
              </button>
              <button
                onClick={() => setActiveModal('following')}
                className='mr-10 text-gray-900 dark:text-gray-100 hover:opacity-75'
              >
                <span className='font-bold'>{following?.length || 0}</span> following
              </button>
            </>
          )}
        </div>
        <div className='container mt-4'>
          <p className='font-bold text-gray-900 dark:text-gray-100'>
            {!fullName ? <Skeleton count={1} height={20} width={150} /> : fullName}
          </p>
          {bio && (
            <p className='mt-1 text-sm text-gray-900 dark:text-gray-200'>
              {bio}
            </p>
          )}
        </div>
      </div>

      {activeModal && (
        <UserListModal
          title={activeModal === 'followers' ? 'Followers' : 'Following'}
          userIds={activeModal === 'followers' ? followers : following}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default Header;

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    bio: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    avatarUrl: PropTypes.string,
  }).isRequired,
};