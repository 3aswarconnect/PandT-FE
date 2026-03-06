import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";

export default function WorkerJobSocketScreen({ route }) {
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [progress, setProgress] = useState(0);

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
    const token = await AsyncStorage.getItem("userToken");
    const res = await API.get(`/jobs/${jobId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    setJob(res.data.job);
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

      {/* ✅ STEP 1: Show OTP to employer */}
      {!job.otp?.verified && (
        <View>
          {/* Instructions Card */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>📋 What to do when you arrive</Text>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🪪</Text>
              <Text style={styles.instructionText}>
                Carry your <Text style={styles.bold}>ID card</Text> (Aadhaar, Voter ID, or any govt. issued ID). The employer will verify it.
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🔢</Text>
              <Text style={styles.instructionText}>
                Show the <Text style={styles.bold}>OTP below</Text> to the employer. They will enter it to start the job.
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>⚠️</Text>
              <Text style={styles.instructionText}>
                <Text style={styles.bold}>Do NOT share your OTP</Text> with anyone other than the employer at the job site.
              </Text>
            </View>
          </View>

          {/* OTP Display */}
          <View style={styles.otpCard}>
            <Text style={styles.otpLabel}>Your OTP</Text>
            <Text style={styles.otpCode}>{job.otp?.code}</Text>
            <Text style={styles.otpHint}>Show this to your employer</Text>
          </View>
        </View>
      )}

      {/* ✅ STEP 2: Job In Progress */}
      {job.otp?.verified && !job.jobCompletedAt && (
        <View>
          <View style={styles.inProgressCard}>
            <Text style={styles.inProgressTitle}>🟢 Job Started!</Text>
            <Text style={styles.inProgressSub}>OTP verified. Focus on your work.</Text>
          </View>

          <Text style={styles.label}>Your Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
        </View>
      )}

      {/* ✅ STEP 3: Completed */}
      {job.jobCompletedAt && (
        <View style={styles.completedCard}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedText}>Job Completed!</Text>
          <Text style={styles.completedSub}>Great work! Payment will be processed shortly.</Text>
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
  label: { fontSize: 15, fontWeight: "600", color: "#333", marginTop: 20, marginBottom: 8 },

  instructionCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1976D2",
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1565C0",
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

  otpCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 3,
    marginBottom: 16,
  },
  otpLabel: { fontSize: 14, color: "#999", fontWeight: "600", letterSpacing: 1 },
  otpCode: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1976D2",
    letterSpacing: 8,
    marginVertical: 12,
  },
  otpHint: { fontSize: 13, color: "#666" },

  inProgressCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    marginBottom: 16,
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

  completedCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
  },
  completedEmoji: { fontSize: 48 },
  completedText: { fontSize: 22, fontWeight: "800", color: "#2E7D32", marginTop: 8 },
  completedSub: { fontSize: 14, color: "#555", marginTop: 6, textAlign: "center" },
});