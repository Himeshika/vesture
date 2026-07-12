import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { CategoryDoc } from '@/types';
import { CATEGORIES, CATEGORY_ICONS } from '@/constants/Categories';
import { getItemsByCategory } from './itemsService';

const categoriesCol = collection(db, 'categories');

export const getAllCategories = async (): Promise<CategoryDoc[]> => {
  const snapshot = await getDocs(categoriesCol);
  return snapshot.docs.map(doc => doc.data() as CategoryDoc);
};

export const createCategory = async (name: string, icon: string): Promise<string> => {
  const categoryId = doc(categoriesCol).id;
  const newCat: CategoryDoc = {
    id: categoryId,
    name,
    icon,
    createdAt: serverTimestamp() as any,
  };
  await setDoc(doc(db, 'categories', categoryId), newCat);
  return categoryId;
};

export const updateCategory = async (categoryId: string, data: { name?: string; icon?: string }): Promise<void> => {
  const catRef = doc(db, 'categories', categoryId);
  await updateDoc(catRef, data as any);
};

export const deleteCategory = async (categoryId: string, categoryName: string): Promise<void> => {
  const items = await getItemsByCategory(categoryName);
  if (items.length > 0) {
    throw new Error('Cannot delete category: items are still referencing it.');
  }
  await deleteDoc(doc(db, 'categories', categoryId));
};

export const seedCategoriesIfEmpty = async (): Promise<void> => {
  const existing = await getAllCategories();
  if (existing.length === 0) {
    const promises = CATEGORIES.map(cat => {
      const icon = CATEGORY_ICONS[cat] || 'grid';
      return createCategory(cat, icon);
    });
    await Promise.all(promises);
  }
};
