import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import API from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function GiveJobScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);


console.log("eswar",jobs)
  const getMyJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const res = await API.get("jobs/my-jobs/", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      console.log("API RESPONSE:", res.data);

      setJobs(res.data);   // 🔥 THIS WAS MISSING

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
useFocusEffect(
  useCallback(() => {
    getMyJobs();
  }, [])
);
  const getStatusColor = (status) => {
    if (status === 'open') return '#4CAF50';
    if (status === 'in_progress') return '#FF9800';
    return '#999';
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobStatus', { job: item, isOwner: true })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>
          {item.title ?? ''}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {item.status === 'in_progress' ? 'In Progress' : 'Open'}
          </Text>
        </View>
      </View>

      <Text style={styles.jobCategory}>
        {item.category ?? ''}
      </Text>

      <View style={styles.jobMeta}>
        <Text style={styles.metaText}>
          {`💰 ₹${item.amount ?? 0}`}
        </Text>

        <Text style={styles.metaText}>
          {`📍 ${item.location?.address ?? ''}`}
        </Text>

        <Text style={styles.metaText}>
          {`⏱ ${item.duration?.value ?? ''} ${item.duration?.unit ?? ''}`}
        </Text>
      </View>

      <Text style={styles.applicants}>
        {`${item.applications?.length ?? 0} applicant(s)`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item._id}
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
