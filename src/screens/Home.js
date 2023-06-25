import React from "react";
import { StyleSheet, View, TextInput } from "react-native";

const Home = () => {
  // Dummy to handle search functionality
  const handleSearch = (text) => {
    console.log("Searching for:", text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#777"
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  searchBarContainer: {
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: "#1E1E1E",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default Home;
