import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";

export default function EmployerJobSocketScreen({ route, navigation }) {
  const { jobId } = route.params;

  const [job, setJob] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");

  useEffect(() => {
    fetchJob();
  }, []);

  useEffect(() => {
    let interval;
    if (job?.jobStartedAt && !job?.jobCompletedAt) {
      interval = setInterval(calculateProgress, 1000);
    }
    return () => clearInterval(interval);
  }, [job]);

  const fetchJob = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await API.get(`/jobs/${jobId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setJob(res.data);
      console.log("eswar", res)
    } catch (err) {
      Alert.alert("Error", "Could not load job details.");
    }
  };

  const verifyOtp = async () => {
    if (!otpInput || otpInput.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP.");
      return;
    }

    try {
      setVerifying(true);
      const token = await AsyncStorage.getItem("userToken");

      await API.put(
        `/jobs/${jobId}/verify-otp`,
        { otp: otpInput },
        { headers: { authorization: `Bearer ${token}` } }
      );

      Alert.alert("✅ OTP Verified", "Worker verified. Job has started!");
      fetchJob();
    } catch (error) {
      Alert.alert("❌ Verification Failed", error.response?.data?.message || "Wrong OTP. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const completeJob = async () => {
    Alert.alert("Complete Job", "Are you sure you want to mark this job as complete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            await API.put(`/jobs/${jobId}/complete`, {}, {
              headers: { authorization: `Bearer ${token}` },
            });
            Alert.alert("🎉 Job Completed!");
          } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Something went wrong.");
          }
        },
      },
    ]);
  };
const submitRating = async () => {

 const token = await AsyncStorage.getItem("userToken");

 await API.post(
  `/jobs/${jobId}/review`,
  { rating },
  { headers:{authorization:`Bearer ${token}`} }
 );

};
const submitComment = async () => {

 const token = await AsyncStorage.getItem("userToken");

 await API.post(
  `/jobs/${jobId}/comment`,
  { comment },
  { headers:{authorization:`Bearer ${token}`} }
 );

 Alert.alert("Review submitted");
};
  const calculateProgress = () => {
    if (!job?.jobStartedAt) return;
    const totalMs =
      job.duration.unit === "minutes"
        ? job.duration.value * 60 * 1000
        : job.duration.unit === "hours"
          ? job.duration.value * 60 * 60 * 1000
          : job.duration.value * 24 * 60 * 60 * 1000;

    const elapsed = Date.now() - new Date(job.jobStartedAt).getTime();
    setProgress(Math.min((elapsed / totalMs) * 100, 100));
  };

  if (!job) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.subtitle}>📍 {job.location?.address}</Text>

      {/* ✅ STEP 1: OTP Verification - Worker not yet verified */}
      {!job.otp?.verified && (
        <View style={styles.section}>
          {/* Instructions Card */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>⚠️ Before Accepting Worker</Text>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🪪</Text>
              <Text style={styles.instructionText}>
                Ask the worker to show their <Text style={styles.bold}>ID card</Text> and verify it matches their profile.
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🔢</Text>
              <Text style={styles.instructionText}>
                Ask for the <Text style={styles.bold}>6-digit OTP</Text> sent to the worker's phone. Only verify if both match.
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🚫</Text>
              <Text style={styles.instructionText}>
                <Text style={styles.bold}>Do NOT start the job</Text> if ID or OTP doesn't match. Contact support.
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Enter Worker OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            value={otpInput}
            onChangeText={setOtpInput}
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity
            style={[styles.button, verifying && styles.buttonDisabled]}
            onPress={verifyOtp}
            disabled={verifying}
          >
            <Text style={styles.buttonText}>{verifying ? "Verifying..." : "✅ Verify OTP & Start Job"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ STEP 2: Job in progress */}
      {job.otp?.verified && !job.jobCompletedAt && (
        
        <View style={styles.section}>
          <View style={styles.inProgressCard}>
            <Text style={styles.inProgressTitle}>🟢 Job In Progress</Text>
            <Text style={styles.inProgressSub}>Worker is on the job. Track progress below.</Text>
          </View>

          <Text style={styles.label}>Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>

          <TouchableOpacity style={styles.completeBtn} onPress={completeJob}>
            <Text style={styles.buttonText}>🏁 Mark Job as Complete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ STEP 3: Completed */}
      {job.jobCompletedAt && (
        <View style={styles.completedCard}>
          <Text style={styles.completedText}>✅ Job Completed Successfully!</Text>
        </View>
      )}
      
      {/* step 4 for comment and reviews */}
    {job.jobCompletedAt && (
  <View style={styles.reviewSection}>

    <Text style={styles.reviewTitle}>Rate Worker</Text>

    <View style={styles.starRow}>
      {[1,2,3,4,5].map(star => (
        <TouchableOpacity key={star} onPress={()=>setRating(star)}>
          <Text style={styles.star}>
            {star <= rating ? "⭐" : "☆"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <TextInput
      placeholder="Write comment (optional)"
      value={comment}
      onChangeText={setComment}
      style={styles.commentInput}
      multiline
    />

    <TouchableOpacity
      style={styles.submitReviewBtn}
      onPress={async () => {
        await submitRating();
        await submitComment();
      }}
    >
      <Text style={styles.submitReviewText}>Submit</Text>
      <Text style={styles.arrowIcon}>➜</Text>
    </TouchableOpacity>

  </View>
)}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 16 },
  section: { marginTop: 8 },
  label: { fontSize: 15, fontWeight: "600", color: "#333", marginTop: 20, marginBottom: 8 },

  instructionCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FFA000",
    marginBottom: 8,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E65100",
    marginBottom: 12,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  instructionIcon: { fontSize: 18 },
  instructionText: { fontSize: 14, color: "#555", flex: 1, lineHeight: 20 },
  bold: { fontWeight: "700", color: "#333" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    backgroundColor: "#fff",
    letterSpacing: 4,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#90CAF9" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  inProgressCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  inProgressTitle: { fontSize: 16, fontWeight: "700", color: "#2E7D32" },
  inProgressSub: { fontSize: 13, color: "#555", marginTop: 4 },

  progressBar: {
    height: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  progressText: { fontSize: 13, color: "#666", marginTop: 6, textAlign: "right" },

  completeBtn: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  completedCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  completedText: { fontSize: 18, fontWeight: "700", color: "#2E7D32" },
  reviewSection: {
  marginTop: 20,
  backgroundColor: "#fff",
  padding: 16,
  borderRadius: 14,
},

reviewTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
  marginBottom: 10,
},

starRow: {
  flexDirection: "row",
  justifyContent: "center",
  marginVertical: 10,
},

star: {
  fontSize: 34,
  marginHorizontal: 6,
},

commentInput: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  padding: 12,
  marginTop: 10,
  backgroundColor: "#fafafa",
  minHeight: 60,
},

submitReviewBtn: {
  marginTop: 12,
  backgroundColor: "#1976D2",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
},

submitReviewText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

arrowIcon: {
  fontSize: 18,
  marginLeft: 6,
  color: "#fff",
},
});
