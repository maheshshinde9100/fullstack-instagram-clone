<div align="center">

# Instagram Clone

**A full-featured social photo-sharing app inspired by Instagram**

Built with **React** · **Firebase** · **Cloudinary** · **Tailwind CSS**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Overview

Instagram Clone is a modern, full-stack social media application that replicates the core Instagram experience. Users can sign up, share photos, follow friends, react to posts, and browse stories — all powered by Firebase for the backend and Cloudinary for image hosting.

---

## Features

### Authentication & Routing
- Email/password authentication via **Firebase Authentication**
- Protected and public routes using `react-router-dom`
- Persistent auth state managed through custom hooks: `use-auth-listener`, `use-user`

### Feed & Posts
- Infinite-scrolling timeline showing photos from followed users and your own posts
- Lazy-loaded posts for performance using `LazyPost` + **Intersection Observer API**
- Likes, save/unsave, comments (add & delete), and human-readable timestamps
- Maximum **5 posts per user** enforced at the Firestore level

### Stories
- Instagram-style stories bar on the dashboard
- Story upload via **Cloudinary** with **24-hour expiry** tracked in Firestore
- Stories are automatically filtered out after expiry (client-side check)
- Minimal full-screen story viewer

### Profile
- Public profile pages with photo grid, followers/following counts, and bio
- Follow / unfollow other users in real time
- Edit profile: full name, bio, and profile photo upload via Cloudinary *(500 KB size limit)*

### Search & Suggestions
- User search page with live Firestore queries
- Sidebar "Suggestions for you" surfacing users you don't follow yet

---

## System Architecture

```mermaid
graph TB
    User(["User"]):::user

    subgraph Frontend["Frontend — React App"]
        direction TB
        Router["React Router\nRoute Management"]:::frontend
        Hooks["Custom Hooks\nuse-auth-listener\nuse-user"]:::frontend
        Tailwind["Tailwind CSS\nUI & Dark Mode"]:::frontend
    end

    subgraph Auth["Firebase Authentication"]
        EmailAuth["Email / Password\nSign Up & Login"]:::firebase
    end

    subgraph Firestore["Cloud Firestore"]
        Users[("users\nprofile · followers\nfollowing · saved")]:::firestore
        Photos[("photos\nURL · caption\nlikes · comments")]:::firestore
        Stories[("stories\nURL · createdAt\nexpiresAt · viewers")]:::firestore
    end

    subgraph Cloudinary["Cloudinary CDN"]
        Upload["Upload\nUnsigned Preset"]:::cloudinary
        CDN["Delivery\nOptimized URLs"]:::cloudinary
    end

    User --> Frontend
    Frontend --> Auth
    Frontend --> Firestore
    Frontend --> Cloudinary
    Auth --> EmailAuth
    Firestore --> Users
    Firestore --> Photos
    Firestore --> Stories
    Cloudinary --> Upload
    Cloudinary --> CDN

    classDef user fill:#FFB6C1,stroke:#E91E8C,stroke-width:2px,color:#000
    classDef frontend fill:#61DAFB,stroke:#0284C7,stroke-width:2px,color:#000
    classDef firebase fill:#FFCA28,stroke:#F57F17,stroke-width:2px,color:#000
    classDef firestore fill:#FF8F00,stroke:#E65100,stroke-width:2px,color:#fff
    classDef cloudinary fill:#3448C5,stroke:#1A237E,stroke-width:2px,color:#fff
```

---

## Data Flow

### Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant App as React App
    participant FB as Firebase Auth
    participant FS as Firestore

    U->>App: Enter email & password
    App->>FB: createUserWithEmailAndPassword()
    FB-->>App: User UID + Auth Token
    App->>FS: Create users/{uid} document
    FS-->>App: Document created
    App-->>U: Redirect to Dashboard
```

### Post Upload Flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant App as React App
    participant CD as Cloudinary
    participant FS as Firestore

    U->>App: Select image + caption
    App->>FS: Check post count for user
    FS-->>App: Count <= 5
    App->>CD: Upload image (max 1 MB)
    CD-->>App: Secure image URL
    App->>FS: Add document to photos collection
    FS-->>App: Post saved
    App-->>U: Post appears in Feed
```

### Story Flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant App as React App
    participant CD as Cloudinary
    participant FS as Firestore

    U->>App: Upload story image
    App->>CD: Upload to Cloudinary
    CD-->>App: Secure image URL
    App->>FS: Add story { URL, createdAt, expiresAt: now+24h }
    FS-->>App: Story saved

    Note over App,FS: Later — when viewing stories
    U->>App: Open stories bar
    App->>FS: Query stories collection
    FS-->>App: Raw stories list
    App->>App: Filter out expired stories (expiresAt < now)
    App-->>U: Display active stories only
