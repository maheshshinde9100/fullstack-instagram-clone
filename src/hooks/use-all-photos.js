import { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "../context/user";
import { getAllPhotos } from "../services/firebase";

const useAllPhotos = () => {
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const {
    user: { uid: userId = "" },
  } = useContext(UserContext);

  const loadPhotos = useCallback(async (isLoadMore = false) => {
    if (!userId || loading || (isLoadMore && !hasMore)) return;

    setLoading(true);
    try {
      const currentLastDoc = isLoadMore ? lastDoc : null;
      const result = await getAllPhotos(userId, currentLastDoc, 10);

      if (isLoadMore) {
        setPhotos(prev => [...(prev || []), ...result.photos]);
      } else {
        setPhotos(result.photos);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading all photos:', error);
      setPhotos([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [userId, lastDoc, loading, hasMore]);

  useEffect(() => {
    if (userId) {
      // Initial load only if photos is null
      if (photos === null) {
        loadPhotos(false);
      }
    }
  }, [userId, photos, loadPhotos]);

  const loadMore = () => {
    if (hasMore && !loading) {
      loadPhotos(true);
    }
  };

  return { photos, loading, hasMore, loadMore };
};

export default useAllPhotos;
