## Instagram Clone

A modern Instagram-like social app built with React, Tailwind CSS, Firebase, and Cloudinary.  
Users can sign up, log in, upload posts, create stories, like and comment on content, and manage their profile with a UI inspired by the real Instagram experience.

### Features

- **Authentication & Routing**
  - Email/password auth with Firebase Authentication.
  - Protected and public routes using `react-router-dom`.
  - Persistent auth state with custom hooks (`use-auth-listener`, `use-user`).

- **Feed & Posts**
  - Infinite-scrolling timeline showing all photos (`use-all-photos`).
  - Lazy-loaded posts for performance (`LazyPost` + Intersection Observer).
  - Likes, save/unsave, comments (add/delete), and human-readable timestamps.

- **Stories**
  - Instagram-style stories bar on the dashboard.
  - Story upload using Cloudinary (24h expiry stored in Firestore).
  - Minimal full-screen story viewer.

- **Profile**
  - Public profile pages with photo grid, followers/following counts, and bio.
  - Follow/unfollow other users.
  - Edit profile (full name, bio, **profile photo upload via Cloudinary**).

- **Search & Suggestions**
  - User search page.
  - Sidebar with “Suggestions for you” powered by Firestore queries.

### Frontend Stack

- **React** (Create React App) + **React Router**
- **Tailwind CSS** for styling and dark mode
- Reusable components for header, sidebar, posts, profile, and stories

### Backend / BaaS

- **Firebase**
  - **Authentication**: email/password login & signup.
  - **Cloud Firestore**:
    - `users` collection (profile, followers/following, saved posts, avatar URL).
    - `photos` collection (post image URL, caption, likes, comments, timestamps).
    - `stories` collection (story image URL, createdAt, expiresAt, viewers).

- **Cloudinary**
  - Used for all **user-generated images** (profile photos, posts, stories).
  - Client-side uploads via unsigned upload presets, URLs stored in Firestore.

### Environment Variables

Configure the following (examples use `REACT_APP_` since this is a frontend app):

- **Firebase**
  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`

- **Cloudinary**
  - `REACT_APP_CLOUDINARY_CLOUD_NAME`
  - `REACT_APP_CLOUDINARY_UPLOAD_PRESET_AVATAR`
  - `REACT_APP_CLOUDINARY_UPLOAD_PRESET_PHOTO`
  - `REACT_APP_CLOUDINARY_UPLOAD_PRESET_STORY`

