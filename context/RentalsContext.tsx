import React, { createContext, useState, useCallback, ReactNode, useContext, useEffect } from 'react';
import { Rental, ClothingItem } from '@/types';
import { getCustomerRentals, createRentalRequest as createRentalService, requestReturn as requestReturnService } from '@/firebase/rentalsService';
import { AuthContext } from './AuthContext';

interface RentalsContextType {
  myRentals: Rental[];
  isLoading: boolean;
  fetchMyRentals: () => Promise<void>;
  createRentalRequest: (item: ClothingItem, startDate: string, endDate: string) => Promise<string>;
  requestReturn: (rentalId: string) => Promise<void>;
}

export const RentalsContext = createContext<RentalsContextType | undefined>(undefined);

export const RentalsProvider = ({ children }: { children: ReactNode }) => {
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const fetchMyRentals = useCallback(async () => {
    if (!authContext?.user || authContext.role !== 'customer') {
      setMyRentals([]);
      return;
    }

    setIsLoading(true);
    try {
      const rentals = await getCustomerRentals(authContext.user.uid);
      setMyRentals(rentals);
    } catch (error) {
      console.error('Failed to fetch my rentals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authContext?.user, authContext?.role]);

  // Keep in sync when user logs in/out or role changes
  useEffect(() => {
    if (authContext?.user && authContext?.role === 'customer') {
      fetchMyRentals();
    } else {
      setMyRentals([]);
    }
  }, [authContext?.user, authContext?.role, fetchMyRentals]);

  const createRentalRequest = async (item: ClothingItem, startDate: string, endDate: string) => {
    if (!authContext?.userDoc) throw new Error('User must be logged in to create a rental request.');
    
    const rentalId = await createRentalService(item, authContext.userDoc, startDate, endDate);
    await fetchMyRentals();
    return rentalId;
  };

  const requestReturn = async (rentalId: string) => {
    await requestReturnService(rentalId);
    
    // Optimistic cache update
    setMyRentals((prev) => 
      prev.map(rental => rental.id === rentalId ? { ...rental, status: 'return_requested' as const } : rental)
    );
  };

  return (
    <RentalsContext.Provider value={{
      myRentals,
      isLoading,
      fetchMyRentals,
      createRentalRequest,
      requestReturn
    }}>
      {children}
    </RentalsContext.Provider>
  );
};
