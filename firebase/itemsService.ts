import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { ClothingItem, ItemFormData, ItemStatus } from '@/types';
import { uploadImage } from '@/services/cloudinaryService';

const itemsCol = collection(db, 'items');

export const getAllItems = async (limitCount?: number): Promise<ClothingItem[]> => {
  let q = query(itemsCol, orderBy('createdAt', 'desc'));
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as ClothingItem);
};

export const getItemById = async (itemId: string): Promise<ClothingItem | null> => {
  const itemSnap = await getDoc(doc(itemsCol, itemId));
  if (itemSnap.exists()) {
    return itemSnap.data() as ClothingItem;
  }
  return null;
};

export const getItemsByCategory = async (category: string, excludeId?: string): Promise<ClothingItem[]> => {
  const q = query(itemsCol, where('category', '==', category));
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(doc => doc.data() as ClothingItem);
  if (excludeId) {
    return items.filter(item => item.id !== excludeId);
  }
  return items;
};

export const getItemsByStatus = async (status: ItemStatus): Promise<ClothingItem[]> => {
  const q = query(itemsCol, where('status', '==', status), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as ClothingItem);
};

export const createItem = async (data: ItemFormData): Promise<string> => {
  const itemId = doc(itemsCol).id;
  
  const uploadPromises = data.images.map(uri => uploadImage(uri, 'items'));
  const uploadedUrls = await Promise.all(uploadPromises);
  
  const newItem: ClothingItem = {
    id: itemId,
    name: data.name,
    description: data.description,
    category: data.category,
    size: data.size,
    color: data.color,
    images: uploadedUrls,
    pricePerDay: parseFloat(data.pricePerDay),
    securityDeposit: parseFloat(data.securityDeposit),
    status: 'available',
    ownerNotes: data.ownerNotes || null,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };
  
  await setDoc(doc(db, 'items', itemId), newItem);
  return itemId;
};

export const updateItem = async (itemId: string, data: Partial<ItemFormData>): Promise<void> => {
  const itemRef = doc(db, 'items', itemId);
  
  const updates: Partial<ClothingItem> = {
    updatedAt: serverTimestamp() as any,
  };

  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.category !== undefined) updates.category = data.category;
  if (data.size !== undefined) updates.size = data.size;
  if (data.color !== undefined) updates.color = data.color;
  if (data.pricePerDay !== undefined) updates.pricePerDay = parseFloat(data.pricePerDay);
  if (data.securityDeposit !== undefined) updates.securityDeposit = parseFloat(data.securityDeposit);
  if (data.ownerNotes !== undefined) updates.ownerNotes = data.ownerNotes;

  if (data.images) {
    const newImageUrls = await Promise.all(
      data.images.map(async (uri) => {
        if (uri.startsWith('http')) {
          return uri; // Already a Cloudinary URL from existing item
        }
        return await uploadImage(uri, 'items');
      })
    );
    updates.images = newImageUrls;
  }
  
  await updateDoc(itemRef, updates as any);
};

export const updateItemStatus = async (itemId: string, status: ItemStatus): Promise<void> => {
  const itemRef = doc(db, 'items', itemId);
  await updateDoc(itemRef, { 
    status,
    updatedAt: serverTimestamp()
  });
};

export const deleteItem = async (itemId: string): Promise<void> => {
  await deleteDoc(doc(db, 'items', itemId));
};
