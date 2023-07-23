import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import firebase from "../../../database/Firebase";
import "firebase/auth";
import "firebase/firestore";

const Request = () => {
  const route = useRoute();
  const { request } = route.params;
  const [requesterFullName, setRequesterFullName] = useState("");
  const [requestTime, setRequestTime] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchRequesterFullName();
    calculateRequestTime();
    fetchSellerTelegramHandle();
  }, []);

  const fetchRequesterFullName = async () => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(request.userID)
        .get();
      const userData = userDoc.data();
      const fullName = userData.fullName;
      setRequesterFullName(fullName);
    } catch (error) {
      console.error("Error fetching seller's full name:", error);
    }
  };

  const calculateRequestTime = () => {
    const currentTime = new Date();
    const requestDateTime = new Date(request.listingDateTime);
    const timeDiff = currentTime - requestDateTime;

    const minutes = Math.floor(timeDiff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      setRequestTime(`Item listed ${days} ${days === 1 ? "day" : "days"} ago`);
    } else {
      setRequestTime(
        `Item requested ${hours} ${hours === 1 ? "hour" : "hours"} ago`
      );
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const currentUserID = firebase.auth().currentUser.uid;
  const showDeleteButton = request.userID === currentUserID;
  const showContactButton = request.userID !== currentUserID;

  const fetchSellerTelegramHandle = async () => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(request.userID)
        .get();
      const userData = userDoc.data();
      const sellerTelegramHandle = userData.telegramHandle || ""; // Get the seller's Telegram handle or an empty string if it's not available
      setTelegramHandle(sellerTelegramHandle);
    } catch (error) {
      console.error("Error fetching seller's Telegram handle:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(telegramHandle);
      Alert.alert(
        "Telegram Handle Copied",
        "Requester's Telegram handle has been copied to the clipboard."
      );
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "An error occurred while copying to clipboard.");
    }
  };

  const togglePopup = () => {
    setIsPopupVisible((prevState) => !prevState);
  };

  const handleDeleteRequest = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this request?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteRequestHandler },
      ]
    );
  };

  const deleteRequestHandler = async () => {
    try {
      // Delete the request from the Firestore collection
      await firebase
        .firestore()
        .collection("Requests")
        .doc(request.id)
        .delete();
      // Navigate back to the previous screen after successful deletion
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting request:", error);
      Alert.alert("Error", "An error occurred while deleting the request.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.requestDetailsContainer}>
          <Text style={styles.requestTitle}>{request.requestTitle}</Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Category:</Text> {request.category}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Requester:</Text> {requesterFullName}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Description:</Text> {"\n"}
            {request.description}
          </Text>
          <Text style={styles.requestTime}>
            {"\n"}
            {requestTime}
          </Text>
          {showDeleteButton && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteRequest}
            >
              <Text style={styles.deleteButtonText}>Delete Listing</Text>
            </TouchableOpacity>
          )}
          {showContactButton && (
            <TouchableOpacity
              style={styles.contactButton} // Changed from chatButton to contactButton
              onPress={togglePopup} // Show/hide the popup on button press
            >
              <Text style={styles.contactButtonText}>Contact Requester</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* The popup */}
      {isPopupVisible && (
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>Requester's Telegram Handle:</Text>
            <Text style={styles.telegramHandleText}>{telegramHandle}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}
            >
              <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={togglePopup}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  requestDetailsContainer: {
    marginTop: 50,
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
  },
  requestTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  label: {
    color: "#87CEEB",
    fontWeight: "bold",
    marginRight: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  requestTime: {
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
  popupContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
  },
  popup: {
    width: "70%",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  popupText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  telegramHandleText: {
    color: "#87CEEB",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  copyButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  copyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  contactButton: {
    backgroundColor: "#1E90FF", // Blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  contactButtonText: {
    color: "#FFFFFF", // White color
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Request;