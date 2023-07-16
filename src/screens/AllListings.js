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
  { key: "dateLatestToOldest", label: "Date Listed: Newest to Oldest" },
  { key: "priceLowToHigh", label: "Price: Low to High" },
  { key: "priceHighToLow", label: "Price: High to Low" },
];

const AllListings = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [listings, setListings] = useState([]);
  const [sortOption, setSortOption] = useState("dateLatestToOldest");
  const currentUserID = firebase.auth().currentUser.uid;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let listingsRef = firebase.firestore().collection("Listings");

        if (selectedCategory !== "All Categories") {
          listingsRef = listingsRef.where("category", "==", selectedCategory);
        }

        switch (sortOption) {
          case "priceLowToHigh":
            listingsRef = listingsRef.orderBy("price", "asc");
            break;
          case "priceHighToLow":
            listingsRef = listingsRef.orderBy("price", "desc");
            break;
        }

        const listingsSnapshot = await listingsRef.get();

        const listingsData = listingsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((listing) => listing.userID !== currentUserID);

        const sortedListings = listingsData.sort((a, b) => {
          const priceA = Number(a.price);
          const priceB = Number(b.price);
          const dateA = new Date(a.listingDateTime);
          const dateB = new Date(b.listingDateTime);

          switch (sortOption) {
            case "priceLowToHigh":
              return priceA - priceB;
            case "priceHighToLow":
              return priceB - priceA;
            case "dateLatestToOldest":
              return dateB - dateA;
            default:
              return 0;
          }
        });

        setListings(sortedListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [selectedCategory, sortOption]);

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

  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    toggleSortModal();
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
        <View style={styles.listingItemInfo}>
          <Text style={styles.listingItemTitle}>{item.listingTitle}</Text>
          <Text style={styles.listingItemPrice}>Price: ${item.price}</Text>
        </View>
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
          <Text style={styles.sortButtonText}>
            {sortOption === "priceLowToHigh"
              ? "Price: Low to High"
              : sortOption === "priceHighToLow"
              ? "Price: High to Low"
              : "Date Listed: Newest to Oldest"}
          </Text>
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
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={styles.sortOption}
                  onPress={() => handleSortOptionSelect(option.key)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      option.key === sortOption && styles.activeSortOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <FlatList
        data={listings}
        numColumns={2} // Set the number of columns
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
    paddingHorizontal: 5,
  },
  listingItemContainer: {
    backgroundColor: "#1E1E1E",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    flexBasis: "48%",
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  listingItemImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  listingItemInfo: {
    flex: 1,
    alignItems: "center",
  },
  listingItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  listingItemPrice: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  sortOptionText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 5,
  },
  activeSortOptionText: {
    fontWeight: "bold",
  },
});

export default AllListings;