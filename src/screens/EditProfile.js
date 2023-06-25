import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";
import firebase from "../../database/Firebase";
import "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const EditProfile = ({ navigation }) => {
  // Initialise States
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Retrieve user information from Firebase
  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      const usersCollection = db.collection("users");
      usersCollection
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setFullName(userData.fullName);
            setAge(userData.age);
            setEmail(userData.email);
            setPhoneNumber(userData.phoneNumber);
          } else {
            console.log("User document not found");
          }
        })
        .catch((error) => {
          console.error("Error retrieving user information: ", error);
        });
    }
  }, []);

  // Enable/disable update button based on field completion
  useEffect(() => {
    if (fullName && age && phoneNumber && email) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [fullName, age, phoneNumber, email]);

  const handleUpdateProfile = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const usersCollection = db.collection("users");

      // Update email first
      user
        .updateEmail(email)
        .then(() => {
          // Update other profile fields in Firestore
          usersCollection
            .doc(user.uid)
            .update({
              fullName: fullName,
              age: age,
              phoneNumber: phoneNumber,
              email: email,
            })
            .then(() => {
              console.log("Profile updated successfully");
              Alert.alert(
                "Profile Updated",
                "Your profile has been updated successfully."
              );
              navigation.goBack();
            })
            .catch((error) => {
              console.error("Error updating profile: ", error);
            });
        })
        .catch((error) => {
          console.error("Error updating email: ", error);
          if (error.code === "auth/invalid-email") {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
          } else {
            Alert.alert(
              "Error",
              "An error occurred while updating your email. Please try again later."
            );
          }
        });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const user = firebase.auth().currentUser;
            if (user) {
              const db = firebase.firestore();
              const usersCollection = db.collection("users");

              // Delete user document from Firestore
              usersCollection
                .doc(user.uid)
                .delete()
                .then(() => {
                  // Delete user account
                  user
                    .delete()
                    .then(() => {
                      console.log("Account deleted successfully");
                      Alert.alert(
                        "Account Deleted",
                        "Your account has been deleted successfully."
                      );
                      navigation.navigate("Login");
                    })
                    .catch((error) => {
                      console.error("Error deleting account: ", error);
                    });
                })
                .catch((error) => {
                  console.error("Error deleting user document: ", error);
                });
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>Edit Profile</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666666"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#666666"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666666"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#666666"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          maxLength={8}
        />
      </View>
      <TouchableOpacity
        style={[styles.updateButton, isButtonDisabled && styles.disabledButton]}
        onPress={handleUpdateProfile}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backgroundTouchable}
        onPress={Keyboard.dismiss}
        activeOpacity={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333333",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  backgroundTouchable: {
    flex: 1,
  },
});

export default EditProfile;
