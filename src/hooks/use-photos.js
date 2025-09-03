import { useState, useEffect, useContext, useCallback } from "react";

import UserContext from "../context/user";

import { getUserByUserId, getPhotos } from "../services/firebase";

const usePhotos = () => {
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const {
    user: { uid: userId = "" },
  } = useContext(UserContext);

  const loadPhotos = useCallback(async (isLoadMore = false) => {
    if (!userId || loading) return;
    
    setLoading(true);
    try {
      const [{ following, saved = [] }] = await getUserByUserId(userId);
      
      if (following.length === 0) {
        setPhotos([]);
        setHasMore(false);
        return;
      }

      const result = await getPhotos(
        userId, 
        following, 
        saved, 
        isLoadMore ? lastDoc : null,
        10
      );

      if (isLoadMore) {
        setPhotos(prev => [...(prev || []), ...result.photos]);
      } else {
        setPhotos(result.photos);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, lastDoc, loading]);

  useEffect(() => {
    if (userId) {
      loadPhotos(false);
    }
  }, [userId]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPhotos(true);
    }
  }, [hasMore, loading, loadPhotos]);

  return { photos, loading, hasMore, loadMore };
};

export default usePhotos;