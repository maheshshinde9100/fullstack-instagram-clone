import { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "../context/user";
import { getAllPhotos } from "../services/firebase";

const useAllPhotos = () => {
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {
    user: { uid: userId = "" },
  } = useContext(UserContext);

  const loadPhotos = useCallback(async (isLoadMore = false) => {
    if (!userId || loading) return;
    
    setLoading(true);
    try {
      const result = await getAllPhotos(userId, 10);

      if (isLoadMore) {
        setPhotos(prev => [...(prev || []), ...result.photos]);
      } else {
        setPhotos(result.photos);
      }
      
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading all photos:', error);
      setPhotos([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [userId, loading]);

  useEffect(() => {
    if (userId) {
      loadPhotos(false);
    }
  }, [userId, loadPhotos]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPhotos(true);
    }
  }, [hasMore, loading, loadPhotos]);

  return { photos, loading, hasMore, loadMore };
};

export default useAllPhotos;
