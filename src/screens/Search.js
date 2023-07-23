import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../../database/Firebase"; // Import your Firebase configuration

const SEARCH_TYPES = {
  LISTINGS: "Listings",
};

const Search = () => {
  const navigation = useNavigation();
  const searchTextInputRef = useRef(null);
  const [selectedSearchType] = useState(SEARCH_TYPES.LISTINGS);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBackButtonPress = () => {
    navigation.goBack();
  };
  const searchListings = async (searchText, currentUserID) => {
    try {
      const listingsRef = firebase.firestore().collection("Listings");

      const lowercaseSearchText = searchText.toLowerCase();

      const snapshot = await listingsRef
        .where("listingTitleLowercase", ">=", lowercaseSearchText)
        .where("listingTitleLowercase", "<=", lowercaseSearchText + "\uf8ff")
        .orderBy("listingTitleLowercase") // Order the results by listingTitleLowercase
        .get();

      const data = snapshot.docs
        .map((doc) => {
          const listingData = doc.data();
          return { ...listingData, id: doc.id };
        })
        .filter((item) => item.userID !== currentUserID);

      return data;
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const currentUserID = firebase.auth().currentUser.uid;
      const data = await searchListings(searchText, currentUserID);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const fetchSearchResultsWithDebounce = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      fetchSearchResults();
    };

    fetchSearchResultsWithDebounce();
  }, [searchText]);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const renderListingItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listingItemContainer}
        onPress={() => handleListingPress(item)}
      >
        <Image
          source={{ uri: item.imageUrls[0] }}
          style={styles.listingItemImage}
        />
        <View style={styles.listingItemInfo}>
          <Text style={styles.listingItemTitle}>{item.listingTitle}</Text>
          <Text style={styles.listingItemPrice}>Price: ${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleListingPress = (listing) => {
    // Navigate to the Listing screen with the selected listing data
    navigation.navigate("Listing", { listing });
  };

  const renderPlaceholder = () => {
    let placeholderText = "Enter your search query above.";

    if (searchText.trim() !== "") {
      placeholderText = "No results found.";
    }

    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>{placeholderText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackButtonPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TextInput
          ref={searchTextInputRef}
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>
      <View style={styles.searchResultsContainer}>
        <Text style={styles.searchResultsText}>Search Results:</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#FFFFFF" />}
      {!loading && searchText.trim() !== "" && searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          numColumns={2} // Set the number of columns
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listingsContainer}
        />
      ) : (
        renderPlaceholder()
      )}
    </View>
  );
};

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
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  listingItemContainer: {
    backgroundColor: "#1E1E1E",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    flexBasis: "48%",
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  listingItemImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  listingItemInfo: {
    flex: 1,
    alignItems: "center",
  },
  listingItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  listingItemPrice: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  listingsContainer: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
};

export default Search;
