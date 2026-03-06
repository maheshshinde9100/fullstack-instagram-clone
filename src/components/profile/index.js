import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./header";
import { getUserPhotosByUserId, getSavedPhotos } from "../../services/firebase";
import Photos from "./photos";

const Profile = ({ user }) => {
  const reducer = (state, newState) => ({
    ...state,
    ...newState,
  });
  const initialState = {
    profile: {},
    photosCollection: [],
    savedPhotosCollection: [],
    followerCount: 0,
  };

  const [{ profile, photosCollection, savedPhotosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [activeTab, setActiveTab] = useState('POSTS'); // 'POSTS' or 'SAVED'

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      const photos = await getUserPhotosByUserId(user.userId);
      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: user?.followers?.length,
      });
    }

    async function fetchSavedPhotos() {
      if (user?.saved?.length > 0) {
        const savedPhotos = await getSavedPhotos(user.userId, user.saved);
        dispatch({ savedPhotosCollection: savedPhotos });
      }
    }

    if (user?.userId) {
      getProfileInfoAndPhotos();
      fetchSavedPhotos();
    }
  }, [user]);

  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
      />

      <div className="border-t border-gray-primary mt-12 pt-0">
        <div className="flex justify-center space-x-12">
          <button
            className={`flex items-center space-x-2 py-4 border-t transition-all ${activeTab === 'POSTS'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-gray-base'
              }`}
            onClick={() => setActiveTab('POSTS')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
            </svg>
            <span className="text-xs font-bold tracking-widest">POSTS</span>
          </button>

          {user?.userId === profile.userId && (
            <button
              className={`flex items-center space-x-2 py-4 border-t transition-all ${activeTab === 'SAVED'
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-base'
                }`}
              onClick={() => setActiveTab('SAVED')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21l-7.5-3.75L4.5 21V5.507c0-1.108.807-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              <span className="text-xs font-bold tracking-widest">SAVED</span>
            </button>
          )}
        </div>
      </div>

      <Photos photos={activeTab === 'POSTS' ? photosCollection : savedPhotosCollection} />
    </>
  );
};

export default Profile;

Profile.propTypes = {
  user: PropTypes.shape({
    dateCreated: PropTypes.number,
    emailAddress: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    fullName: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
  }),
};