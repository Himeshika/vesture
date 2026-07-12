import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Rental, ClothingItem, User } from '@/types';
import { updateItemStatus } from './itemsService';
import dayjs from 'dayjs';

const rentalsCol = collection(db, 'rentals');

export const getItemRentals = async (itemId: string): Promise<Rental[]> => {
  const q = query(
    rentalsCol, 
    where('itemId', '==', itemId),
    where('status', 'in', ['approved', 'active', 'return_requested'])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Rental);
};

export const createRentalRequest = async (
  item: ClothingItem,
  customer: User,
  startDate: string,
  endDate: string
): Promise<string> => {
  const rentalId = doc(rentalsCol).id;
  
  const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
  const rentalPrice = days * item.pricePerDay;
  const totalAmount = rentalPrice + item.securityDeposit;

  const newRental: Rental = {
    id: rentalId,
    itemId: item.id,
    itemName: item.name,
    itemImage: item.images[0],
    itemCategory: item.category,
    customerId: customer.uid,
    customerName: customer.name,
    startDate,
    endDate,
    rentalDays: days,
    rentalPrice,
    securityDeposit: item.securityDeposit,
    totalAmount,
    status: 'pending',
    requestedAt: serverTimestamp() as any,
    approvedAt: null,
    rejectedReason: null,
    returnRequestedAt: null,
    actualReturnDate: null,
    lateDays: null,
    lateFee: null,
    damageReported: false,
    damageNotes: null,
    damageFee: null,
    depositRefundAmount: null,
    reviewed: false,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };

  await setDoc(doc(db, 'rentals', rentalId), newRental);
  await updateItemStatus(item.id, 'reserved');

  return rentalId;
};

export const getCustomerRentals = async (uid: string): Promise<Rental[]> => {
  const q = query(rentalsCol, where('customerId', '==', uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Rental);
};

export const getActiveRentals = async (uid: string): Promise<Rental[]> => {
  const q = query(
    rentalsCol,
    where('customerId', '==', uid),
    where('status', 'in', ['pending', 'approved', 'active', 'return_requested'])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Rental);
};

export const getRentalHistory = async (uid: string): Promise<Rental[]> => {
  const q = query(
    rentalsCol,
    where('customerId', '==', uid),
    where('status', 'in', ['completed', 'rejected', 'cancelled'])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Rental);
};

export const getPendingRequests = async (): Promise<Rental[]> => {
  const q = query(rentalsCol, where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Rental);
};

export const getReturnQueue = async (): Promise<Rental[]> => {
  const q = query(rentalsCol, where('status', '==', 'return_requested'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Rental);
};

export const getRentalById = async (rentalId: string): Promise<Rental | null> => {
  const snap = await getDoc(doc(rentalsCol, rentalId));
  if (snap.exists()) {
    return snap.data() as Rental;
  }
  return null;
};

export const approveRental = async (rentalId: string, itemId: string): Promise<void> => {
  await updateDoc(doc(db, 'rentals', rentalId), {
    status: 'approved',
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateItemStatus(itemId, 'rented');
};

export const rejectRental = async (rentalId: string, itemId: string, reason: string): Promise<void> => {
  await updateDoc(doc(db, 'rentals', rentalId), {
    status: 'rejected',
    rejectedReason: reason,
    updatedAt: serverTimestamp(),
  });
  await updateItemStatus(itemId, 'available');
};

export const requestReturn = async (rentalId: string): Promise<void> => {
  await updateDoc(doc(db, 'rentals', rentalId), {
    status: 'return_requested',
    returnRequestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const completeReturnInspection = async (
  rentalId: string,
  itemId: string,
  securityDeposit: number,
  inspection: {
    actualReturnDate: string;
    damageReported: boolean;
    damageNotes: string | null;
    damageFee: number;
    lateFee: number;
  }
): Promise<void> => {
  const refundAmount = Math.max(0, securityDeposit - inspection.damageFee - inspection.lateFee);
  
  await updateDoc(doc(db, 'rentals', rentalId), {
    status: 'completed',
    actualReturnDate: inspection.actualReturnDate,
    damageReported: inspection.damageReported,
    damageNotes: inspection.damageNotes,
    damageFee: inspection.damageFee,
    lateFee: inspection.lateFee,
    depositRefundAmount: refundAmount,
    updatedAt: serverTimestamp(),
  });

  await updateItemStatus(itemId, inspection.damageReported ? 'damaged' : 'cleaning');
};

export const markRentalActive = async (rentalId: string): Promise<void> => {
  await updateDoc(doc(db, 'rentals', rentalId), {
    status: 'active',
    updatedAt: serverTimestamp(),
  });
};
