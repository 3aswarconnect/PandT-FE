import React, { useState, useEffect } from "react";
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

export default function JobDetailScreen({ navigation, route }) {
  const { job, isOwner } = route.params;

  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // pending | accepted | rejected

  useEffect(() => {
    const checkIfApplied = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId || !job?.applications?.length) return;

        const myApp = job.applications.find(
          (a) =>
            (typeof a.worker === "string" ? a.worker : a.worker?._id) === userId
        );

        if (myApp) {
          setApplied(true);
          setApplicationStatus(myApp.status); // pending | accepted | rejected
        }
      } catch (err) {
        console.log("Check applied error:", err);
      }
    };

    checkIfApplied();
  }, [job]);

  const checkprofilestatus = async () => {
    console.log("calling")
    const token = await AsyncStorage.getItem("userToken");

    const res = await API.get("/auth/profile-status-worker", {
      headers: { authorization: `Bearer ${token}` },
    });

    if (!res.data.profileCompleted) {
      return false;
    } else {
      return true
    }
  };
  const handleApply = async () => {
const profileComplete = await checkprofilestatus();

if (!profileComplete) {
  navigation.navigate("ProfileScreen",{userType:"worker"});
  return;
}



    Alert.alert("Apply for Job", "Are you sure you want to apply?", [
      { text: "Cancel" },
      {
        text: "Apply",
        onPress: async () => {
          try {
            setLoading(true);
            const token = await AsyncStorage.getItem("userToken");

            await API.post(`/jobs/${job._id}/apply`, {}, {
              headers: { authorization: `Bearer ${token}` },
            });

            setApplied(true);
            setApplicationStatus("pending");
            Alert.alert("Success", "Application sent successfully!");
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Something went wrong");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
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
        <Text style={styles.sectionText}>{job.location?.address || "Not provided"}</Text>

        <Text style={styles.sectionTitle}>📝 Description</Text>
        <Text style={styles.sectionText}>{job.description || "No description provided."}</Text>

        <Text style={styles.sectionTitle}>👤 Posted By</Text>
        <Text style={styles.sectionText}>{job.employer?.name || "Employer"}</Text>
      </View>

      {/* ✅ Apply Button — only if not owner and not yet applied */}
      {!isOwner && !applied && (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleApply}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionBtnText}>Apply for this Job</Text>
          )}
        </TouchableOpacity>
      )}

      {/* ✅ Pending status */}
      {!isOwner && applied && applicationStatus === "pending" && (
        <View style={styles.pendingBox}>
          <Text style={styles.pendingText}>
            ⏳ Application sent. Waiting for employer approval...
          </Text>
        </View>
      )}

      {/* ✅ Rejected status */}
      {!isOwner && applied && applicationStatus === "rejected" && (
        <View style={styles.rejectedBox}>
          <Text style={styles.rejectedText}>
            ❌ Your application was not selected for this job.
          </Text>
        </View>
      )}

      {/* ✅ Accepted — Show Track Button */}
      {!isOwner && applied && applicationStatus === "accepted" && (
        <View>
          <View style={styles.acceptedBox}>
            <Text style={styles.acceptedTitle}>🎉 You got the job!</Text>
            <Text style={styles.acceptedSub}>
              Head to the location, carry your ID card, and share your OTP with the employer to start.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate("WorkerJobSocket", { jobId: job._id })}
          >
            <Text style={styles.trackBtnText}>📍 Track My Job</Text>
          </TouchableOpacity>
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
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  infoItem: { alignItems: "center", flex: 1 },
  infoLabel: { fontSize: 12, color: "#999" },
  infoValue: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginTop: 12 },
  sectionText: { fontSize: 14, color: "#666", marginTop: 4, lineHeight: 20 },

  actionBtn: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  actionBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  pendingBox: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  pendingText: { color: "#FF9800", fontSize: 15, textAlign: "center" },

  rejectedBox: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  rejectedText: { color: "#F44336", fontSize: 15, textAlign: "center" },

  acceptedBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  acceptedTitle: { fontSize: 18, fontWeight: "700", color: "#2E7D32" },
  acceptedSub: { fontSize: 14, color: "#555", marginTop: 6, lineHeight: 20 },

  trackBtn: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  trackBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});