import { useState, useEffect, useCallback } from 'react';
import { BlockedDateRange } from '@/types';
import { getItemRentals } from '@/firebase/rentalsService';
import Colors from '@/constants/Colors';
import dayjs from 'dayjs';

interface UseAvailabilityReturn {
  blockedRanges: BlockedDateRange[];
  markedDates: Record<string, any>;
  isLoading: boolean;
  isRangeAvailable: (start: string, end: string) => boolean;
}

export function useAvailability(itemId: string): UseAvailabilityReturn {
  const [blockedRanges, setBlockedRanges] = useState<BlockedDateRange[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const rentals = await getItemRentals(itemId);
      
      const ranges: BlockedDateRange[] = rentals.map(r => ({
        startDate: r.startDate,
        endDate: r.endDate,
      }));
      setBlockedRanges(ranges);

      const computedMarkedDates: Record<string, any> = {};
      
      ranges.forEach(range => {
        let current = dayjs(range.startDate);
        const end = dayjs(range.endDate);
        
        while (current.isBefore(end) || current.isSame(end, 'day')) {
          computedMarkedDates[current.format('YYYY-MM-DD')] = {
            disabled: true,
            disableTouchEvent: true,
            textColor: Colors.textMuted,
            color: Colors.surfaceHighlight, // Used for the subtle strikethrough/blocking styling in availability calendar
          };
          current = current.add(1, 'day');
        }
      });
      
      setMarkedDates(computedMarkedDates);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const isRangeAvailable = useCallback((start: string, end: string) => {
    const startStr = dayjs(start).format('YYYY-MM-DD');
    const endStr = dayjs(end).format('YYYY-MM-DD');
    
    // Returns false if there is an overlap with ANY blocked block
    return !blockedRanges.some(range => {
      // Overlap condition: start1 <= end2 AND end1 >= start2
      return startStr <= range.endDate && endStr >= range.startDate;
    });
  }, [blockedRanges]);

  return {
    blockedRanges,
    markedDates,
    isLoading,
    isRangeAvailable,
  };
}
