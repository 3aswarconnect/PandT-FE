import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, route }) {
  const { userType } = route.params;
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    // Mock login - replace with real API
    await AsyncStorage.setItem('userToken', 'mock-token');
    await AsyncStorage.setItem('userType', userType);
    await AsyncStorage.setItem('userPhone', phone);

    if (userType === 'employer') {
      navigation.replace('GiveJob');
    } else {
      navigation.replace('WantJob');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topSection}>
        <Text style={styles.welcome}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          {userType === 'employer' ? 'Login to post jobs' : 'Login to find jobs'}
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp', { userType })}>
          <Text style={styles.signupLink}>
            Don't have an account? <Text style={styles.signupBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: {
    backgroundColor: '#FF5722',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcome: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#FFE0B2', marginTop: 4 },
  formSection: { flex: 1, padding: 24, paddingTop: 32 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
  },
  loginBtn: {
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupLink: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#777' },
  signupBold: { color: '#FF5722', fontWeight: 'bold' },
});
