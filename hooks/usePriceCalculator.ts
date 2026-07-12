import { useMemo } from 'react';
import { ClothingItem } from '@/types';
import dayjs from 'dayjs';

interface UsePriceCalculatorReturn {
  days: number;
  rentalPrice: number;
  deposit: number;
  total: number;
}

export function usePriceCalculator(
  item: ClothingItem | null,
  startDate: string | null,
  endDate: string | null
): UsePriceCalculatorReturn {
  return useMemo(() => {
    if (!item || !startDate || !endDate) {
      return { days: 0, rentalPrice: 0, deposit: item?.securityDeposit || 0, total: 0 };
    }

    const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    
    // Only calculate positive days
    const validDays = Math.max(0, days);
    
    const rentalPrice = validDays * item.pricePerDay;
    const deposit = item.securityDeposit;
    const total = rentalPrice + deposit;

    return {
      days: validDays,
      rentalPrice,
      deposit,
      total,
    };
  }, [item, startDate, endDate]);
}
