import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../../database/Firebase";
import "firebase/auth";

const Settings = ({ navigation }) => {
  // To Navigate to previous screen
  const handleGoBack = () => {
    navigation.goBack();
  };

  // To Navigate to Edit Profile Screen
  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  // To Navigate to MyListings Screen
  const handleMyListings = () => {
    navigation.navigate("MyListings");
  };

  // Dummy to Navigate to Login
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Do you wish to sign out?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                navigation.navigate("Login"); // Navigate to Login screen after sign out
              })
              .catch((error) => {
                console.error("Error signing out: ", error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>Settings</Text>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleMyListings}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>My Listings</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleEditProfile}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignOut}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Adjust for safe area on Android
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  goBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#FFFFFF",
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Settings;
