import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const MOCK_POSTED_JOBSs = [
  { id: '1', title: 'House Painting - 2 Rooms', category: 'Painting', amount: '₹1500', location: 'Koramangala', duration: '1 day', status: 'open', applicants: 3 },
  { id: '2', title: 'Delivery of Furniture', category: 'Delivery', amount: '₹800', location: 'Indiranagar', duration: '3 hours', status: 'in_progress', applicants: 1 },
];

export default function GiveJobScreen({ navigation }) {
  const [jobs] = useState(MOCK_POSTED_JOBSs);

  const getStatusColor = (status) => {
    if (status === 'open') return '#4CAF50';
    if (status === 'in_progress') return '#FF9800';
    return '#999';
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { job: item, isOwner: true })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status === 'in_progress' ? 'In Progress' : 'Open'}</Text>
        </View>
      </View>
      <Text style={styles.jobCategory}>{item.category}</Text>
      <View style={styles.jobMeta}>
        <Text style={styles.metaText}>💰 {item.amount}</Text>
        <Text style={styles.metaText}>📍 {item.location}</Text>
        <Text style={styles.metaText}>⏱ {item.duration}</Text>
      </View>
      <Text style={styles.applicants}>{item.applicants} applicant(s)</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No jobs posted yet</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostJob')}>
        <Text style={styles.fabText}>+ Post Job</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  list: { padding: 16 },
  jobCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  jobCategory: { fontSize: 13, color: '#FF5722', marginTop: 4 },
  jobMeta: { flexDirection: 'row', gap: 12, marginTop: 10 },
  metaText: { fontSize: 13, color: '#666' },
  applicants: { fontSize: 13, color: '#999', marginTop: 8 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#FF5722', paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 30, elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
