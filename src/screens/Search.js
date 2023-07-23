import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../../database/Firebase"; // Import your Firebase configuration

// Define the search types for Listings and Requests
const SEARCH_TYPES = {
  LISTINGS: "Listings",
  REQUESTS: "Requests",
};

const Search = ({ route }) => {
  const navigation = useNavigation();
  const searchTextInputRef = useRef(null); // Create a ref for the search text input
  const [selectedSearchType, setSelectedSearchType] = useState(
    SEARCH_TYPES.LISTINGS
  );
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle navigation back to Home.js
  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  // Handle toggle buttons
  const handleListingsToggle = () => {
    setSelectedSearchType(SEARCH_TYPES.LISTINGS);
  };

  const handleRequestsToggle = () => {
    setSelectedSearchType(SEARCH_TYPES.REQUESTS);
  };

  // Function to fetch listings based on search text
  const searchListings = async (searchText, currentUserID) => {
    try {
      const listingsRef = firebase.firestore().collection("Listings");

      const snapshot = await listingsRef
        .where("listingTitle", ">=", searchText) // Search by listingTitle
        .where("listingTitle", "<=", searchText + "\uf8ff")
        .get();

      const data = snapshot.docs
        .map((doc) => doc.data())
        .filter((item) => item.userID !== currentUserID); // Exclude own listings

      return data;
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  };

  // Function to fetch requests based on search text
  const searchRequests = async (searchText, currentUserID) => {
    try {
      const requestsRef = firebase.firestore().collection("Requests");

      const snapshot = await requestsRef
        .where("requestTitle", ">=", searchText) // Search by requestTitle
        .where("requestTitle", "<=", searchText + "\uf8ff")
        .get();

      const data = snapshot.docs
        .map((doc) => doc.data())
        .filter((item) => item.userID !== currentUserID); // Exclude own requests

      return data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      return [];
    }
  };

  // Function to fetch search results based on selected search type
  const fetchSearchResults = async () => {
    try {
      setLoading(true);

      let data = [];
      const currentUserID = firebase.auth().currentUser.uid;

      if (selectedSearchType === SEARCH_TYPES.LISTINGS) {
        data = await searchListings(searchText, currentUserID);
      } else if (selectedSearchType === SEARCH_TYPES.REQUESTS) {
        data = await searchRequests(searchText, currentUserID);
      }

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  // Trigger search whenever the search text changes
  useEffect(() => {
    const fetchSearchResultsWithDebounce = async () => {
      // Add a small delay (e.g., 300ms) before triggering the search
      await new Promise((resolve) => setTimeout(resolve, 300));
      fetchSearchResults();
    };

    console.log("Search text changed:", searchText);
    fetchSearchResultsWithDebounce();
  }, [searchText]);

  // Handle search text change
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  // Handle search button press
  const handleSearchButtonPress = () => {
    fetchSearchResults();
  };

  // Render search result item
  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.listingTitle}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top bar with back button and search bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackButtonPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TextInput
          ref={searchTextInputRef} // Set the ref for the search text input
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
        <TouchableOpacity onPress={handleSearchButtonPress}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {/* Search Results and Toggle Buttons */}
      <View style={styles.searchResultsContainer}>
        <Text style={styles.searchResultsText}>Search Results:</Text>
        <View style={styles.toggleButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedSearchType === SEARCH_TYPES.LISTINGS &&
                styles.selectedToggleButton,
            ]}
            onPress={handleListingsToggle}
          >
            <Text style={styles.toggleButtonText}>Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedSearchType === SEARCH_TYPES.REQUESTS &&
                styles.selectedToggleButton,
            ]}
            onPress={handleRequestsToggle}
          >
            <Text style={styles.toggleButtonText}>Requests</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Show loading animation */}
      {loading && <ActivityIndicator size="large" color="#FFFFFF" />}
      {/* Show search results */}
      {!loading && (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id} // Replace "id" with the unique identifier key in your data
          // Add more FlatList props as needed (e.g., styling, itemSeparatorComponent, etc.)
        />
      )}
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
  searchResultsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchResultsText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButtonsContainer: {
    flexDirection: "row",
    marginLeft: 20,
  },
  toggleButton: {
    backgroundColor: "#3b3b3b",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedToggleButton: {
    backgroundColor: "#87ceeb", // Change the color for the selected toggle button
  },
  toggleButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  // ... (your other styles)
};
