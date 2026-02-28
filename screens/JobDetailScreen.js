import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function JobDetailScreen({ navigation, route }) {
  const { job, isOwner } = route.params;
  const [applied, setApplied] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleApply = () => {
    Alert.alert('Apply for Job', 'Are you sure you want to apply?', [
      { text: 'Cancel' },
      { text: 'Apply', onPress: () => { setApplied(true); Alert.alert('Applied!', 'Waiting for employer approval.'); } },
    ]);
  };

  const handleApprove = () => {
    Alert.alert('Approve Worker', 'Approve this worker for the job?', [
      { text: 'Cancel' },
      {
        text: 'Approve', onPress: () => {
          setApproved(true);
          Alert.alert('Approved!', 'Worker has been notified.');
        },
      },
    ]);
  };

  const handlePayment = () => {
    navigation.navigate('Payment', { job });
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
            <Text style={styles.infoValue}>{job.amount}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{job.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{job.distance || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>📍 Location</Text>
        <Text style={styles.sectionText}>{job.location}</Text>

        <Text style={styles.sectionTitle}>📝 Description</Text>
        <Text style={styles.sectionText}>
          {job.description || 'No additional description provided. Contact the employer for more details.'}
        </Text>

        {job.postedBy && (
          <>
            <Text style={styles.sectionTitle}>👤 Posted By</Text>
            <Text style={styles.sectionText}>{job.postedBy}</Text>
          </>
        )}
      </View>

      {/* Worker view */}
      {!isOwner && !applied && (
        <TouchableOpacity style={styles.actionBtn} onPress={handleApply}>
          <Text style={styles.actionBtnText}>Apply for this Job</Text>
        </TouchableOpacity>
      )}

      {!isOwner && applied && !approved && (
        <View style={styles.pendingBox}>
          <Text style={styles.pendingText}>⏳ Application sent. Waiting for approval...</Text>
        </View>
      )}

      {!isOwner && approved && (
        <View>
          <View style={styles.approvedBox}>
            <Text style={styles.approvedText}>✅ You are approved! Head to the location.</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={handlePayment}>
            <Text style={styles.actionBtnText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Employer view */}
      {isOwner && (
        <View>
          <Text style={styles.sectionTitle}>Applicants ({job.applicants || 0})</Text>
          <View style={styles.applicantCard}>
            <View>
              <Text style={styles.applicantName}>Ravi Kumar</Text>
              <Text style={styles.applicantMeta}>⭐ 4.5 • 23 jobs done</Text>
            </View>
            {!approved ? (
              <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.approvedBadge}>
                <Text style={styles.approvedBadgeText}>Approved ✓</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 3 },
  categoryBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  categoryText: { fontSize: 12, color: '#FF5722', fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  infoItem: { alignItems: 'center', flex: 1 },
  infoLabel: { fontSize: 12, color: '#999' },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 12 },
  sectionText: { fontSize: 14, color: '#666', marginTop: 4, lineHeight: 20 },
  actionBtn: {
    backgroundColor: '#FF5722', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 20,
  },
  actionBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  pendingBox: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, marginTop: 20 },
  pendingText: { color: '#FF9800', fontSize: 15, textAlign: 'center' },
  approvedBox: { backgroundColor: '#E8F5E9', padding: 16, borderRadius: 12, marginTop: 20 },
  approvedText: { color: '#4CAF50', fontSize: 15, textAlign: 'center' },
  applicantCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2,
  },
  applicantName: { fontSize: 16, fontWeight: '600', color: '#333' },
  applicantMeta: { fontSize: 13, color: '#999', marginTop: 2 },
  approveBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  approveBtnText: { color: '#fff', fontWeight: '600' },
  approvedBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  approvedBadgeText: { color: '#4CAF50', fontWeight: '600', fontSize: 13 },
});
