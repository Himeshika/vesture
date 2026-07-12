import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Review, Rental } from '@/types';

const reviewsCol = collection(db, 'reviews');

export const getItemReviews = async (itemId: string): Promise<Review[]> => {
  const q = query(
    reviewsCol, 
    where('itemId', '==', itemId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};

export const createReview = async (rental: Rental, rating: number, comment: string): Promise<void> => {
  if (rental.status !== 'completed' || rental.reviewed) {
    throw new Error('Can only review completed and unreviewed rentals.');
  }

  const reviewData = {
    itemId: rental.itemId,
    rentalId: rental.id,
    customerId: rental.customerId,
    customerName: rental.customerName,
    rating,
    comment,
    createdAt: serverTimestamp(),
  };

  await addDoc(reviewsCol, reviewData);
  
  await updateDoc(doc(db, 'rentals', rental.id), {
    reviewed: true,
    updatedAt: serverTimestamp(),
  });
};