```

### Feed Load Flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant App as React App
    participant FS as Firestore

    U->>App: Open Dashboard / Feed
    App->>FS: Get users/{uid}.following list
    FS-->>App: Following UIDs
    App->>FS: Query photos WHERE userId IN [self + following]
    FS-->>App: Posts array (ordered by date)
    App->>App: Lazy-load via IntersectionObserver
    App-->>U: Render paginated feed
```

---

## Firestore Data Model

```mermaid
erDiagram
    USERS {
        string uid PK
        string username
        string fullName
        string email
        string avatarURL
        string bio
        array following
        array followers
        array savedPosts
        timestamp dateCreated
    }

    PHOTOS {
        string photoId PK
        string userId FK
        string imageSrc
        string caption
        array likes
        array comments
        timestamp dateCreated
    }

    STORIES {
        string storyId PK
        string userId FK
        string imageSrc
        timestamp createdAt
        timestamp expiresAt
        array viewers
    }

    USERS ||--o{ PHOTOS : "creates"
    USERS ||--o{ STORIES : "posts"
    USERS }o--o{ USERS : "follows"
    USERS }o--o{ PHOTOS : "saves/likes"
```

---

## Image Upload Flow (Cloudinary)

```mermaid
flowchart LR
    A(["User selects image"]):::start

    A --> B{{"Upload type?"}}:::decision

    B -->|Profile Photo| C["Validate <= 500 KB"]:::validate
    B -->|Post Image| D["Validate <= 1 MB"]:::validate
    B -->|Story| E["Any size\nCloudinary compresses"]:::validate

    C --> F{{"Size OK?"}}:::decision
    D --> F
    E --> G["Upload via\nUnsigned Preset"]:::upload

    F -->|Yes| G
    F -->|No| H(["Show error to user"]):::error

    G --> I["Receive secure_url"]:::cloud
    I --> J["Save URL to\nFirestore document"]:::db
    J --> K(["Done"]):::done

    classDef start fill:#10B981,stroke:#047857,color:#fff,stroke-width:2px
    classDef decision fill:#F59E0B,stroke:#B45309,color:#000,stroke-width:2px
    classDef validate fill:#6366F1,stroke:#4338CA,color:#fff,stroke-width:2px
    classDef upload fill:#3448C5,stroke:#1A237E,color:#fff,stroke-width:2px
    classDef cloud fill:#0EA5E9,stroke:#0369A1,color:#fff,stroke-width:2px
    classDef db fill:#FF8F00,stroke:#E65100,color:#fff,stroke-width:2px
    classDef error fill:#EF4444,stroke:#B91C1C,color:#fff,stroke-width:2px
    classDef done fill:#10B981,stroke:#047857,color:#fff,stroke-width:2px
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **UI Framework** | React (CRA) | Component-based SPA |
| **Routing** | React Router DOM | Client-side navigation & protected routes |
| **Styling** | Tailwind CSS | Utility-first styles + dark mode |
| **Auth** | Firebase Authentication | Email/password login & signup |
| **Database** | Cloud Firestore | Real-time NoSQL document storage |
| **Image Hosting** | Cloudinary | Upload, transform & CDN delivery |
| **State Management** | Custom React Hooks | Auth state, user data |
| **Performance** | Intersection Observer | Lazy-loading posts in the feed |

---

## Project Structure

```
src/
├── components/
│   ├── header/          # Top navigation bar
│   ├── sidebar/         # Suggestions & user info
│   ├── post/            # Post card, likes, comments
│   ├── stories/         # Stories bar & viewer
│   └── profile/         # Profile grid & edit form
├── pages/
│   ├── dashboard.js     # Main feed page
│   ├── profile.js       # Public profile page
│   ├── login.js         # Auth pages
│   └── sign-up.js
├── hooks/
│   ├── use-auth-listener.js
│   └── use-user.js
├── services/
│   └── firebase.js      # Firebase config & helpers
└── helpers/
    └── cloudinary.js    # Upload utilities
```

---

### Constraints & Limits


| Feature | Limit |
| :--- | :--- |
| **Posts per user** | Max 5 |
| **Profile photo size** | Max 500 KB |
| **Post image size** | Max 1 MB |
| **Story duration** | 24 hours (auto-expired) |

### Connect with Me

- **Portfolio**: [maheshshinde-dev.vercel.app](https://maheshshinde-dev.vercel.app/)
- **GitHub**: [github.com/maheshshinde9100](https://github.com/maheshshinde9100)
- **LinkedIn**: [linkedin.com/in/maheshshinde9100](https://www.linkedin.com/in/maheshshinde9100)
- **Codolio**: [codolio.com/profile/mahesh.dev](https://codolio.com/profile/mahesh.dev)
