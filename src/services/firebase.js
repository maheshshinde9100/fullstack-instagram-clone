import { FieldValue, firebase } from '../lib/firebase';

export async function doesUsernameExist(username) {
  const result = await firebase.firestore().collection('users').where('username', '==', username).get();
  return result.docs.length > 0;
}


export async function getUserByUserId(userId) {
  const result = await firebase.firestore().collection("users").where("userId", "==", userId).get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }))
  return user;
}

export async function getSuggestedProfiles(userId, following = []) {
  const result = await firebase.firestore().collection("users").limit(50).get();
  const users = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  })).filter((profile) => profile.userId !== userId && !following.includes(profile.userId));
  return users;
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();
  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getUserPhotosByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();
  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));
  return photos;
}


////typed
// export async function updateLoggedInUserFollowing(
//   loggedInUserDocId,
//   profileId, 
//   isFollowingProfile 
// ) {

//   return firebase
//     .firestore()
//     .collection("users")
//     .doc(loggedInUserDocId)
//     .update({
//       following: isFollowingProfile
//         ? FieldValue.arrayRemove(profileId)
//         : FieldValue.arrayUnion(profileId),
//     });
// }

//gpt working
export async function updateLoggedInUserFollowing(loggedInUserDocId, profileId, isFollowingProfile) {
  if (!loggedInUserDocId) {
    console.error("No document ID for logged-in user. Cannot update following list.");
    return;
  }
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}


export async function updateFollowedUserFollowers(
  profileDocId,
  loggedInUserDocId,
  isFollowingProfile
) {

  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getPhotos(userId, following, savedPhotoDocIds = [], lastDoc = null, limit = 10) {
  if (!following || following.length === 0) {
    return {
      photos: [],
      lastDoc: null,
      hasMore: false
    };
  }

  let query = firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following)
    .orderBy("dateCreated", "desc")
    .limit(limit);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const result = await query.get();
  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      if (!user || user.length === 0) {
        return null;
      }
      const { username, avatarUrl } = user[0];
      const userSavedPhoto = savedPhotoDocIds.includes(photo.docId);
      return { username, avatarUrl, ...photo, userLikedPhoto, userSavedPhoto };
    })
  );

  const validPhotos = photosWithUserDetails.filter(photo => photo !== null);

  return {
    photos: validPhotos,
    lastDoc: result.docs[result.docs.length - 1],
    hasMore: result.docs.length === limit
  };
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername)
    .where("following", "array-contains", profileUserId)
    .get();
  return result.docs.length > 0;
}
export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}

export async function toggleSavePhoto(
  userDocId,
  photoDocId,
  isCurrentlySaved
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(userDocId)
    .update({
      saved: isCurrentlySaved
        ? FieldValue.arrayRemove(photoDocId)
        : FieldValue.arrayUnion(photoDocId),
    });
}

export async function updateUserProfile(userDocId, updates) {
  return firebase
    .firestore()
    .collection('users')
    .doc(userDocId)
    .update(updates);
}

export async function uploadAvatar(file, userId) {
  try {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    const storage = firebase.storage();
    const storageRef = storage.ref();
    const avatarRef = storageRef.child(`avatars/${userId}/${Date.now()}-${file.name}`);



    const uploadTask = await avatarRef.put(file);
    const downloadURL = await uploadTask.ref.getDownloadURL();


    return downloadURL;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
}

export async function uploadPhoto(file, userId) {
  try {
    // Validate file size (max 10MB for posts)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    const storage = firebase.storage();
    const storageRef = storage.ref();
    const photoRef = storageRef.child(`photos/${userId}/${Date.now()}-${file.name}`);



    const uploadTask = await photoRef.put(file);
    const downloadURL = await uploadTask.ref.getDownloadURL();


    return downloadURL;
  } catch (error) {
    console.error('Photo upload error:', error);
    throw error;
  }
}

export async function addPhotoToFirestore(photoData) {
  return firebase.firestore().collection('photos').add(photoData);
}

export async function deleteComment(photoDocId, commentToDelete) {
  return firebase
    .firestore()
    .collection('photos')
    .doc(photoDocId)
    .update({
      comments: FieldValue.arrayRemove(commentToDelete)
    });
}

export async function getAllPhotos(userId, limit = 10) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .orderBy("dateCreated", "desc")
    .limit(limit)
    .get();

  const allPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    allPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      if (!user || user.length === 0) {
        return null;
      }
      const { username, avatarUrl } = user[0];
      return { username, avatarUrl, ...photo, userLikedPhoto, userSavedPhoto: false };
    })
  );

  const validPhotos = photosWithUserDetails.filter(photo => photo !== null);

  return {
    photos: validPhotos,
    lastDoc: result.docs[result.docs.length - 1],
    hasMore: result.docs.length === limit
  };
}

