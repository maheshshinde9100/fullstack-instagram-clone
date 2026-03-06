import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import PropTypes from "prop-types";
import PostModal from "./PostModal";

const Photos = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleOpenPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className='h-16 border-t border-gray-primary mt-12 pt-4'>
      <div className='grid grid-cols-3 gap-8 mt-4 mb-12'>
        {!photos
          ? new Array(12)
            .fill(0)
            .map((_, i) => <Skeleton key={i} width={320} height={400} />)
          : photos.length > 0
            ? photos.map((photo) => (
              <div
                key={photo.docId}
                className='relative group cursor-pointer aspect-square bg-gray-200 dark:bg-gray-800 rounded-sm overflow-hidden'
                onClick={() => handleOpenPhoto(photo)}
              >
                <img
                  src={photo.imageSrc}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className='absolute inset-0 bg-black/40 z-10 flex justify-evenly items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <p className='flex items-center text-white font-bold text-lg'>
                    <svg
                      className='w-7 mr-2 fill-current'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                    </svg>
                    {photo.likes?.length || 0}
                  </p>
                  <p className='flex items-center text-white font-bold text-lg'>
                    <svg
                      className='w-7 mr-2 fill-current'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                    >
                      <path d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z' />
                    </svg>
                    {photo.comments?.length || 0}
                  </p>
                </div>
              </div>
            ))
            : null}
      </div>
      {!photos ||
        (photos.length === 0 && (
          <p className='text-center text-2xl py-12 text-gray-400'>No posts yet</p>
        ))}

      {selectedPhoto && (
        <PostModal
          photo={selectedPhoto}
          onClose={handleClosePhoto}
        />
      )}
    </div>
  );
};

export default Photos;

Photos.propTypes = {
  photos: PropTypes.array,
};
