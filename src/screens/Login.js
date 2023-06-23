import React from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Keyboard,
  Image,
  StyleSheet,
} from "react-native";

const Login = () => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.header}>NUS Pasar Malam</Text>
        <Image
          source={require("../../assets/marketplace.png")}
          style={styles.logo}
        />
      </View>
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
});

export default Login;
