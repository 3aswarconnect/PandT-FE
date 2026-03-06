import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation, route }) {
  const { userType } = route.params;
  console.log(userType);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          navigation.replace("Login", { userType: "employer" });
        },
      },
    ]);
  };

  const SettingItem = ({ icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        <Ionicons name={icon} size={22} color={color || "#333"} />
        <Text style={[styles.itemText, color && { color }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <SettingItem
          icon="person-outline"
          title="Update Profile"
          onPress={() => navigation.navigate("ProfileScreen")}
        />

        {/* My Jobs - visible only for workers */}
        {userType === "worker" && (
          <SettingItem
            icon="briefcase-outline"
            title="My Jobs"
            onPress={() => navigation.navigate("MyJobs")}
          />
        )}

        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => navigation.navigate("PrivacyPolicy")}
        />

        <View style={styles.divider} />

        <SettingItem
          icon="log-out-outline"
          title="Logout"
          color="#E53935"
          onPress={handleLogout}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 16,
  },
  item: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
});