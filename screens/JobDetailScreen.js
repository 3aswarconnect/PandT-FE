import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function JobDetailScreen({ navigation, route }) {
  const { job, isOwner } = route.params;
  console.log(job)
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    Alert.alert("Apply for Job", "Are you sure you want to apply?", [
      { text: "Cancel" },
      {
        text: "Apply",
        onPress: () => {
          setApplied(true);
          Alert.alert("Applied!", "Waiting for employer approval.");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Category */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{job.category}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{job.title}</Text>

        {/* Payment + Duration */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Payment</Text>
            <Text style={styles.infoValue}>₹{job.amount}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>
              {job.duration?.value} {job.duration?.unit}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Location */}
        <Text style={styles.sectionTitle}>📍 Location</Text>
        <Text style={styles.sectionText}>
          {job.location?.address || "Not provided"}
        </Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>📝 Description</Text>
        <Text style={styles.sectionText}>
          {job.description || "No description provided."}
        </Text>

        {/* Employer */}
        <Text style={styles.sectionTitle}>👤 Posted By</Text>
        <Text style={styles.sectionText}>
          {job.employer?.name || "Employer"}
        </Text>
      </View>

      {/* Apply Button */}
      {!isOwner && !applied && (
        <TouchableOpacity style={styles.actionBtn} onPress={handleApply}>
          <Text style={styles.actionBtnText}>Apply for this Job</Text>
        </TouchableOpacity>
      )}

      {!isOwner && applied && (
        <View style={styles.pendingBox}>
          <Text style={styles.pendingText}>
            ⏳ Application sent. Waiting for approval...
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  categoryBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  categoryText: {
    fontSize: 12,
    color: "#FF5722",
    fontWeight: "600",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  infoItem: {
    alignItems: "center",
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#999",
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },

  sectionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },

  actionBtn: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  actionBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  pendingBox: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  pendingText: {
    color: "#FF9800",
    fontSize: 15,
    textAlign: "center",
  },
});