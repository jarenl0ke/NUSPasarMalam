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
  const navigation = useNavigation();

  useEffect(() => {
    fetchRequesterFullName();
    calculateRequestTime();
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
  const showChatButton = request.userID !== currentUserID;

  const deleteRequestHandler = async () => {
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
        .collection("Requests")
        .doc(request.id)
        .delete();
      Alert.alert("Request deleted successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting request:", error);
      Alert.alert("An error occurred while deleting the request.");
    }
  };

  const chatPressHandler = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("Chats")
        .where("requestID", "==", request.id)
        .where("userID", "==", currentUserID)
        .where("requesterID", "==", request.userID)
        .get();

      // Check if chat already exists
      if (!snapshot.empty) {
        const chatDoc = snapshot.docs[0];
        const chatID = chatDoc.id;
        navigation.navigate("Chat", { chatID, request });
      } else {
        const chatRef = await firebase.firestore().collection("Chats").add({
          requestID: request.id,
          userID: currentUserID,
          requesterID: request.userID,
        });

        const newChatID = chatRef.id;
        navigation.navigate("Chat", { chatID: newChatID, listing });
      }
    } catch (error) {
      console.error("Error checking/changing chat status:", error);
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
              onPress={deleteRequestHandler}
            >
              <Text style={styles.deleteButtonText}>Delete Listing</Text>
            </TouchableOpacity>
          )}
          {showChatButton && (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={chatPressHandler}
            >
              <Text style={styles.chatButtonText}>Chat with Seller</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Request;

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
});
