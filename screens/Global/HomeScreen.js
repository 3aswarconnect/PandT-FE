import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      <View style={styles.header}>
        <Text style={styles.logo}>⚡ InstantJob</Text>
        <Text style={styles.tagline}>Get work done. Get working. Instantly.</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, styles.wantJobCard]}
          onPress={() => navigation.navigate('Login', { userType: 'worker' })}
          activeOpacity={0.9}
        >
          <View style={[styles.iconContainer, styles.workerIconBg]}>
            <Text style={styles.cardIcon}>🔨</Text>
          </View>
          <Text style={[styles.cardTitle, styles.wantJobTitle]}>Want Job</Text>
          <Text style={styles.cardDesc}>Find instant jobs near you and start earning today</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>Get Started →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.giveJobCard]}
          onPress={() => navigation.navigate('Login', { userType: 'employer' })}
          activeOpacity={0.9}
        >
          <View style={[styles.iconContainer, styles.employerIconBg]}>
            <Text style={styles.cardIcon}>📋</Text>
          </View>
          <Text style={[styles.cardTitle, styles.giveJobTitle]}>Hire</Text>
          <Text style={styles.cardDesc}>Post your job and get the right help at your doorstep.</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>Post Now →</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A', // Deep professional blue
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
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#BFDBFE', // Light blue
    marginTop: 8,
    letterSpacing: 0.3,
  },
  cardContainer: {
    flex: 2,
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minHeight: 260,
    justifyContent: 'space-between',
  },
  wantJobCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  giveJobCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(30,58,138,0.1)',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  workerIconBg: {
    backgroundColor: '#EFF6FF', // Light blue background
  },
  employerIconBg: {
    backgroundColor: '#F1F5F9', // Light gray background
  },
  cardIcon: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  wantJobTitle: {
    color: '#1E3A8A', // Deep blue
  },
  giveJobTitle: {
    color: '#0F172A', // Dark slate
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569', // Slate gray
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  cardFooter: {
    marginTop: 'auto',
    paddingTop: 12,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    opacity: 0.8,
  },
});