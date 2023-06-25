import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import firebase from "../../database/Firebase";
import "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const MyListings = ({ navigation }) => {
  // States
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const user = firebase.auth().currentUser;
      const listingsRef = firebase.firestore().collection("Listings");
      const querySnapshot = await listingsRef
        .where("userID", "==", user.uid)
        .get();
      const listingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(listingsData);
    } catch (error) {
      console.error("Error fetching listings: ", error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings()
      .then(() => setRefreshing(false))
      .catch((error) => {
        console.error("Error refreshing listings: ", error);
        setRefreshing(false);
      });
  };

  const handleListingPress = (listing) => {
    navigation.navigate("Listing", { listing });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>My Listings</Text>
      <ScrollView
        style={styles.listingsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FFFFFF"]}
            tintColor={"#FFFFFF"}
          />
        }
      >
        {listings.length === 0 && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : (
          listings.map((listing, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listingItem}
              onPress={() => handleListingPress(listing)}
            >
              <View style={styles.listingImageContainer}>
                <Image
                  source={{ uri: listing.imageUrls[0] }}
                  style={styles.listingImage}
                />
              </View>
              <View style={styles.listingDetails}>
                <Text style={styles.listingTitle}>{listing.listingTitle}</Text>
                <Text style={styles.listingPrice}>${listing.price}</Text>
                <Text style={styles.listingCondition}>{listing.condition}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFFFF",
  },
  listingsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  listingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
  },
  listingImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: "hidden",
  },
  listingImage: {
    flex: 1,
    resizeMode: "cover",
  },
  listingDetails: {
    flex: 1,
    marginLeft: 10,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listingPrice: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  listingCondition: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default MyListings;
