import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { WishlistEntry, ClothingItem } from '@/types';

export const getUserWishlist = async (uid: string): Promise<WishlistEntry[]> => {
  const wishlistCol = collection(db, 'wishlist', uid, 'items');
  const q = query(wishlistCol, orderBy('addedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as WishlistEntry);
};

export const addToWishlist = async (uid: string, item: ClothingItem): Promise<void> => {
  const itemRef = doc(db, 'wishlist', uid, 'items', item.id);
  const entry: WishlistEntry = {
    itemId: item.id,
    itemName: item.name,
    itemImage: item.images[0],
    itemCategory: item.category,
    pricePerDay: item.pricePerDay,
    addedAt: serverTimestamp() as any,
  };
  await setDoc(itemRef, entry);
};

export const removeFromWishlist = async (uid: string, itemId: string): Promise<void> => {
  const itemRef = doc(db, 'wishlist', uid, 'items', itemId);
  await deleteDoc(itemRef);
};

export const isWishlisted = async (uid: string, itemId: string): Promise<boolean> => {
  const itemRef = doc(db, 'wishlist', uid, 'items', itemId);
  const snap = await getDoc(itemRef);
  return snap.exists();
};
