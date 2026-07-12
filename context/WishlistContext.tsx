import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { WishlistEntry, ClothingItem } from '@/types';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '@/firebase/wishlistService';
import { AuthContext } from './AuthContext';

interface WishlistContextType {
  wishlist: WishlistEntry[];
  wishlistedIds: Set<string>;
  isLoading: boolean;
  toggleWishlist: (item: ClothingItem) => Promise<void>;
  isWishlisted: (itemId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistEntry[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const fetchWishlist = useCallback(async () => {
    if (!authContext?.user) {
      setWishlist([]);
      setWishlistedIds(new Set());
      return;
    }
    
    setIsLoading(true);
    try {
      const userWishlist = await getUserWishlist(authContext.user.uid);
      setWishlist(userWishlist);
      setWishlistedIds(new Set(userWishlist.map(w => w.itemId)));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authContext?.user]);

  useEffect(() => {
    if (authContext?.user) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setWishlistedIds(new Set());
    }
  }, [authContext?.user, fetchWishlist]);

  const toggleWishlist = async (item: ClothingItem) => {
    if (!authContext?.user) return;
    const uid = authContext.user.uid;
    const isCurrentlyWishlisted = wishlistedIds.has(item.id);

    // Optimistic update
    if (isCurrentlyWishlisted) {
      setWishlistedIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      setWishlist(prev => prev.filter(w => w.itemId !== item.id));
      await removeFromWishlist(uid, item.id);
    } else {
      setWishlistedIds(prev => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });
      // Will fetch fresh from server to have proper timestamp
      await addToWishlist(uid, item);
      await fetchWishlist();
    }
  };

  const isWishlisted = (itemId: string) => {
    return wishlistedIds.has(itemId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistedIds,
      isLoading,
      toggleWishlist,
      isWishlisted,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
