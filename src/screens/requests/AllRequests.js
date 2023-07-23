import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../../../database/Firebase";
import "firebase/auth";
import Categories from "../../../constants/Categories";

const AllRequests = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isModalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
    deleteOldRequests();
  }, [selectedCategory]);

  const fetchRequests = async () => {
    try {
      const currentUserID = firebase.auth().currentUser.uid;
      let requestsRef = firebase.firestore().collection("Requests");

      if (selectedCategory !== "All Categories") {
        requestsRef = requestsRef.where("category", "==", selectedCategory);
      }

      const requestsSnapshot = await requestsRef.get();

      const requestsData = requestsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((listing) => listing.userID !== currentUserID);

      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const deleteOldRequests = async () => {
    try {
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      const requestsSnapshot = await firebase
        .firestore()
        .collection("Requests")
        .get();

      // Filter requests that are older than 3 days
      const oldRequests = requestsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((listing) => new Date(listing.listingDateTime) < threeDaysAgo);

      // Delete each old request from Firebase
      oldRequests.forEach(async (request) => {
        await firebase
          .firestore()
          .collection("Requests")
          .doc(request.id)
          .delete();
        console.log(`Deleted request with ID: ${request.id}`);
      });
    } catch (error) {
      console.error("Error deleting old requests:", error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const categorySelectHandler = (category) => {
    setSelectedCategory(category);
    toggleModal();
  };

  const renderRequestItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.requestItemContainer}
        onPress={() => handleRequestPress(item)}
      >
        <View style={styles.requestItemInfo}>
          <Text style={styles.requestItemTitle}>{item.requestTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleRequestPress = (request) => {
    navigation.navigate("Request", { request });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.goBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>All Requests</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={toggleModal}>
          <Text style={styles.categoryButtonText}>{selectedCategory}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <FlatList
                data={Categories}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryOption}
                    onPress={() => categorySelectHandler(item)}
                  >
                    <Text style={styles.categoryOptionText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <FlatList
        data={requests}
        numColumns={2} // Set the number of columns
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.requestsContainer}
      />
    </View>
  );
};

export default AllRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  goBackButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingTop: 25,
    paddingLeft: 10,
    zIndex: 1,
  },
  goBackButton: {
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    paddingTop: 35,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  categoryButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  categoryOption: {
    paddingVertical: 10,
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  requestsContainer: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  requestItemContainer: {
    backgroundColor: "#1E1E1E",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    flexBasis: "48%",
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  requestItemInfo: {
    flex: 1,
    alignItems: "center",
  },
  requestItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
});
