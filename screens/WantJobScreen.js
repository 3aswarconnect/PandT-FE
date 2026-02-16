import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';

const MOCK_JOBS = [
  { id: '1', title: 'House Painting - 2 Rooms', category: 'Painting', amount: '₹1500', location: 'Koramangala', duration: '1 day', postedBy: 'Rahul S.', distance: '1.2 km' },
  { id: '2', title: 'Delivery of Furniture', category: 'Delivery', amount: '₹800', location: 'Indiranagar', duration: '3 hours', postedBy: 'Priya M.', distance: '2.5 km' },
  { id: '3', title: 'Construction Helper', category: 'Construction', amount: '₹700', location: 'Whitefield', duration: '8 hours', postedBy: 'Suresh K.', distance: '4.1 km' },
  { id: '4', title: 'Plumbing Repair', category: 'Plumbing', amount: '₹600', location: 'HSR Layout', duration: '2 hours', postedBy: 'Amit D.', distance: '0.8 km' },
  { id: '5', title: 'Office Cleaning', category: 'Cleaning', amount: '₹400', location: 'MG Road', duration: '4 hours', postedBy: 'Neha R.', distance: '3.2 km' },
];

const FILTERS = ['All', 'Nearby', 'Highest Pay', 'Shortest Duration'];

export default function WantJobScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [jobs] = useState(MOCK_JOBS);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.category.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { job: item, isOwner: false })}
    >
      <View style={styles.jobHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <View style={styles.jobMeta}>
        <Text style={styles.amount}>💰 {item.amount}</Text>
        <Text style={styles.metaText}>📍 {item.location}</Text>
        <Text style={styles.metaText}>⏱ {item.duration}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.postedBy}>Posted by {item.postedBy}</Text>
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search jobs by title, category, location..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No jobs found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  searchBar: {
    margin: 16, marginBottom: 8, padding: 14, backgroundColor: '#fff',
    borderRadius: 12, fontSize: 15, elevation: 2,
  },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
  },
  filterChipActive: { backgroundColor: '#FF5722', borderColor: '#FF5722' },
  filterText: { fontSize: 12, color: '#555' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 16, paddingTop: 8 },
  jobCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  categoryText: { fontSize: 12, color: '#FF5722', fontWeight: '600' },
  distance: { fontSize: 12, color: '#999' },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginTop: 8 },
  jobMeta: { flexDirection: 'row', gap: 12, marginTop: 10 },
  amount: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
  metaText: { fontSize: 13, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  postedBy: { fontSize: 12, color: '#999' },
  applyBtn: { backgroundColor: '#FF5722', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  applyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
