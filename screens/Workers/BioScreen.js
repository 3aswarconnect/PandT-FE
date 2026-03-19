import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";

export default function BioScreen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("userToken");

    const res = await API.get("/auth/workers/profile", {
      headers: { authorization: `Bearer ${token}` },
    });

    setData(res.data);
  };

  if (!data) return <ActivityIndicator style={{ marginTop: 50 }} />;

  const { worker, avgRating, totalReviews } = data;

  return (
    <ScrollView style={styles.container}>
      
      {/* 🔥 PROFILE HEADER */}
      <View style={styles.card}>
        <Image source={{ uri: worker.photo }} style={styles.image} />

        <Text style={styles.name}>{worker.name}</Text>
        <Text style={styles.sub}>Age: {worker.age}</Text>
        <Text style={styles.sub}>📞 {worker.phone}</Text>

        <View style={styles.ratingBox}>
          <Text style={styles.rating}>⭐ {avgRating}</Text>
          <Text style={styles.reviewCount}>
            ({totalReviews} reviews)
          </Text>
        </View>
      </View>

      {/* 🔥 SKILLS */}
      <View style={styles.section}>
        <Text style={styles.title}>Skills</Text>
        <Text style={styles.text}>
          {worker.skills?.join(", ") || "No skills added"}
        </Text>
      </View>

      {/* 🔥 JOB HISTORY */}
      <View style={styles.section}>
        <Text style={styles.title}>Job History</Text>

        {worker.jobs.length === 0 && (
          <Text style={styles.text}>No jobs yet</Text>
        )}

        {worker.jobs.map((j, index) => (
          <View key={index} style={styles.jobCard}>
            <Text style={styles.jobTitle}>
              {j.job?.title || "Job"}
            </Text>

            <Text>Status: {j.status}</Text>

            {j.rating && (
              <Text>⭐ {j.rating}</Text>
            )}

            {j.comment && (
              <Text style={{ color: "#666" }}>
                💬 {j.comment}
              </Text>
            )}
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  card: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    margin: 16,
    borderRadius: 16,
    elevation: 3,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  name: { fontSize: 20, fontWeight: "bold" },
  sub: { color: "#666", marginTop: 4 },

  ratingBox: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },

  rating: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA000",
  },

  reviewCount: {
    marginLeft: 6,
    color: "#666",
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  text: {
    color: "#555",
  },

  jobCard: {
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },

  jobTitle: {
    fontWeight: "600",
  },
});