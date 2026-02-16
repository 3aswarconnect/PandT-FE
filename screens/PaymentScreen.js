import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function PaymentScreen({ navigation, route }) {
  const { job } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paid, setPaid] = useState(false);

  const METHODS = [
    { id: 'upi', label: 'UPI (GPay / PhonePe)', icon: '📱' },
    { id: 'cash', label: 'Cash on Completion', icon: '💵' },
    { id: 'wallet', label: 'App Wallet', icon: '👛' },
  ];

  const handlePay = () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    Alert.alert('Confirm Payment', `Pay ${job.amount} via ${paymentMethod}?`, [
      { text: 'Cancel' },
      {
        text: 'Pay Now',
        onPress: () => {
          setPaid(true);
        },
      },
    ]);
  };

  if (paid) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successAmount}>{job.amount}</Text>
        <Text style={styles.successSub}>for "{job.title}"</Text>
        <Text style={styles.successNote}>Thank you for using InstantJob!</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.popToTop()}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Job</Text>
          <Text style={styles.summaryValue}>{job.title}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>{job.duration}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{job.amount}</Text>
        </View>
      </View>

      <Text style={styles.methodTitle}>Select Payment Method</Text>
      {METHODS.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[styles.methodCard, paymentMethod === m.id && styles.methodCardActive]}
          onPress={() => setPaymentMethod(m.id)}
        >
          <Text style={styles.methodIcon}>{m.icon}</Text>
          <Text style={styles.methodLabel}>{m.label}</Text>
          <View style={[styles.radio, paymentMethod === m.id && styles.radioActive]} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
        <Text style={styles.payBtnText}>Pay {job.amount}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 3 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { fontSize: 14, color: '#999' },
  summaryValue: { fontSize: 14, color: '#333', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#FF5722' },
  methodTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 24, marginBottom: 12 },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 12, marginBottom: 10, elevation: 2,
    borderWidth: 2, borderColor: 'transparent',
  },
  methodCardActive: { borderColor: '#FF5722' },
  methodIcon: { fontSize: 24, marginRight: 12 },
  methodLabel: { fontSize: 15, color: '#333', flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd' },
  radioActive: { borderColor: '#FF5722', backgroundColor: '#FF5722' },
  payBtn: {
    backgroundColor: '#FF5722', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 24,
  },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  successIcon: { fontSize: 64 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 16 },
  successAmount: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50', marginTop: 8 },
  successSub: { fontSize: 14, color: '#999', marginTop: 4 },
  successNote: { fontSize: 14, color: '#777', marginTop: 20 },
  homeBtn: { backgroundColor: '#FF5722', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginTop: 30 },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
