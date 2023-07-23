import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import firebase from "../../../database/Firebase";
import "firebase/auth";
import "firebase/firestore";

const Listing = () => {
  const route = useRoute();
  const { listing } = route.params;
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [listingTime, setListingTime] = useState(null);
  const [sellerFullName, setSellerFullName] = useState("");
  const currentUserID = firebase.auth().currentUser.uid;
  const navigation = useNavigation();

  useEffect(() => {
    fetchSellerFullName();
    calculateListingTime();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleImageClick = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const showDeleteButton = listing.userID === currentUserID;
  const showChatButton = listing.userID !== currentUserID;

  const handleDeleteListing = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteListing },
      ]
    );
  };

  const deleteListing = async () => {
    try {
      await firebase
        .firestore()
        .collection("Listings")
        .doc(listing.id)
        .delete();
      Alert.alert("Listing deleted successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting listing:", error);
      Alert.alert("An error occurred while deleting the listing.");
    }
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  const calculateListingTime = () => {
    const currentTime = new Date();
    const listingDateTime = new Date(listing.listingDateTime);
    const timeDiff = currentTime - listingDateTime;

    const minutes = Math.floor(timeDiff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      setListingTime(`Item listed ${days} ${days === 1 ? "day" : "days"} ago`);
    } else {
      setListingTime(
        `Item listed ${hours} ${hours === 1 ? "hour" : "hours"} ago`
      );
    }
  };

  const handleChatPress = async () => {
    try {

      const snapshot = await firebase
        .firestore()
        .collection("Chats")
        .where("listingID", "==", listing.id)
        .where("buyerID", "==", currentUserID)
        .where("sellerID", "==", listing.userID)
        .get();

      if (!snapshot.empty) {
        const chatDoc = snapshot.docs[0];
        const chatID = chatDoc.id;
        navigation.navigate("Chat", { chatID, listing });
      } else {
        const chatRef = await firebase.firestore().collection("Chats").add({
          sellerID: listing.userID,
          listingID: listing.id,
          buyerID: currentUserID,
        });

        const newChatID = chatRef.id;
        navigation.navigate("Chat", { chatID: newChatID, listing });
      }
    } catch (error) {
      console.error("Error checking/changing chat status:", error);
    }
  };

  const fetchSellerFullName = async () => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(listing.userID)
        .get();
      const userData = userDoc.data();
      const fullName = userData.fullName;
      setSellerFullName(fullName);
    } catch (error) {
      console.error("Error fetching seller's full name:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.carouselContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {listing.imageUrls.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImageClick(imageUrl)}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.carouselImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.listingDetailsContainer}>
          <Text style={styles.listingTitle}>{listing.listingTitle}</Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Price:</Text> ${listing.price}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Category:</Text> {listing.category}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Condition:</Text> {listing.condition}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Seller:</Text> {sellerFullName}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Description:</Text> {"\n"}
            {listing.description}
          </Text>
          <Text style={styles.listingTime}>
            {"\n"}
            {listingTime}
          </Text>
          {showDeleteButton && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteListing}
            >
              <Text style={styles.deleteButtonText}>Delete Listing</Text>
            </TouchableOpacity>
          )}
          {showChatButton && (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={handleChatPress}
            >
              <Text style={styles.chatButtonText}>Chat with Seller</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Modal visible={!!fullscreenImage} transparent={true}>
        <View style={styles.fullscreenContainer}>
          <Image
            source={{ uri: fullscreenImage }}
            style={styles.fullscreenImage}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseFullscreen}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Adjust for safe area on Android
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
  carouselContainer: {
    marginTop: 50,
    marginBottom: 20,
    height: 200,
  },
  carouselImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 5,
  },
  listingDetailsContainer: {
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
  },
  listingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  label: {
    color: "#87CEEB",
    fontWeight: "bold",
    marginRight: 5,
  },
  listingTime: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  chatButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
});

export default Listing;
