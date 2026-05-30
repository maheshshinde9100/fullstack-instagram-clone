import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserContext from '../context/user';
import { uploadPhoto, addPhotoToFirestore, getUserPostCount } from '../services/firebase';
import * as ROUTES from '../constants/routes';

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    document.title = 'Upload - Instagram';
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      setError('You must be logged in to upload a photo.');
      return;
    }

    if (!file) {
      setError('Please select a photo');
      return;
    }

    if (!caption.trim()) {
      setError('Please add a caption');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Check post count
      const postCount = await getUserPostCount(user.uid);
      if (postCount >= 5) {
        throw new Error('You have reached the maximum limit of 5 posts.');
      }

      // Upload photo to Firebase Storage
      const imageSrc = await uploadPhoto(file, user.uid);

      // Add photo data to Firestore
      const photoData = {
        userId: user.uid,
        imageSrc,
        caption: caption.trim(),
        dateCreated: Date.now(),
        likes: [],
        comments: []
      };

      await addPhotoToFirestore(photoData);

      // Navigate back to dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Upload error:', error);
      if (error.message.includes('storage')) {
        setError('Storage error: Please check Firebase Storage configuration.');
      } else if (error.message.includes('permission')) {
        setError('Permission denied: Please check Firebase Storage rules.');
      } else if (error.message.includes('size') || error.message.includes('limit')) {
        setError(error.message);
      } else {
        setError(`Upload failed: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='bg-gray-background min-h-screen'>
      <Header />
      <div className='mx-auto max-w-screen-lg p-4'>
        <div className='bg-white border border-gray-primary rounded p-6'>
          <h1 className='text-2xl font-bold mb-6'>Upload Photo</h1>

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Select Photo
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-medium file:text-white hover:file:bg-blue-500'
                disabled={uploading}
              />
            </div>

            {preview && (
              <div className='mb-4'>
                <img
                  src={preview}
                  alt='Preview'
                  className='max-w-xs max-h-64 object-cover rounded'
                />
              </div>
            )}

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder='Write a caption...'
                className='w-full px-3 py-2 border border-gray-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-medium focus:border-transparent'
                rows='3'
                disabled={uploading}
              />
            </div>

            {error && (
              <div className='mb-4 text-sm text-red-primary'>
                {error}
              </div>
            )}

            <div className='flex gap-4'>
              <button
                type='submit'
                disabled={uploading || !file || !caption.trim()}
                className={`px-6 py-2 rounded font-bold ${uploading || !file || !caption.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-medium text-white hover:bg-blue-500'
                  }`}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>

              <button
                type='button'
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className='px-6 py-2 rounded font-bold border border-gray-primary text-gray-700 hover:bg-gray-50'
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
