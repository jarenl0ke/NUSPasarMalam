import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../database/Firebase";
import "firebase/auth";

import CategorySelection from "../../components/homepage/CategorySelection";
import LatestListings from "../../components/homepage/LatestListings";
import LatestRequests from "../../components/homepage/LatestRequests";
import BottomBar from "../../components/homepage/BottomBar";

const Home = () => {
  const navigation = useNavigation();
  const [latestListings, setLatestListings] = useState([]);
  const [latestRequests, setLatestRequests] = useState([]);

  useEffect(() => {
    fetchLatestListings();
    fetchLatestRequests();
  }, []);

  const fetchLatestListings = async () => {
    try {
      const listingsRef = firebase.firestore().collection("Listings");
      const currentUserID = firebase.auth().currentUser.uid;

      // Get the latest listings posted by other users (excluding the current user's latest listing)
      const otherUsersListingSnapshot = await listingsRef
        .where("userID", "!=", currentUserID)
        .orderBy("userID", "asc")
        .orderBy("listingDateTime", "desc")
        .limit(6) // Increase the limit to 6 to include the latest 5 listings from other users
        .get();

      const otherUsersListingData = otherUsersListingSnapshot.docs
        .map((doc) => doc.data())
        .filter((listing) => listing.userID !== currentUserID);

      setLatestListings(otherUsersListingData);
    } catch (error) {
      console.error("Error fetching latest listings:", error);
    }
  };

  const fetchLatestRequests = async () => {
    try {
      const requestsRef = firebase.firestore().collection("Requests");
      const currentUserID = firebase.auth().currentUser.uid;

      // Get the latest requests posted by other users (excluding the current user's latest request)
      const otherUsersRequestsSnapshot = await requestsRef
        .where("userID", "!=", currentUserID)
        .orderBy("userID", "asc")
        .orderBy("listingDateTime", "desc")
        .limit(6)
        .get();

      const otherUsersRequestsData = otherUsersRequestsSnapshot.docs
        .map((doc) => doc.data())
        .filter((request) => request.userID !== currentUserID);

      setLatestRequests(otherUsersRequestsData);
    } catch (error) {
      console.error("Error fetching latest requests:", error);
    }

    const handleSearch = (text) => {
      console.log("Searching for:", text);
    };

    const handleChatPress = () => {
      navigation.navigate("MyChats");
    };

    const handleCategoryPress = (category) => {
      navigation.navigate("AllListings", {
        selectedCategory: category.categoryName,
      });
    };

    const handleListingPress = (listing) => {
      navigation.navigate("Listing", { listing });
    };

    const handleViewAllListings = () => {
      navigation.navigate("AllListings", {
        selectedCategory: "All Categories",
      });
    };

    const handleRequestPress = (request) => {
      navigation.navigate("Request", { request });
    };

    const handleViewAllRequests = () => {
      navigation.navigate("AllRequests");
    };

    const handleAddListing = () => {
      navigation.navigate("AddListing");
    };

    const handleAddRequest = () => {
      navigation.navigate("AddRequest");
    };

    const handleSettings = () => {
      navigation.navigate("Settings");
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
          <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
            <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>What are you looking for today?</Text>
        <CategorySelection onPress={handleCategoryPress} />
        <LatestListings
          data={latestListings}
          onPress={handleListingPress}
          viewAll={handleViewAllListings}
        />
        <LatestRequests
          data={latestRequests}
          onPress={handleRequestPress}
          viewAll={handleViewAllRequests}
        />
        <BottomBar
          listing={handleAddListing}
          request={handleAddRequest}
          settings={handleSettings}
        />
      </View>
    );
  };
};

export default Home;

const styles = StyleSheet.create({
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
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
    flexDirection: "row",
    alignItems: "center",
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
  },
  chatButton: {
    marginLeft: 10,
    padding: 10,
  },
});
