import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MY_JOBS = [
  { id: '1', title: 'House Painting', status: 'completed', amount: '₹1500', date: '15 Feb 2026' },
  { id: '2', title: 'Furniture Delivery', status: 'in_progress', amount: '₹800', date: '16 Feb 2026' },
];

export default function MyJobsScreen() {
  const getStatusStyle = (status) => ({
    color: status === 'completed' ? '#4CAF50' : '#FF9800',
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'capitalize',
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={MY_JOBS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={getStatusStyle(item.status)}>{item.status.replace('_', ' ')}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#FF5722' },
  date: { fontSize: 13, color: '#999' },
});
