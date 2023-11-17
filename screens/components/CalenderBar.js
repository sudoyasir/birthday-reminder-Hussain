// Import necessary libraries
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Create a new component for the vertical calendar bar
const CalendarBar = ({ birthdays }) => {
  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.calendarHeading}>Upcoming Birthdays</Text>
      {birthdays.map((birthday) => (
        <View key={birthday.key} style={styles.calendarItem}>
          <Text style={styles.calendarDate}>{birthday.date}</Text>
          <Text style={styles.calendarName}>{birthday.name}</Text>
        </View>
      ))}
    </View>
  );
};

// Styles for the CalendarBar component
const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "#44475a",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  calendarHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  calendarItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  calendarDate: {
    fontSize: 14,
    color: "#6272a4",
    marginRight: 8,
  },
  calendarName: {
    fontSize: 14,
    color: "#fff",
  },
});

export default CalendarBar;
