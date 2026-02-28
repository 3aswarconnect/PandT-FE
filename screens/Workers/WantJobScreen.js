import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import API from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const FILTERS = ["All", "Nearby", "Highest Pay", "Shortest Duration"];

export default function WantJobScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllJobs = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("userToken");

      let params = {};

      // 🔥 Filter mapping
      if (activeFilter === "Highest Pay") {
        params.sort = "pay_high";
      }

      if (activeFilter === "Shortest Duration") {
        params.sort = "duration_short";
      }

      if (activeFilter === "Nearby") {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          params.lat = loc.coords.latitude;
          params.lng = loc.coords.longitude;
          params.radius = 10; // 10km
        }
      }

      // 🔥 Search
      if (search.trim() !== "") {
        params.search = search.trim();
      }

      const res = await API.get("jobs/", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params,
      });

      setJobs(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Refresh on focus + filter/search change
  useFocusEffect(
    useCallback(() => {
      getAllJobs();
    }, [activeFilter, search])
  );

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() =>
        navigation.navigate("JobDetail", {
          job: item,
          isOwner: false,
        })
      }
    >
      <View style={styles.jobHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      <Text style={styles.jobTitle}>{item.title}</Text>

      <View style={styles.jobMeta}>
        <Text style={styles.amount}>💰 ₹{item.amount}</Text>

        <Text style={styles.metaText}>
          📍 {item.location?.address}
        </Text>

        <Text style={styles.metaText}>
          ⏱ {item.duration?.value} {item.duration?.unit}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.postedBy}>
          Posted by {item.employer?.name || "Employer"}
        </Text>

        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search by title, category, location..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF5722" />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No jobs found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  searchBar: {
    margin: 16,
    marginBottom: 8,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    fontSize: 15,
    elevation: 2,
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  filterChipActive: {
    backgroundColor: "#FF5722",
    borderColor: "#FF5722",
  },

  filterText: { fontSize: 12, color: "#555" },

  filterTextActive: { color: "#fff", fontWeight: "600" },

  list: { padding: 16, paddingTop: 8 },

  jobCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  categoryText: {
    fontSize: 12,
    color: "#FF5722",
    fontWeight: "600",
  },

  jobTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },

  jobMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  amount: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },

  metaText: {
    fontSize: 13,
    color: "#666",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  postedBy: {
    fontSize: 12,
    color: "#999",
  },

  applyBtn: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  applyBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 16,
  },
});