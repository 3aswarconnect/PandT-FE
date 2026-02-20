import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";

const JOB_CATEGORIES = [
  "Construction",
  "Road Work",
  "Delivery",
  "Daily Wage",
  "Cleaning",
  "Painting",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Other",
];

export default function PostJobScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("hours"); const [workers, setWorkers] = useState("1");

  const [expiry, setExpiry] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const DURATION_UNITS = ["minutes", "hours", "days"];
  // ⭐ Get GPS location
  const handleDetectLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(loc.coords);

      const place = geocode[0];

      setCoords({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });

      setAddress(`${place.city || ""} ${place.region || ""}`);
    } catch (e) {
      Alert.alert("Error detecting location");
    } finally {
      setLoadingLocation(false);
    }
  };

  // ⭐ Post handler (API ready)
  const handlePost = async () => {
    if (!title || !category || !amount || !address || !duration) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    const payload = {
      title,
      category,
      description,
      amount: Number(amount),
      duration: {
        value: Number(durationValue),
        unit: durationUnit,
      }, workersNeeded: Number(workers),
      location: {
        address,
        ...coords,
      },
      expiresAt: expiry,
    };

    console.log("JOB PAYLOAD", payload);

    // TODO → call API later

    Alert.alert("Success", "Job posted!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Post a New Job</Text>

      <Text style={styles.label}>Job Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Category *</Text>
      <View style={styles.categoryGrid}>
        {JOB_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              category === cat && styles.categoryChipActive,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        multiline
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Payment Amount *</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ""))}
      />

      <Text style={styles.label}>Location *</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <TouchableOpacity style={styles.locBtn} onPress={handleDetectLocation}>
        {loadingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.locText}>Auto Detect Location</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Duration *</Text>

      <TextInput
        keyboardType="numeric"
        style={styles.input}
        placeholder="Enter duration"
        value={durationValue}
        onChangeText={(v) => setDurationValue(v.replace(/[^0-9]/g, ""))}
      />

      <View style={styles.unitRow}>
        {DURATION_UNITS.map((u) => (
          <TouchableOpacity
            key={u}
            style={[styles.unitChip, durationUnit === u && styles.unitChipActive]}
            onPress={() => setDurationUnit(u)}
          >
            <Text
              style={[
                styles.unitText,
                durationUnit === u && styles.unitTextActive,
              ]}
            >
              {u}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Workers Needed</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={workers}
        onChangeText={(v) => setWorkers(v.replace(/[^0-9]/g, ""))}
      />

      {/* <Text style={styles.label}>Expiry Time</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text>{expiry.toLocaleString()}</Text>
      </TouchableOpacity>

  {showPicker && (
  <DateTimePicker
    value={expiry}
    mode="datetime"
    display="default"
    onChange={(event, selectedDate) => {
      setShowPicker(false);

      if (event.type === "dismissed") return;
      if (selectedDate) setExpiry(selectedDate);
    }}
  />
)} */}

      <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
        <Text style={styles.postBtnText}>Post Job</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { marginTop: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    marginTop: 4,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryChipActive: { backgroundColor: "#FF5722", borderColor: "#FF5722" },
  categoryText: { fontSize: 13 },
  categoryTextActive: { color: "#fff" },
  postBtn: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  postBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  locBtn: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  locText: { color: "#fff" },
  unitRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  unitChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#F5F5F5",
  },
  unitChipActive: {
    backgroundColor: "#FF5722",
    borderColor: "#FF5722",
  },
  unitText: { fontSize: 13 },
  unitTextActive: { color: "#fff", fontWeight: "600" },
});