import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserContext from '../context/user';
import useUser from '../hooks/use-user';
import { updateUserProfile, uploadAvatar } from '../services/firebase';
import { DEFAULT_IMAGE_PATH } from '../constants/paths';
import * as ROUTES from '../constants/routes';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { user: userData } = useUser();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'Edit Profile - Instagram';
    
    if (userData) {
      setFullName(userData.fullName || '');
      setBio(userData.bio || '');
      setAvatarPreview(`/images/avatars/${userData.username}.jpg`);
    }
  }, [userData]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates = {
        fullName: fullName.trim(),
        bio: bio.trim()
      };

      // Upload new avatar if selected
      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile, user.uid);
        updates.avatarUrl = avatarUrl;
      }

      // Update user profile in Firestore
      await updateUserProfile(userData.docId, updates);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate(`/p/${userData.username}`);
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className='bg-gray-background min-h-screen'>
        <Header />
        <div className='mx-auto max-w-screen-lg p-4'>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-background min-h-screen'>
      <Header />
      <div className='mx-auto max-w-screen-lg p-4'>
        <div className='bg-white border border-gray-primary rounded p-6'>
          <h1 className='text-2xl font-bold mb-6'>Edit Profile</h1>
          
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Profile Picture
              </label>
              <div className='flex items-center space-x-4'>
                <img
                  src={avatarPreview}
                  alt='Profile preview'
                  className='w-20 h-20 rounded-full object-cover'
                  onError={(e) => (e.target.src = DEFAULT_IMAGE_PATH)}
                />
                <div>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-medium file:text-white hover:file:bg-blue-500'
                    disabled={loading}
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Username
              </label>
              <input
                type='text'
                value={userData.username}
                disabled
                className='w-full px-3 py-2 border border-gray-primary rounded-md bg-gray-100 text-gray-500'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Username cannot be changed
              </p>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Full Name
              </label>
              <input
                type='text'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder='Enter your full name'
                className='w-full px-3 py-2 border border-gray-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-medium focus:border-transparent'
                disabled={loading}
              />
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder='Tell us about yourself'
                className='w-full px-3 py-2 border border-gray-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-medium focus:border-transparent'
                rows='3'
                maxLength='150'
                disabled={loading}
              />
              <p className='text-xs text-gray-500 mt-1'>
                {bio.length}/150 characters
              </p>
            </div>

            {error && (
              <div className='mb-4 text-sm text-red-primary'>
                {error}
              </div>
            )}

            {success && (
              <div className='mb-4 text-sm text-green-600'>
                {success}
              </div>
            )}

            <div className='flex gap-4'>
              <button
                type='submit'
                disabled={loading}
                className={`px-6 py-2 rounded font-bold ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-medium text-white hover:bg-blue-500'
                }`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              
              <button
                type='button'
                onClick={() => navigate(`/p/${userData.username}`)}
                className='px-6 py-2 rounded font-bold border border-gray-primary text-gray-700 hover:bg-gray-50'
                disabled={loading}
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

export default EditProfile;
