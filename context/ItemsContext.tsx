import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ClothingItem, ItemFormData, ItemStatus } from '@/types';
import { 
  getAllItems, 
  createItem as createItemService, 
  updateItem as updateItemService, 
  updateItemStatus as updateItemStatusService, 
  deleteItem as deleteItemService 
} from '@/firebase/itemsService';

interface ItemsContextType {
  items: ClothingItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  fetchItems: () => Promise<void>;
  refreshItems: () => Promise<void>;
  createItem: (data: ItemFormData) => Promise<string>;
  updateItem: (itemId: string, data: Partial<ItemFormData>) => Promise<void>;
  updateItemStatus: (itemId: string, status: ItemStatus) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  getItemById: (itemId: string) => ClothingItem | undefined;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedItems = await getAllItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshItems = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fetchedItems = await getAllItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Failed to refresh items:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (data: ItemFormData) => {
    const newId = await createItemService(data);
    await refreshItems();
    return newId;
  };

  const updateItem = async (itemId: string, data: Partial<ItemFormData>) => {
    await updateItemService(itemId, data);
    await refreshItems();
  };

  const updateItemStatus = async (itemId: string, status: ItemStatus) => {
    await updateItemStatusService(itemId, status);
    
    // Optimistic update
    setItems((prev) => 
      prev.map((item) => item.id === itemId ? { ...item, status } : item)
    );
  };

  const deleteItem = async (itemId: string) => {
    await deleteItemService(itemId);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const getItemById = (itemId: string) => {
    return items.find((item) => item.id === itemId);
  };

  return (
    <ItemsContext.Provider value={{
      items,
      isLoading,
      isRefreshing,
      fetchItems,
      refreshItems,
      createItem,
      updateItem,
      updateItemStatus,
      deleteItem,
      getItemById,
    }}>
      {children}
    </ItemsContext.Provider>
  );
};
