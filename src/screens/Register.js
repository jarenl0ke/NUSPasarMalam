import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import firebase from "../../database/Firebase";
import "firebase/auth";
import "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const Register = ({ navigation }) => {
  // States
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // Check password requirements on each password change
  useEffect(() => {
    checkPasswordRequirements();
  }, [password]);

  const checkPasswordRequirements = () => {
    const requirements = {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRequirements(requirements);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      alert("Fill in all the fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (
      !passwordRequirements.hasUppercase ||
      !passwordRequirements.hasLowercase ||
      !passwordRequirements.hasNumber ||
      !passwordRequirements.hasSpecial
    ) {
      alert("Password does not meet the requirements");
      return;
    }

    // Perform registration logic
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Registration successful
        const user = userCredential.user;
        alert("Sign up successful");
        navigation.goBack();

        // Add user details to Firestore
        const db = firebase.firestore();
        const usersCollection = db.collection("users");
        const newUser = {
          fullName: fullName,
          age: age,
          phoneNumber: phoneNumber,
          email: user.email,
        };
        usersCollection
          .doc(user.uid)
          .set(newUser)
          .then(() => {
            // User details added to Firestore
            console.log("User details added with ID: ", user.uid);
          })
          .catch((error) => {
            // Error adding user details to Firestore
            console.error("Error adding user details: ", error);
          });
      })
      .catch((error) => {
        // Handle registration error
        if (error.code === "auth/email-already-in-use") {
          alert("This email is already in use");
        } else if (error.code === "auth/weak-password") {
          alert("Password should be at least 8 characters long");
        } else {
          alert("Registration failed. Please try again later.");
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.header}>Register</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#777"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              keyboardType="numeric"
              placeholderTextColor="#777"
              value={age}
              onChangeText={setAge}
              maxLength={2}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="numeric"
              placeholderTextColor="#777"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={8}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              autoCapitalize="none"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              placeholderTextColor="#777"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Retype your password"
              secureTextEntry={!showPassword}
              placeholderTextColor="#777"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Show Password</Text>
          </View>
          <View style={styles.passwordRequirements}>
            <Text style={styles.passwordRequirementsLabel}>
              Password Requirements:
            </Text>
            <View style={styles.requirementItem}>
              <Text
                style={[
                  styles.requirementText,
                  passwordRequirements.hasUppercase
                    ? styles.requirementFulfilled
                    : null,
                ]}
              >
                At least 1 uppercase letter
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text
                style={[
                  styles.requirementText,
                  passwordRequirements.hasLowercase
                    ? styles.requirementFulfilled
                    : null,
                ]}
              >
                At least 1 lowercase letter
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text
                style={[
                  styles.requirementText,
                  passwordRequirements.hasNumber
                    ? styles.requirementFulfilled
                    : null,
                ]}
              >
                At least 1 number
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text
                style={[
                  styles.requirementText,
                  passwordRequirements.hasSpecial
                    ? styles.requirementFulfilled
                    : null,
                ]}
              >
                At least 1 special character
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.registerButtonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Adjust the padding to leave space for the floating button
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
    marginTop: 80,
    marginBottom: 40,
    textAlign: "center",
    color: "#FFFFFF",
  },
  fieldContainer: {
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "#111111",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  passwordRequirements: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  passwordRequirementsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  requirementItem: {
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  requirementFulfilled: {
    color: "green",
  },
  registerButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Register;
