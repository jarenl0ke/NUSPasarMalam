import React, { useState, useEffect } from "react";
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

const sortOptions = [
  { key: "priceLowToHigh", label: "Price: Low to High" },
  { key: "priceHighToLow", label: "Price: High to Low" },
  { key: "dateOldToNew", label: "Date Posted: Old to New" },
  { key: "dateNewToOld", label: "Date Posted: New to Old" },
];

const AllListings = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [listings, setListings] = useState([]);
  const currentUserID = firebase.auth().currentUser.uid;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let listingsRef = firebase.firestore().collection("Listings");

        if (selectedCategory !== "All Categories") {
          listingsRef = listingsRef.where("category", "==", selectedCategory);
        }

        const listingsSnapshot = await listingsRef.get();

        const listingsData = listingsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((listing) => listing.userID !== currentUserID);

        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [selectedCategory]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleSortModal = () => {
    setSortModalVisible(!isSortModalVisible);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    toggleModal();
  };

  const renderListingItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.listingItemContainer}
        onPress={() => handleListingPress(item)}
      >
        <Image
          source={{ uri: item.imageUrls[0] }}
          style={styles.listingItemImage}
        />
        <Text style={styles.listingItemTitle}>{item.listingTitle}</Text>
        <Text style={styles.listingItemPrice}>Price: ${item.price}</Text>
      </TouchableOpacity>
    );
  };

  const handleListingPress = (listing) => {
    navigation.navigate("Listing", { listing });
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

      {/* Add the sort modal content */}
      <Modal
        visible={isSortModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleSortModal}
      >
        <TouchableWithoutFeedback onPress={toggleSortModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sort By</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <FlatList
        data={listings}
        numColumns={2}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listingsContainer}
      />
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
  listingsContainer: {
    paddingBottom: 20,
  },
  listingItemContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  listingItemImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  listingItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 5,
  },
  listingItemPrice: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default AllListings;
