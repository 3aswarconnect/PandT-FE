import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../../services/api";

const STATUS_COLORS = {
  pending: { bg: "#FFF8E1", text: "#F59E0B", icon: "time-outline" },
  accepted: { bg: "#E8F5E9", text: "#22C55E", icon: "checkmark-circle-outline" },
  rejected: { bg: "#FEECEC", text: "#EF4444", icon: "close-circle-outline" },
  completed: { bg: "#EEF2FF", text: "#6366F1", icon: "trophy-outline" },
};

const JOB_STATUS_COLORS = {
  open: { bg: "#E8F5E9", text: "#22C55E" },
  in_progress: { bg: "#FFF8E1", text: "#F59E0B" },
  completed: { bg: "#EEF2FF", text: "#6366F1" },
  cancelled: { bg: "#FEECEC", text: "#EF4444" },
};

export default function MyJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchMyJobs = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const token = await AsyncStorage.getItem("userToken");
      const res = await API.get(`/jobs/worker/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(res.data.jobs);
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  const filteredJobs = jobs.filter(job => {
    if (filter === "all") return true;
    return job.myApplicationStatus === filter;
  });

  const FILTERS = ["all", "pending", "accepted", "rejected", "completed"];

  const renderJobCard = ({ item }) => {
    const appStatus = STATUS_COLORS[item.myApplicationStatus] || STATUS_COLORS.pending;
    const jobStatus = JOB_STATUS_COLORS[item.status] || JOB_STATUS_COLORS.open;

    return (
      <View style={styles.card}>
        {/* Top row */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={[styles.jobStatusBadge, { backgroundColor: jobStatus.bg }]}>
            <Text style={[styles.jobStatusText, { color: jobStatus.text }]}>
              {item.status.replace("_", " ")}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.jobTitle}>{item.title}</Text>

        {/* Employer */}
        <View style={styles.row}>
          <Ionicons name="person-outline" size={14} color="#888" />
          <Text style={styles.metaText}>{item.employer?.name || "Employer"}</Text>
        </View>

        {/* Location */}
        {item.location?.address && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color="#888" />
            <Text style={styles.metaText} numberOfLines={1}>{item.location.address}</Text>
          </View>
        )}

        {/* Amount + Duration */}
        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Ionicons name="cash-outline" size={14} color="#22C55E" />
            <Text style={styles.infoChipText}>₹{item.amount}</Text>
          </View>
          <View style={styles.infoChip}>
            <Ionicons name="timer-outline" size={14} color="#6366F1" />
            <Text style={styles.infoChipText}>
              {item.duration?.value} {item.duration?.unit}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Application status */}

        {/* Application status */}
        <View style={styles.appStatusRow}>
          <View style={[styles.appStatusBadge, { backgroundColor: appStatus.bg }]}>
            <Ionicons name={appStatus.icon} size={14} color={appStatus.text} />
            <Text style={[styles.appStatusText, { color: appStatus.text }]}>
              Application: {item.myApplicationStatus}
            </Text>
          </View>
          {item.appliedAt && (
            <Text style={styles.dateText}>
              {new Date(item.appliedAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
              })}
            </Text>
          )}
        </View>

        {/* Track button - only for accepted jobs */}
        {item.myApplicationStatus === "accepted" && (
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate("WorkersJobSocket", { jobId: item._id, job: item })}
          >
            <Ionicons name="navigate-outline" size={16} color="#fff" />
            <Text style={styles.trackBtnText}>Track Job</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <TouchableOpacity onPress={() => fetchMyJobs(true)}>
          <Ionicons name="refresh-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading your jobs...</Text>
        </View>
      ) : filteredJobs.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="briefcase-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No jobs found</Text>
          <Text style={styles.emptySubtitle}>
            {filter === "all"
              ? "You haven't applied to any jobs yet."
              : `No ${filter} applications.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={item => item._id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchMyJobs(true)}
              colors={["#6366F1"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    elevation: 4,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },

  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 6,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterTabActive: { backgroundColor: "#6366F1" },
  filterText: { fontSize: 12, fontWeight: "600", color: "#888" },
  filterTextActive: { color: "#fff" },

  list: { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  categoryText: { fontSize: 11, fontWeight: "700", color: "#6366F1" },
  jobStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  jobStatusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },

  jobTitle: { fontSize: 16, fontWeight: "bold", color: "#1F2937", marginBottom: 6 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  metaText: { fontSize: 13, color: "#666", flex: 1 },

  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F9FAFB",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  infoChipText: { fontSize: 13, fontWeight: "600", color: "#333" },

  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },

  appStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 12,
  },
  trackBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  appStatusText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  dateText: { fontSize: 11, color: "#aaa" },

  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  loadingText: { color: "#888", marginTop: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#555", marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: "#aaa", textAlign: "center", paddingHorizontal: 40 },
});