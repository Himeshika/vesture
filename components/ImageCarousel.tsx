import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex && roundIndex >= 0 && roundIndex < images.length) {
      setActiveIndex(roundIndex);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{ width, height: width }} // Square aspect ratio based on screen width
            contentFit="cover"
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.activeDot : inactiveDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const inactiveDot = { backgroundColor: 'rgba(255,255,255,0.4)' };

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.surfaceHighlight, // placeholder color
  },
  pagination: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.accent,
    width: 24,
  },
});
