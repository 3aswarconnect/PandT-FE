import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const JOB_CATEGORIES = [
  'Construction', 'Road Work', 'Delivery', 'Daily Wage', 'Cleaning',
  'Painting', 'Plumbing', 'Electrical', 'Carpentry', 'Other',
];

export default function PostJobScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [workers, setWorkers] = useState('1');

  const handlePost = () => {
    if (!title || !category || !amount || !location || !duration) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Mock post - replace with real API
    Alert.alert('Success', 'Job posted successfully! Workers nearby will be notified.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Post a New Job</Text>

      <Text style={styles.label}>Job Title *</Text>
      <TextInput style={styles.input} placeholder="e.g. Need 2 workers for house painting" value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Category *</Text>
      <View style={styles.categoryGrid}>
        {JOB_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the work in detail..."
        multiline numberOfLines={4}
        value={description} onChangeText={setDescription}
      />

      <Text style={styles.label}>Payment Amount (₹) *</Text>
      <TextInput style={styles.input} placeholder="e.g. 500" keyboardType="numeric" value={amount} onChangeText={setAmount} />

      <Text style={styles.label}>Location *</Text>
      <TextInput style={styles.input} placeholder="e.g. Koramangala, Bangalore" value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Duration *</Text>
      <TextInput style={styles.input} placeholder="e.g. 3 hours / 1 day" value={duration} onChangeText={setDuration} />

      <Text style={styles.label}>Number of Workers Needed</Text>
      <TextInput style={styles.input} placeholder="1" keyboardType="numeric" value={workers} onChangeText={setWorkers} />

      <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
        <Text style={styles.postBtnText}>Post Job</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 14, fontSize: 16, backgroundColor: '#F5F5F5',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#F5F5F5',
  },
  categoryChipActive: { backgroundColor: '#FF5722', borderColor: '#FF5722' },
  categoryText: { fontSize: 13, color: '#555' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  postBtn: {
    backgroundColor: '#FF5722', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 24,
  },
  postBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
