import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";

export default function JobStatusScreen({ route, navigation }) {
  const { job, isOwner } = route.params;
  const [applications, setApplications] = useState(job.applications || []);
  const [loadingId, setLoadingId] = useState(null);

  // ✅ Job is locked once someone is accepted / in progress
  const isJobLocked = job.status === "in_progress" || job.status === "completed";

  const handleDeleteJob = async () => {
    try {
      Alert.alert("Confirm Delete", "Are you sure you want to delete this job?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const token = await AsyncStorage.getItem("userToken");
            await API.delete(`/jobs/${job._id}`, {
              headers: { authorization: `Bearer ${token}` },
            });
            setTimeout(() => navigation.goBack(), 500);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  const handleAction = async (applicationId, action) => {
    try {
      setLoadingId(applicationId);
      const token = await AsyncStorage.getItem("userToken");

      await API.put(
        `/jobs/${job._id}/application`,
        { applicationId, action },
        { headers: { authorization: `Bearer ${token}` } }
      );

      // ✅ Update UI locally
      const updatedApps = applications.map((app) => {
        if (app._id === applicationId) return { ...app, status: action };
        if (action === "accepted") return { ...app, status: "rejected" };
        return app;
      });

      setApplications(updatedApps);
      Alert.alert("Success", `Application ${action}`);

      // ✅ If accepted, refresh screen state to lock edit/delete and show track
      if (action === "accepted") {
        // Trigger re-render by updating job status locally
        job.status = "in_progress";
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{job.category}</Text>
        </View>

        <Text style={styles.title}>{job.title}</Text>

        {/* ✅ Status Badge */}
        <View style={[styles.statusBadge, isJobLocked && styles.statusBadgeLocked]}>
          <Text style={styles.statusBadgeText}>
            {job.status === "in_progress" ? "🔒 In Progress" : job.status === "completed" ? "✅ Completed" : "🟢 Open"}
          </Text>
        </View>

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

        <Text style={styles.sectionTitle}>📍 Location</Text>
        <Text style={styles.sectionText}>{job.location?.address || "Not provided"}</Text>

        <Text style={styles.sectionTitle}>📝 Description</Text>
        <Text style={styles.sectionText}>{job.description || "No description provided"}</Text>

        {/* ✅ Delete — hidden when job is locked */}
        {isOwner && !isJobLocked && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteJob}>
            <Text style={styles.deleteBtnText}>Delete Job</Text>
          </TouchableOpacity>
        )}

        {/* ✅ Edit — hidden when job is locked */}
        {isOwner && !isJobLocked && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("EditJob", { job })}
          >
            <Text style={styles.editBtnText}>Edit Job</Text>
          </TouchableOpacity>
        )}

        {/* ✅ Track — shown when job is in_progress */}
        {isOwner && isJobLocked && job.status === "in_progress" && (
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate("EmployerJobSocket", { jobId: job._id })}
          >
            <Text style={styles.trackBtnText}>📍 Track Job</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ================= APPLICANTS ================= */}
      {isOwner && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Applicants ({applications.length})</Text>

          {applications.length === 0 && (
            <Text style={{ marginTop: 10, color: "#666" }}>No applicants yet</Text>
          )}

          {applications.map((app) => (
            <View key={app._id} style={styles.applicantCard}>
              <View>
                <Text style={styles.applicantName}>{app.worker?.name || "Worker"}</Text>
                <Text style={styles.statusText}>Status: {app.status}</Text>
              </View>

              {app.status === "pending" && !isJobLocked && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleAction(app._id, "accepted")}
                    disabled={loadingId === app._id}
                  >
                    {loadingId === app._id ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.approveBtnText}>Approve</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleAction(app._id, "rejected")}
                    disabled={loadingId === app._id}
                  >
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}

              {app.status === "accepted" && (
                <View style={styles.acceptedBadge}>
                  <Text style={styles.acceptedText}>Approved ✓</Text>
                </View>
              )}

              {app.status === "rejected" && (
                <View style={styles.rejectedBadge}>
                  <Text style={styles.rejectedText}>Rejected ✕</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 3 },
  categoryBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  categoryText: { fontSize: 12, color: "#FF5722", fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginTop: 12 },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeLocked: { backgroundColor: "#FFF3E0" },
  statusBadgeText: { fontSize: 12, fontWeight: "600", color: "#555" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  infoItem: { alignItems: "center", flex: 1 },
  infoLabel: { fontSize: 12, color: "#999" },
  infoValue: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginTop: 12 },
  sectionText: { fontSize: 14, color: "#666", marginTop: 4, lineHeight: 20 },
  applicantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  applicantName: { fontSize: 16, fontWeight: "600", color: "#333" },
  statusText: { fontSize: 13, color: "#666", marginTop: 4 },
  approveBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  approveBtnText: { color: "#fff", fontWeight: "600" },
  rejectBtn: {
    backgroundColor: "#F44336",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  rejectBtnText: { color: "#fff", fontWeight: "600" },
  acceptedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  acceptedText: { color: "#4CAF50", fontWeight: "600" },
  rejectedBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rejectedText: { color: "#F44336", fontWeight: "600" },
  deleteBtn: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteBtnText: { color: "#fff", fontWeight: "600" },
  editBtn: {
    marginTop: 12,
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editBtnText: { color: "#fff", fontWeight: "600" },
  trackBtn: {
    marginTop: 16,
    backgroundColor: "#FF5722",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  trackBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});