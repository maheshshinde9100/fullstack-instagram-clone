import { FieldValue, firebase } from '../lib/firebase';

export async function doesUsernameExist(username) {
  const result = await firebase.firestore().collection('users').where('username', '==', username).get();
  return result.docs.length > 0;
}


export async function getUserByUserId(userId){
  const result = await firebase.firestore().collection("users").where("userId","==",userId).get();
  const user =  result.docs.map((item)=>({
    ...item.data(),
    docId: item.id
  }))
  return user;
}

export async function getSuggestedProfiles(userId,following){
  const result = await firebase.firestore().collection("users").limit(10).get();
  const user =  result.docs.map((item)=>({
    ...item.data(),
    docId: item.id
  })).filter((profile) => profile.userId !== userId && !following.includes(profile.userId)  
);
  return user;
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
//   console.log("Updating following for doc:", loggedInUserDocId, "with profileId:", profileId);
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
  console.log("Updating followers for doc:", profileDocId, "with userId:", loggedInUserDocId);
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

export async function getPhotos(userId, following, savedPhotoDocIds = []) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following)
    .get();
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
      const { username } = user[0];
      const userSavedPhoto = savedPhotoDocIds.includes(photo.docId);
      return { username, ...photo, userLikedPhoto, userSavedPhoto };
    })
  );
  return photosWithUserDetails;
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

export async function uploadPhoto(file, userId) {
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const photoRef = storageRef.child(`photos/${userId}/${Date.now()}-${file.name}`);
  
  const uploadTask = await photoRef.put(file);
  const downloadURL = await uploadTask.ref.getDownloadURL();
  
  return downloadURL;
}

export async function addPhotoToFirestore(photoData) {
  return firebase.firestore().collection('photos').add(photoData);
}
