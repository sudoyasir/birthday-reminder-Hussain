// AddBirthdayScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const AddBirthDayScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const handleAddBirthday = async () => {
    const key = `Birthday_${Date.now()}`;
    const birthday = {
      name,
      date: date.toISOString().split("T")[0], // Format date as 'YYYY-MM-DD'
      imageUri,
    };

    try {
      await AsyncStorage.setItem(key, JSON.stringify(birthday));
      console.log("Birthday added:", birthday);
    } catch (error) {
      console.error("Error saving birthday:", error);
    }

    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // Close the date picker on iOS
    setDate(currentDate);
  };

  // Check if the button should be disabled
  const isButtonDisabled = !imageUri || !name || !date;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a Birthday</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <View>
        <TouchableOpacity onPress={showDatepicker} style={styles.input}>
          <Text>{date.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.addButton, isButtonDisabled && styles.disabledButton]}
        onPress={handleAddBirthday}
        disabled={isButtonDisabled}
      >
        <FontAwesomeIcon icon={faCalendarPlus} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Add Birthday</Text>
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
    fontWeight: "bold",
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#757575",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    justifyContent: "center",
    marginTop: 16,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: "#b0b0b0", // Use a different color for disabled state
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  buttonIcon: {
    color: "#fff",
    fontSize: 20,
  },
});

export default AddBirthDayScreen;
