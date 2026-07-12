import { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'admin';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  profileImage: string | null;
  createdAt: Timestamp;
}

export type ItemStatus = 'available' | 'reserved' | 'rented' | 'cleaning' | 'damaged';

export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  category: string;
  size: string;
  color: string;
  images: string[];
  pricePerDay: number;
  securityDeposit: number;
  status: ItemStatus;
  ownerNotes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type RentalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'return_requested'
  | 'returned'
  | 'completed'
  | 'cancelled';

export interface Rental {
  id: string;

  itemId: string;
  itemName: string;
  itemImage: string;
  itemCategory: string;

  customerId: string;
  customerName: string;

  startDate: string;
  endDate: string;
  rentalDays: number;

  rentalPrice: number;
  securityDeposit: number;
  totalAmount: number;

  status: RentalStatus;

  requestedAt: Timestamp;
  approvedAt: Timestamp | null;
  rejectedReason: string | null;

  returnRequestedAt: Timestamp | null;
  actualReturnDate: string | null;
  lateDays: number | null;
  lateFee: number | null;
  damageReported: boolean;
  damageNotes: string | null;
  damageFee: number | null;
  depositRefundAmount: number | null;

  reviewed: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WishlistEntry {
  itemId: string;
  itemName: string;
  itemImage: string;
  itemCategory: string;
  pricePerDay: number;
  addedAt: Timestamp;
}

export interface Review {
  id: string;
  itemId: string;
  rentalId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export interface CategoryDoc {
  id: string;
  name: string;
  icon: string;
  createdAt: Timestamp;
}

export interface ItemFormData {
  name: string;
  description: string;
  category: string;
  size: string;
  color: string;
  images: string[];
  pricePerDay: string;
  securityDeposit: string;
  ownerNotes: string;
}

export interface BlockedDateRange {
  startDate: string;
  endDate: string;
}

// ─── Status color map ────────────────────────────────────────────────────────
// Used by StatusBadge and anywhere a status needs a semantic colour reference.
import Colors from '@/constants/Colors';

export const STATUS_COLORS: Record<ItemStatus | RentalStatus, string> = {
  // Inventory
  available: Colors.success,
  reserved: Colors.warning,
  rented: Colors.info,
  cleaning: Colors.accentLight,
  damaged: Colors.error,
  // Rental
  pending: Colors.warning,
  approved: Colors.info,
  rejected: Colors.error,
  active: Colors.success,
  return_requested: Colors.warning,
  returned: Colors.accentLight,
  completed: Colors.textMuted,
  cancelled: Colors.error,
};
