import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import dayjs from 'dayjs';

interface AvailabilityCalendarProps {
  markedDates: Record<string, any>;
  onDateSelect: (date: string) => void;
  startDate: string | null;
  endDate: string | null;
}

export default function AvailabilityCalendar({
  markedDates,
  onDateSelect,
  startDate,
  endDate,
}: AvailabilityCalendarProps) {
  
  // Merge blocked dates with selected range for visual display
  const computedMarks = { ...markedDates };
  
  if (startDate) {
    computedMarks[startDate] = {
      ...computedMarks[startDate],
      startingDay: true,
      color: Colors.primary,
      textColor: Colors.background,
    };
  }
  if (endDate) {
    computedMarks[endDate] = {
      ...computedMarks[endDate],
      endingDay: true,
      color: Colors.primary,
      textColor: Colors.background,
    };
  }
  
  if (startDate && endDate) {
    let current = dayjs(startDate).add(1, 'day');
    const end = dayjs(endDate);
    
    while (current.isBefore(end)) {
      const dateStr = current.format('YYYY-MM-DD');
      // If a date in range was somehow blocked, we'll overwrite it to show the error state or just override it.
      // useAvailability logic warns/prevents this, so it should be fine.
      computedMarks[dateStr] = {
        color: `${Colors.primary}80`, // semi-transparent selection
        textColor: Colors.background,
      };
      current = current.add(1, 'day');
    }
  }

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Rental Dates</Text>
      <View style={styles.calendarWrapper}>
        <CalendarList
          horizontal
          pagingEnabled
          minDate={today}
          markingType={'period'}
          markedDates={computedMarks}
          onDayPress={(day: any) => onDateSelect(day.dateString)}
          theme={{
            backgroundColor: Colors.background,
            calendarBackground: Colors.background,
            textSectionTitleColor: Colors.textSecondary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: Colors.background,
            todayTextColor: Colors.accent,
            dayTextColor: Colors.textPrimary,
            textDisabledColor: Colors.textMuted,
            dotColor: Colors.accent,
            selectedDotColor: Colors.background,
            arrowColor: Colors.primary,
            monthTextColor: Colors.textPrimary,
            textDayFontFamily: Typography.primary,
            textMonthFontFamily: Typography.primary,
            textMonthFontWeight: 'bold',
            textDayHeaderFontFamily: Typography.primary,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.screenPadding,
  },
  calendarWrapper: {
    height: 350,
  }
});
