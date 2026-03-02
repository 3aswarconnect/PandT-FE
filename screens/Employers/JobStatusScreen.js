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

export default function JobStatusScreen({ route, navigation }) 
{  const { job, isOwner } = route.params;
  console.log("job stats",job)
  const [applications, setApplications] = useState(job.applications || []);
  const [loadingId, setLoadingId] = useState(null);


  const handleDeleteJob = async () => {
  try {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this job?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const token = await AsyncStorage.getItem("userToken");

            await API.delete(`/jobs/${job._id}`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });


            // 👇 Go back after delete
 setTimeout(() => {
              navigation.goBack();
            }, 500);
          },
        },
      ]
    );
  } catch (error) {
    Alert.alert(
      "Error",
      error.response?.data?.message || "Something went wrong"
    );
  }
};
  // ✅ Approve / Reject Handler
  const handleAction = async (applicationId, action) => {
    try {
      setLoadingId(applicationId);

      const token = await AsyncStorage.getItem("userToken");

      await API.put(
        `/jobs/${job._id}/application`,
        {
          applicationId,
          action, // "accepted" or "rejected"
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Update UI locally (instant update without reload)
      const updatedApps = applications.map((app) => {
        if (app._id === applicationId) {
          return { ...app, status: action };
        }

        // If accepted, reject others automatically
        if (action === "accepted") {
          return { ...app, status: "rejected" };
        }

        return app;
      });

      setApplications(updatedApps);

      Alert.alert("Success", `Application ${action}`);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
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
        <Text style={styles.sectionText}>
          {job.location?.address || "Not provided"}
        </Text>

        <Text style={styles.sectionTitle}>📝 Description</Text>
        <Text style={styles.sectionText}>
          {job.description || "No description provided"}
        </Text>
        {isOwner && (
  <TouchableOpacity
    style={styles.deleteBtn}
    onPress={handleDeleteJob}
  >
    <Text style={styles.deleteBtnText}>Delete Job</Text>
  </TouchableOpacity>
)}
      </View>

      {/* ================= APPLICANTS ================= */}
      {isOwner && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>
            Applicants ({applications.length})
          </Text>

          {applications.length === 0 && (
            <Text style={{ marginTop: 10, color: "#666" }}>
              No applicants yet
            </Text>
          )}

          {applications.map((app) => (
            <View key={app._id} style={styles.applicantCard}>
              <View>
                <Text style={styles.applicantName}>
                  {app.worker?.name || "Worker"}
                </Text>
                <Text style={styles.statusText}>
                  Status: {app.status}
                </Text>
              </View>

              {/* Pending Actions */}
              {app.status === "pending" && (
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

              {/* Accepted Badge */}
              {app.status === "accepted" && (
                <View style={styles.acceptedBadge}>
                  <Text style={styles.acceptedText}>Approved ✓</Text>
                </View>
              )}

              {/* Rejected Badge */}
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

  infoItem: { alignItems: "center", flex: 1 },

  infoLabel: { fontSize: 12, color: "#999" },

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
    fontSize: 16,
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

  applicantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  statusText: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  approveBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  approveBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  rejectBtn: {
    backgroundColor: "#F44336",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },

  rejectBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  acceptedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  acceptedText: {
    color: "#4CAF50",
    fontWeight: "600",
  },

  rejectedBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  rejectedText: {
    color: "#F44336",
    fontWeight: "600",
  },
  deleteBtn: {
  marginTop: 20,
  backgroundColor: "#000",
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
},

deleteBtnText: {
  color: "#fff",
  fontWeight: "600",
},
});