import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5722" />
      <View style={styles.header}>
        <Text style={styles.logo}>⚡ InstantJob</Text>
        <Text style={styles.tagline}>Get work done. Get working. Instantly.</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, styles.wantJobCard]}
          onPress={() => navigation.navigate('Login', { userType: 'worker' })}
          activeOpacity={0.85}
        >
          <Text style={styles.cardIcon}>🔨</Text>
          <Text style={styles.cardTitle}>Want Job</Text>
          <Text style={styles.cardDesc}>Find instant jobs near you and start earning today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.giveJobCard]}
          onPress={() => navigation.navigate('Login', { userType: 'employer' })}
          activeOpacity={0.85}
        >
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Give Job</Text>
          <Text style={styles.cardDesc}>Post a job and get workers instantly at your doorstep</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5722',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: '#FFE0B2',
    marginTop: 8,
  },
  cardContainer: {
    flex: 2,
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    alignItems: 'flex-start',
    paddingTop: 40,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minHeight: 220,
  },
  wantJobCard: {
    backgroundColor: '#fff',
  },
  giveJobCard: {
    backgroundColor: '#FFF3E0',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
  },
});
