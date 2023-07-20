import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import firebase from "../../database/Firebase";
import "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const MyRequests = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);

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
      setListings(requestsData);
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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>My Requests</Text>
      <ScrollView
        style={styles.listingsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshHandler}
            colors={["#FFFFFF"]}
            tintColor={"#FFFFFF"}
          />
        }
      ></ScrollView>
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
  listingsContainer: {
    flex: 1,
  },
});
