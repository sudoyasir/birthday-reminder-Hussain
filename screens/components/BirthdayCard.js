// BirthdayCard.js
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const BirthdayCard = ({
  birthday,
  selectionMode,
  toggleSelectItem,
  selectedItems,
  deleteBirthday,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selectionMode && styles.selectionModeCard]}
      onPress={() => (selectionMode ? toggleSelectItem(birthday.key) : null)}
    >
      {selectionMode && (
        <TouchableOpacity
          style={styles.selectionCheckbox}
          onPress={() => toggleSelectItem(birthday.key)}
        >
          {selectedItems.includes(birthday.key) && (
            <View style={styles.selectedIndicator} />
          )}
        </TouchableOpacity>
      )}
      <Image source={{ uri: birthday.imageUri }} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{birthday.name}</Text>
        <Text style={styles.date}>{birthday.date}</Text>
        <Text style={styles.daysUntilBirthday}>
          {calculateDaysUntilBirthday(birthday)} days until birthday
        </Text>
        <Text style={styles.age}>{calculateAge(birthday)} years old</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BirthdayCard;
