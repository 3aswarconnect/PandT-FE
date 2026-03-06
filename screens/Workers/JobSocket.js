import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";

export default function WorkerJobSocketScreen({ route }) {
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [progress, setProgress] = useState(0);
  const pollRef = useRef(null);

  // Fetch job and keep polling
  const fetchJob = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await API.get(`/jobs/worker/${jobId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setJob(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchJob();
    pollRef.current = setInterval(fetchJob, 5000); // poll every 5s
    return () => clearInterval(pollRef.current);
  }, []);

  // Stop polling once completed
  useEffect(() => {
    if (job?.jobCompletedAt) {
      clearInterval(pollRef.current);
    }
  }, [job?.jobCompletedAt]);

  // Progress bar ticker
  useEffect(() => {
    let interval;
    if (job?.jobStartedAt && !job?.jobCompletedAt) {
      interval = setInterval(() => {
        const totalMs =
          job.duration.unit === "minutes"
            ? job.duration.value * 60 * 1000
            : job.duration.unit === "hours"
            ? job.duration.value * 60 * 60 * 1000
            : job.duration.value * 24 * 60 * 60 * 1000;
        const elapsed = Date.now() - new Date(job.jobStartedAt).getTime();
        setProgress(Math.min((elapsed / totalMs) * 100, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [job?.jobStartedAt, job?.jobCompletedAt]);

  if (!job) return (
    <View style={styles.center}>
      <Text style={styles.loadingText}>Loading job...</Text>
    </View>
  );

  const step = job.jobCompletedAt ? 3 : job.otp?.verified ? 2 : 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.subtitle}>📍 {job.location?.address}</Text>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        {["Arrive", "Working", "Done"].map((label, i) => {
          const active = step === i + 1;
          const done   = step > i + 1;
          return (
            <React.Fragment key={label}>
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}>
                  <Text style={styles.stepDotText}>{done ? "✓" : i + 1}</Text>
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
              </View>
              {i < 2 && <View style={[styles.stepLine, done && styles.stepLineDone]} />}
            </React.Fragment>
          );
        })}
      </View>

      {/* STEP 1: Show OTP */}
      {step === 1 && (
        <>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>📋 What to do when you arrive</Text>
            {[
              ["🪪", "Carry your ID card (Aadhaar, Voter ID, or any govt. issued ID)."],
              ["🔢", "Show the OTP below to the employer to start the job."],
              ["⚠️",  "Do NOT share your OTP with anyone other than the employer."],
            ].map(([icon, text]) => (
              <View style={styles.instructionRow} key={icon}>
                <Text style={styles.instructionIcon}>{icon}</Text>
                <Text style={styles.instructionText}>{text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.otpCard}>
            <Text style={styles.otpLabel}>YOUR OTP</Text>
            <Text style={styles.otpCode}>{job.otp?.code}</Text>
            <Text style={styles.otpHint}>Show this to your employer</Text>
          </View>
        </>
      )}

      {/* STEP 2: In Progress */}
      {step === 2 && (
        <>
          <View style={styles.inProgressCard}>
            <Text style={styles.inProgressTitle}>🟢 Job In Progress</Text>
            <Text style={styles.inProgressSub}>OTP verified. Stay focused on your work!</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Time Progress</Text>
              <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressSub}>
              {job.duration.value} {job.duration.unit} total
            </Text>
          </View>
        </>
      )}

      {/* STEP 3: Completed */}
      {step === 3 && (
        <View style={styles.completedCard}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedText}>Job Completed!</Text>
          <Text style={styles.completedSub}>Great work! Payment will be processed shortly.</Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  center:           { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText:      { color: "#999", fontSize: 15 },

  title:            { fontSize: 22, fontWeight: "bold", color: "#333" },
  subtitle:         { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 20 },

  // Step indicator
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  stepItem:         { alignItems: "center", gap: 4 },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center", alignItems: "center",
  },
  stepDotActive:    { backgroundColor: "#6366F1" },
  stepDotDone:      { backgroundColor: "#22C55E" },
  stepDotText:      { color: "#fff", fontWeight: "700", fontSize: 12 },
  stepLabel:        { fontSize: 11, color: "#999", fontWeight: "600" },
  stepLabelActive:  { color: "#6366F1" },
  stepLine:         { flex: 1, height: 2, backgroundColor: "#E5E7EB", marginBottom: 14, marginHorizontal: 4 },
  stepLineDone:     { backgroundColor: "#22C55E" },

  // Instructions
  instructionCard: {
    backgroundColor: "#E3F2FD", borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: "#1976D2", marginBottom: 16,
  },
  instructionTitle: { fontSize: 15, fontWeight: "700", color: "#1565C0", marginBottom: 12 },
  instructionRow:   { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, gap: 8 },
  instructionIcon:  { fontSize: 18 },
  instructionText:  { fontSize: 14, color: "#555", flex: 1, lineHeight: 20 },

  // OTP
  otpCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 24,
    alignItems: "center", elevation: 3, marginBottom: 16,
  },
  otpLabel:  { fontSize: 12, color: "#999", fontWeight: "700", letterSpacing: 2 },
  otpCode:   { fontSize: 48, fontWeight: "900", color: "#1976D2", letterSpacing: 10, marginVertical: 12 },
  otpHint:   { fontSize: 13, color: "#666" },

  // In progress
  inProgressCard: {
    backgroundColor: "#E8F5E9", borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: "#4CAF50", marginBottom: 16,
  },
  inProgressTitle:  { fontSize: 16, fontWeight: "700", color: "#2E7D32" },
  inProgressSub:    { fontSize: 13, color: "#555", marginTop: 4 },

  progressCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, elevation: 2,
  },
  progressHeader:   { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  progressLabel:    { fontSize: 14, fontWeight: "600", color: "#333" },
  progressPct:      { fontSize: 14, fontWeight: "700", color: "#4CAF50" },
  progressBar:      { height: 12, backgroundColor: "#eee", borderRadius: 10, overflow: "hidden" },
  progressFill:     { height: 12, backgroundColor: "#4CAF50", borderRadius: 10 },
  progressSub:      { fontSize: 12, color: "#aaa", marginTop: 8, textAlign: "right" },

  // Completed
  completedCard: {
    backgroundColor: "#E8F5E9", borderRadius: 16, padding: 30,
    alignItems: "center", marginTop: 20,
  },
  completedEmoji:   { fontSize: 56 },
  completedText:    { fontSize: 24, fontWeight: "800", color: "#2E7D32", marginTop: 8 },
  completedSub:     { fontSize: 14, color: "#555", marginTop: 6, textAlign: "center" },
});