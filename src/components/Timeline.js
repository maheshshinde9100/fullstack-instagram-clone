import React from 'react'
import Skeleton from 'react-loading-skeleton';
import useAllPhotos from '../hooks/use-all-photos';
import useInfiniteScroll from '../hooks/use-infinite-scroll';
import Post from './post';

const Timeline = () => {
  const { photos, loading, hasMore, loadMore } = useAllPhotos();
  
  useInfiniteScroll(loadMore, hasMore, loading);

  return (
  <div className='container col-span-2'>
      {!photos ? (
        <Skeleton count={4} width={640} height={500} className='mb-5'/>
      ): photos?.length>0 ?(
        <>
          {photos.map((content)=> <Post key={content.docId}
        content={content}/>)}
          {loading && (
            <div className='flex justify-center py-4'>
              <Skeleton count={2} width={640} height={500} className='mb-5'/>
            </div>
          )}
          {!hasMore && photos.length > 0 && (
            <p className='text-center text-gray-500 dark:text-gray-400 py-4'>
              You've reached the end of your timeline
            </p>
          )}
        </>
      ): (
        <p className='text-center text-2xl text-gray-500 dark:text-gray-400'>
          No photos to display
        </p>
      )}
    </div>
      );
};

export default Timeline;