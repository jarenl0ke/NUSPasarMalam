import React, { useState } from "react";
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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleGoBack = () => {
    navigation.goBack();
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
        </ScrollView>
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
});

export default Register;
