import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import firebase from "../../database/Firebase";
import "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  "All Categories",
  "Electronics",
  "Clothing & Accessories",
  "Home & Kitchen",
  "Furniture",
  "Books & Magazines",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Toys & Games",
  "Health & Fitness",
  "Jewelry & Watches",
  "Automotive",
  "Baby & Kids",
  "Art & Collectibles",
  "Musical Instruments",
  "Pet Supplies",
  "Tools & Home Improvement",
  "Office Supplies",
  "Garden & Outdoor",
  "Food & Beverages",
];

const AllListings = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleSortModal = () => {
    setSortModalVisible(!isSortModalVisible);
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
        <Text style={styles.headerText}>All Listings</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={toggleModal}>
          <Text style={styles.categoryButtonText}>{selectedCategory}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortButton} onPress={toggleSortModal}>
          <Text style={styles.sortButtonText}>Sort</Text>
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
                data={categories}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryOption}
                    onPress={() => handleCategorySelect(item)}
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
    </View>
  );
};

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
  sortButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  sortButtonText: {
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
});

export default AllListings;
