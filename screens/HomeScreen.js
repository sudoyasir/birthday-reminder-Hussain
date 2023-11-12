// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const birthdayData = await AsyncStorage.multiGet(keys);
        const parsedBirthdays = birthdayData.map(([key, value]) => {
          const parsedValue = JSON.parse(value);
          parsedValue.key = key; // Include the key for easy deletion
          return parsedValue;
        });
        setBirthdays(parsedBirthdays);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
      }
    };

    fetchBirthdays();
  }, []);

  const calculateDaysUntilBirthday = (birthday) => {
    const today = new Date();
    const birthdayDate = new Date(birthday.date);
    birthdayDate.setFullYear(today.getFullYear()); // Set the year to the current year

    // Calculate the difference in days
    const timeDifference = birthdayDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return daysDifference >= 0 ? daysDifference : daysDifference + 365; // Consider the next year if the birthday has passed
  };

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthdayDate = new Date(birthday.date);
    const age = today.getFullYear() - birthdayDate.getFullYear();

    // Adjust age if the birthday hasn't occurred yet this year
    if (
      today.getMonth() < birthdayDate.getMonth() ||
      (today.getMonth() === birthdayDate.getMonth() && today.getDate() < birthdayDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  };

  const deleteBirthday = async (key) => {
    try {
      // Remove the birthday from AsyncStorage
      await AsyncStorage.removeItem(key);

      // Update the state to reflect the changes
      setBirthdays((prevBirthdays) => prevBirthdays.filter((birthday) => birthday.key !== key));
    } catch (error) {
      console.error('Error deleting birthday:', error);
    }
  };

  const confirmDelete = (key) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this birthday?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteBirthday(key),
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.key)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.daysUntilBirthday}>
          {calculateDaysUntilBirthday(item)} days until birthday
        </Text>
        <Text style={styles.age}>{calculateAge(item)} years old</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upcoming Birthdays</Text>
      {birthdays.length > 0 ? (
        <FlatList
          data={birthdays}
          renderItem={renderItem}
          keyExtractor={(item) => item.date}
        />
      ) : (
        <Text>No upcoming birthdays</Text>
      )}

      {/* Plus Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('AddBirthday')}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButtonText: {
    color: '#fff',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  daysUntilBirthday: {
    fontSize: 14,
    color: '#007bff',
  },
  age: {
    fontSize: 14,
    color: '#888',
  },
  plusButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 30,
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
