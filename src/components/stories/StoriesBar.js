import React, { useEffect, useState, useRef, useContext } from 'react';
import UserContext from '../../context/user';
import useUser from '../../hooks/use-user';
import { getStoriesForUserFeed, uploadStory, addStoryToFirestore } from '../../services/firebase';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

const StoriesBar = () => {
  const { user: authUser } = useContext(UserContext);
  const { user } = useUser();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let timer;
    if (activeStory) {
      setProgress(0);
      const startTime = Date.now();
      const duration = 5000; // 5 seconds

      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(timer);
          setActiveStory(null);
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [activeStory]);

  useEffect(() => {
    const loadStories = async () => {
      if (!authUser?.uid) return;
      setLoading(true);
      try {
        const data = await getStoriesForUserFeed(authUser.uid);
        setStories(data);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [authUser?.uid]);

  const handleAddStoryClick = () => {
    if (!authUser?.uid || uploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !authUser?.uid) return;

    setUploading(true);
    try {
      const imageSrc = await uploadStory(file, authUser.uid);
      const now = Date.now();
      const storyData = {
        userId: authUser.uid,
        imageSrc,
        createdAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
        viewers: [],
      };

      await addStoryToFirestore(storyData);

      setStories((prev) => [{ ...storyData, docId: `local-${now}` }, ...prev]);
    } catch (error) {
      console.error('Failed to upload story:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderStoryAvatar = (story) => {
    const isOwnStory = story.userId === authUser?.uid;
    const avatarSrc = story.avatarUrl || user?.avatarUrl;

    return (
      <button
        key={story.docId}
        type="button"
        onClick={() => setActiveStory(story)}
        className="flex flex-col items-center focus:outline-none"
      >
        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
            <img
              src={avatarSrc || `/images/avatars/${user?.username}.jpg`}
              alt="story"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE_PATH;
              }}
            />
          </div>
        </div>
        <span className="mt-1 text-xs text-gray-800 dark:text-gray-200 truncate max-w-[4rem]">
          {isOwnStory ? 'Your story' : story.username || 'Story'}
        </span>
      </button>
    );
  };

  if (!authUser?.uid) {
    return null;
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-800 border border-gray-primary dark:border-gray-700 rounded-lg mb-4 px-3 py-3">
        <div className="flex items-center space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {/* Add story */}
          <button
            type="button"
            onClick={handleAddStoryClick}
            className="flex flex-col items-center mr-1 focus:outline-none"
            title={uploading ? 'Uploading...' : 'Add to your story'}
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <span className="text-3xl leading-none text-gray-500 dark:text-gray-300">
                {uploading ? '…' : '+'}
              </span>
            </div>
            <span className="mt-1 text-xs text-gray-700 dark:text-gray-300">Your story</span>
          </button>

          {/* Existing stories */}
          {loading && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Loading stories...</p>
          )}
          {!loading && stories.map(renderStoryAvatar)}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </section>

      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300">
          <div className="relative max-w-md w-full h-[80vh] mx-4 flex flex-col items-center justify-center">
            {/* Top Bar with Progress */}
            <div className="absolute top-4 left-0 right-0 px-4 z-10">
              <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full mr-3 object-cover border border-white"
                    src={activeStory.avatarUrl || `/images/avatars/${activeStory.username}.jpg`}
                    alt={activeStory.username}
                  />
                  <span className="font-bold">{activeStory.username || 'Story'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <img
              src={activeStory.imageSrc}
              alt="story"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesBar;

