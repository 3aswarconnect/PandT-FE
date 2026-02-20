import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from "../../services/api";

export default function SignUpScreen({ navigation, route }) {
  const { userType } = route.params;
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


const handleSignUp = async () => {
  if (!email ||  !password || !confirmPassword) {
    Alert.alert("Error", "Please fill all required fields");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }
  console.log({ email, password });


  try {
    const res = await API.post("/auth/signup", {
      password,
      role: userType,
      email, // employer or worker

    });

 const { token, role} = res.data;

await AsyncStorage.setItem("userToken", token);
await AsyncStorage.setItem("userType", role);


    Alert.alert("Success", "Account created successfully!", [
      {
        text: "OK",
        onPress: () => {
          if (role === "employer") {
            navigation.replace("GiveJob");
          } else {
            navigation.replace("WantJob");
          }
        },
      },
    ]);
  } catch (error) {
    console.log(error.response?.data || error.message);
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
          {userType === 'employer' ? 'Sign up to post jobs' : 'Sign up to find jobs'}
        </Text>
      </View>

      <View style={styles.formSection}>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Enter email" keyboardType="email-address" value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Password *</Text>
        <TextInput style={styles.input} placeholder="Create password" secureTextEntry value={password} onChangeText={setPassword} />

        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
          <Text style={styles.signupBtnText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.loginBold}>Login</Text>
          </Text>
        </TouchableOpacity>
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
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 14, fontSize: 16, marginBottom: 16, backgroundColor: '#F5F5F5',
  },
  signupBtn: {
    backgroundColor: '#FF5722', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  signupBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginLink: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#777', marginBottom: 40 },
  loginBold: { color: '#FF5722', fontWeight: 'bold' },
});
