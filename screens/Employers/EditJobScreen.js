import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";

export default function EditJobScreen({ route, navigation }) {
  const { job } = route.params;

  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [category, setCategory] = useState(job.category);
  const [amount, setAmount] = useState(job.amount.toString());
  const [durationValue, setDurationValue] = useState(
    job.duration?.value?.toString()
  );
  const [durationUnit, setDurationUnit] = useState(job.duration?.unit);
  const [address, setAddress] = useState(job.location?.address);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const res = await API.put(
        `/jobs/${job._id}`,
        {
          title,
          description,
          category,
          amount: Number(amount),
          duration: {
            value: Number(durationValue),
            unit: durationUnit,
          },
          location: {
            address,
          },
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Job updated successfully");

     navigation.replace("JobStatus", {
  job: res.data.job,
  isOwner: true,
});
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Duration Value</Text>
      <TextInput
        style={styles.input}
        value={durationValue}
        onChangeText={setDurationValue}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Duration Unit</Text>
      <TextInput
        style={styles.input}
        value={durationUnit}
        onChangeText={setDurationUnit}
      />

      <Text style={styles.label}>Location Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Job</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },

  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});