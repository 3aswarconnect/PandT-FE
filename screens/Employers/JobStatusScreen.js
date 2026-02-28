import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

export default function JobStatusScreen({ navigation, route }) {
  const { job, isOwner } = route.params;
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    Alert.alert('Approve Worker', 'Approve this worker?', [
      { text: 'Cancel' },
      {
        text: 'Approve',
        onPress: () => {
          setApproved(true);
          Alert.alert('Approved!', 'Worker has been notified.');
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
            <Text style={styles.infoValue}>{`₹${job.amount}`}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>
              {`${job.duration?.value ?? ''} ${job.duration?.unit ?? ''}`}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>
              {job.status?.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>📍 Location</Text>
        <Text style={styles.sectionText}>
          {job.location?.address ?? 'Location not provided'}
        </Text>

        <Text style={styles.sectionTitle}>📝 Description</Text>
        <Text style={styles.sectionText}>
          {job.description ?? 'No description provided.'}
        </Text>
      </View>

      {isOwner && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>
            {`Applicants (${job.applications?.length ?? 0})`}
          </Text>

          <View style={styles.applicantCard}>
            <View>
              <Text style={styles.applicantName}>
                {job.applications?.length
                  ? 'Worker Applied'
                  : 'No applicants yet'}
              </Text>
            </View>

            {!approved && job.applications?.length > 0 ? (
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={handleApprove}
              >
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
            ) : approved ? (
              <View style={styles.approvedBadge}>
                <Text style={styles.approvedBadgeText}>Approved ✓</Text>
              </View>
            ) : null}
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
  categoryBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  categoryText: { fontSize: 12, color: '#FF5722', fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoItem: { alignItems: 'center', flex: 1 },
  infoLabel: { fontSize: 12, color: '#999' },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 12 },
  sectionText: { fontSize: 14, color: '#666', marginTop: 4, lineHeight: 20 },
  applicantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  applicantName: { fontSize: 16, fontWeight: '600', color: '#333' },
  approveBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  approveBtnText: { color: '#fff', fontWeight: '600' },
  approvedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  approvedBadgeText: { color: '#4CAF50', fontWeight: '600', fontSize: 13 },
});