import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from "../../services/api";
import * as Notifications from 'expo-notifications';

export default function SignUpScreen({ navigation, route }) {
  const { userType } = route.params;

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 🔹 SEND OTP
  const sendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Enter email first");
      return;
    }

    try {
      await API.post("/auth/send-otp", { email });
      setOtpSent(true);
      Alert.alert("Success", "OTP sent to your email");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
    }
  };

  // 🔹 VERIFY OTP
  const verifyOTP = async () => {
    if (!otp) {
      Alert.alert("Error", "Enter OTP");
      return;
    }

    try {
      await API.post("/auth/verify-otp", { email, otp });
      setOtpVerified(true);
      Alert.alert("Success", "Email verified successfully");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
    }
  };

  // 🔹 PUSH NOTIFICATIONS
  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
            const token = await AsyncStorage.getItem("userToken");

      const tokenData = await Notifications.getDevicePushTokenAsync();
      const fcmToken = tokenData.data;

          await API.post(
      `/${userType}/save-token`,
      { token: fcmToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    } catch (err) {
      console.log("Push registration error:", err);
    }
  };

  // 🔹 FINAL SIGNUP
  const handleSignUp = async () => {
    if (!otpVerified) {
      Alert.alert("Error", "Please verify your email first");
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/signup", {
        email,
        password,
        role: userType,
      });

      const { token, user } = res.data;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userType", user.role);
      await AsyncStorage.setItem("userId", user._id);

      await registerForPushNotifications();


      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.replace(
              userType === "employer" ? "GiveJob" : "WantJob"
            );
          },
        },
      ]);

    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.welcome}>Create Account</Text>
        <Text style={styles.subtitle}>
          {userType === 'employer'
            ? 'Sign up to post jobs'
            : 'Sign up to find jobs'}
        </Text>
      </View>

      <View style={styles.formSection}>

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {!otpVerified && (
          <TouchableOpacity style={styles.smallBtn} onPress={sendOTP}>
            <Text style={styles.smallBtnText}>
              {otpSent ? "Resend OTP" : "Send OTP"}
            </Text>
          </TouchableOpacity>
        )}

        {/* OTP INPUT */}
        {otpSent && !otpVerified && (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="6 digit OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity style={styles.smallBtn} onPress={verifyOTP}>
              <Text style={styles.smallBtnText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}

        {/* PASSWORD FIELDS */}
        {otpVerified && (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
              <Text style={styles.signupBtnText}>Create Account</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: {
    backgroundColor: '#FF5722',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcome: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#FFE0B2', marginTop: 4 },
  formSection: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  signupBtn: {
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signupBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  smallBtn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  smallBtnText: { color: '#fff', fontSize: 14 },
});