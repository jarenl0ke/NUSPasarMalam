import React, { useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Text,
  Keyboard,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Login = ({ navigation }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToHomepage = () => {
    navigation.navigate("Home");
  };

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter your email and password");
      return;
    } else {
      navigateToHomepage();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.header}>NUS Pasar Malam</Text>
        <Image
          source={require("../../assets/Images/marketplace.png")}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={handleLogin}>
          <Text style={styles.signupButtonText}>Create a new account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
  },
  logo: {
    height: 150,
    width: 150,
    marginBottom: 30,
  },
  input: {
    color: "#FFFFFF",
    backgroundColor: "#1E1E1E",
    fontSize: 16,
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    paddingTop: 10,
    marginTop: 10,
  },
  signupButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
});

export default Login;
