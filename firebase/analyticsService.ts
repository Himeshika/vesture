import { getDocs, collection } from 'firebase/firestore';
import { db } from './config';
import { ItemStatus, RentalStatus } from '@/types';

export interface DashboardStats {
  totalRevenue: number;
  activeRentalsCount: number;
  pendingRequestsCount: number;
  totalItemsCount: number;
  rentalsByCategory: { category: string; count: number }[];
  itemsByStatus: { status: ItemStatus; count: number }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const rentalsSnap = await getDocs(collection(db, 'rentals'));
  const itemsSnap = await getDocs(collection(db, 'items'));
  
  let totalRevenue = 0;
  let activeRentalsCount = 0;
  let pendingRequestsCount = 0;
  
  const rentalsByCategoryMap: Record<string, number> = {};
  
  rentalsSnap.forEach(doc => {
    const data = doc.data();
    const status = data.status as RentalStatus;
    
    if (status === 'active' || status === 'completed') {
      totalRevenue += data.rentalPrice || 0;
    }
    
    if (['pending', 'approved', 'active', 'return_requested'].includes(status)) {
      activeRentalsCount++;
    }
    
    if (status === 'pending') {
      pendingRequestsCount++;
    }
    
    const category = data.itemCategory;
    if (category) {
      rentalsByCategoryMap[category] = (rentalsByCategoryMap[category] || 0) + 1;
    }
  });
  
  const totalItemsCount = itemsSnap.size;
  const itemsByStatusMap: Record<string, number> = {};
  
  itemsSnap.forEach(doc => {
    const data = doc.data();
    const status = data.status as ItemStatus;
    if (status) {
      itemsByStatusMap[status] = (itemsByStatusMap[status] || 0) + 1;
    }
  });
  
  const rentalsByCategory = Object.entries(rentalsByCategoryMap).map(([category, count]) => ({
    category,
    count,
  }));
  
  const itemsByStatus = Object.entries(itemsByStatusMap).map(([status, count]) => ({
    status: status as ItemStatus,
    count,
  }));
  
  return {
    totalRevenue,
    activeRentalsCount,
    pendingRequestsCount,
    totalItemsCount,
    rentalsByCategory,
    itemsByStatus,
  };
};
