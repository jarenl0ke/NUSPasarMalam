import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import firebase from "../../database/Firebase";
import "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const MyRequests = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const user = firebase.auth().currentUser;
      const requestsRef = firebase.firestore().collection("Requests");
      const querySnapshot = await requestsRef
        .where("userID", "==", user.uid)
        .get();
      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching listings: ", error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const refreshHandler = () => {
    setRefreshing(true);
    fetchRequests()
      .then(() => setRefreshing(false))
      .catch((error) => {
        console.error("Error refreshing listings: ", error);
        setRefreshing(false);
      });
  };

  const requestPressHandler = (request) => {
    navigation.navigate("Request", { request });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>My Requests</Text>
      <ScrollView
        style={styles.requestsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshHandler}
            colors={["#FFFFFF"]}
            tintColor={"#FFFFFF"}
          />
        }
      >
        {requests.length === 0 && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : (
          requests.map((request, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listingItem}
              onPress={() => requestPressHandler(request)}
            >
              <View style={styles.listingDetails}>
                <Text style={styles.listingTitle}>{request.requestTitle}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
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
  requestsContainer: {
    flex: 1,
  },
  listingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
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
});
