import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import { Ionicons } from "@expo/vector-icons";

const Search = ({ route }) => {
  const navigation = useNavigation(); // Initialize navigation hook


  // Handle navigation back to Home.js
  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  // Implement your search functionality here with the 'searchText' value

  return (
    <View style={styles.container}>
      {/* Top bar with back button and search bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackButtonPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#777"
          // You can implement your search logic here, e.g., onChangeText for updating search results
        />
      </View>
      {/* Rest of your Search.js UI */}
    </View>
  );
};

export default Search;

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  // ... (your other styles)
};
