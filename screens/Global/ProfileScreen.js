import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";
import { StyleSheet } from "react-native";

export default function ProfileScreen({ navigation,route }) {
  const {userType}=route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");
const pickImage = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "Camera permission is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ THIS
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  } catch (err) {
    console.log("Camera Error:", err);
  }
};

const handleSubmit = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const formData = new FormData();

    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("age", age);
    formData.append("location", location);

if (photo) {
  formData.append("photo", {
    uri: photo.uri,
    name: photo.fileName || "profile.jpg",
    type: photo.type === "image" ? "image/jpeg" : "image/jpeg",
  });
}   console.log(formData)
   await API.put(`/auth/${userType}/complete-profile`, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});
    
    Alert.alert("Success", "Profile Completed");

  } catch (error) {
  console.log("UPLOAD ERROR:", error.response?.data || error.message);
  Alert.alert("Error", error.response?.data?.message || "Upload failed");
}
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>Complete Your Profile</Text>

    <Text style={styles.label}>Name</Text>
    <TextInput
      style={styles.input}
      value={name}
      onChangeText={setName}
      placeholder="Enter your name"
      placeholderTextColor="#999"
    />

    <Text style={styles.label}>Phone</Text>
    <TextInput
      style={styles.input}
      value={phone}
      onChangeText={setPhone}
      keyboardType="phone-pad"
      placeholder="Enter phone number"
      placeholderTextColor="#999"
    />

    <Text style={styles.label}>Age</Text>
    <TextInput
      style={styles.input}
      value={age}
      onChangeText={setAge}
      keyboardType="numeric"
      placeholder="Enter your age"
      placeholderTextColor="#999"
    />

    <Text style={styles.label}>Location</Text>
    <TextInput
      style={styles.input}
      value={location}
      onChangeText={setLocation}
      placeholder="Enter your location"
      placeholderTextColor="#999"
    />

    <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
      <Text style={styles.photoButtonText}>📸 Take Live Photo</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.submitButtonText}>Submit</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#222",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#444",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  photoButton: {
    marginTop: 20,
    backgroundColor: "#e6f0ff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d6cdf",
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: "#2d6cdf",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});