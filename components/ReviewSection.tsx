import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Review } from '@/types';
import { getItemReviews } from '@/firebase/reviewsService';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ReviewSectionProps {
  itemId: string;
}

export default function ReviewSection({ itemId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getItemReviews(itemId);
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [itemId]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name="star"
          size={14}
          color={i <= rating ? Colors.accent : Colors.border}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reviews yet. Be the first to rent this item!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews ({reviews.length})</Text>
      <View style={styles.list}>
        {reviews.map((review) => {
          // Convert firestore timestamp if needed
          const date = review.createdAt?.toDate 
            ? dayjs(review.createdAt.toDate()).fromNow() 
            : '';
            
          return (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.header}>
                <Text style={styles.name}>{review.customerName}</Text>
                {renderStars(review.rating)}
              </View>
              <Text style={styles.comment}>{review.comment}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
  },
  loadingContainer: {
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusMd,
    marginHorizontal: Spacing.screenPadding,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontStyle: 'italic',
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Spacing.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  comment: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  date: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
});
