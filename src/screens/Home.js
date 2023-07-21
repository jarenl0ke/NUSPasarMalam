import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../database/Firebase";
import "firebase/auth";

const categories = [
  {
    id: "1",
    title: "Books & Magazines",
    categoryName: "Books & Magazines",
    icon: require("../../assets/Images/books.png"),
    backgroundColor: "#ff7f50", // Coral color
  },
  {
    id: "2",
    title: "Clothing",
    categoryName: "Clothing & Accessories",
    icon: require("../../assets/Images/shirt.png"),
    backgroundColor: "#6495ed", // Cornflower blue color
  },
  {
    id: "3",
    title: "Electronic",
    categoryName: "Electronics",
    icon: require("../../assets/Images/phone.png"),
    backgroundColor: "#20b2aa", // Light sea green color
  },
  {
    id: "4",
    title: "Health",
    categoryName: "Health",
    icon: require("../../assets/Images/pill.png"),
    backgroundColor: "#9370db", // Medium purple color
  },
  {
    id: "5",
    title: "Home & Kitchen",
    categoryName: "Home & Kitchen",
    icon: require("../../assets/Images/home.png"),
    backgroundColor: "#f08080", // Light coral color
  },
  {
    id: "6",
    title: "Food & Beverages",
    categoryName: "Food & Beverages",
    icon: require("../../assets/Images/food.png"),
    backgroundColor: "#ffa500", // Orange color
  },
  {
    id: "7",
    title: "Furniture",
    categoryName: "Furniture",
    icon: require("../../assets/Images/couch.png"),
    backgroundColor: "#00ced1", // Dark turquoise color
  },
  {
    id: "8",
    title: "View All",
    categoryName: "All Categories",
    icon: require("../../assets/Images/view.png"),
    backgroundColor: "#87ceeb", // Sky blue color
  },
];

const Home = () => {
  const navigation = useNavigation();
  const [latestListings, setLatestListings] = useState([]);

  // Dummy to handle search functionality
  const handleSearch = (text) => {
    console.log("Searching for:", text);
  };

  const handleChatPress = () => {
    navigation.navigate("MyChats");
  };

  const handleCategoryPress = (category) => {
    navigation.navigate("AllListings", {
      selectedCategory: category.categoryName,
    });
  };

  const renderCategoryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryItemContainer,
          { backgroundColor: item.backgroundColor },
        ]}
        onPress={() => handleCategoryPress(item)}
      >
        <Image source={item.icon} style={styles.categoryIcon} />
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderCategories = () => {
    return (
      <FlatList
        data={categories}
        numColumns={4}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriesContainer}
        columnWrapperStyle={styles.categoryColumnWrapper}
        style={{ marginTop: -25 }}
      />
    );
  };

  const renderCarouselItem = ({ item }) => {
    const windowWidth = Dimensions.get("window").width;
    const itemWidth = (windowWidth - 80) / 2.5;
    const imageHeight = itemWidth * 1.2;

    return (
      <TouchableOpacity
        style={[
          styles.carouselItemContainer,
          { width: itemWidth, height: imageHeight },
        ]}
      >
        <ImageBackground
          source={{ uri: item.imageUrls[0] }}
          style={styles.carouselItemImage}
          imageStyle={{ ...styles.carouselItemImage, resizeMode: "cover" }}
        >
          {/* Background overlay */}
          <View style={styles.textContainer}>
            <View style={styles.textBackground}>
              <Text
                style={styles.carouselItemTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {item.listingTitle}
              </Text>
              <Text
                style={styles.carouselItemPrice}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                ${item.price}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderLatestListings = () => {
    return (
      <View style={styles.latestListingsContainer}>
        <View style={styles.latestListingsHeaderContainer}>
          <Text style={styles.latestListingsHeader}>Latest Listings</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewAllListings}
          >
            <Text style={styles.viewAllButtonText}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={latestListings}
          renderItem={renderCarouselItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />
      </View>
    );
  };

  const handleViewAllListings = () => {
    navigation.navigate("AllListings", {
      selectedCategory: "All Categories",
    });
  };

  const renderBottomBar = () => {
    const handleAddListing = () => {
      navigation.navigate("AddListing");
    };

    const handleAddRequest = () => {
      navigation.navigate("AddRequest");
    };

    const handleSettings = () => {
      navigation.navigate("Settings");
    };

    return (
      <SafeAreaView style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={handleAddListing}
        >
          <Image
            source={require("../../assets/Images/sell.png")}
            style={styles.bottomBarIcon}
          />
          <Text style={styles.bottomBarText}>New Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={handleAddRequest}
        >
          <Image
            source={require("../../assets/Images/buy.png")}
            style={styles.bottomBarIcon}
          />
          <Text style={styles.bottomBarText}>New Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem} onPress={handleSettings}>
          <Image
            source={require("../../assets/Images/settings.png")}
            style={styles.bottomBarIcon}
          />
          <Text style={styles.bottomBarText}>Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  useEffect(() => {
    const fetchLatestListings = async () => {
      try {
        const listingsRef = firebase.firestore().collection("Listings");
        const currentUserID = firebase.auth().currentUser.uid;

        // Get the latest listings posted by other users (excluding the current user's latest listing)
        const otherUsersListingSnapshot = await listingsRef
          .where("userID", "!=", currentUserID)
          .orderBy("userID", "asc")
          .orderBy("listingDateTime", "desc")
          .limit(6) // Increase the limit to 6 to include the latest 5 listings from other users
          .get();

        const otherUsersListingData = otherUsersListingSnapshot.docs
          .map((doc) => doc.data())
          .filter((listing) => listing.userID !== currentUserID);

        setLatestListings(otherUsersListingData);
      } catch (error) {
        console.error("Error fetching latest listings:", error);
      }
    };

    fetchLatestListings();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#777"
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
          <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>What are you looking for today?</Text>
      {renderCategories()}
      {renderLatestListings()}
      {renderBottomBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  searchBarContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
  chatButton: {
    marginLeft: 10,
    padding: 10,
  },
  categoriesContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  categoryColumnWrapper: {
    justifyContent: "space-between",
  },
  categoryItemContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 3,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    tintColor: "#FFFFFF",
  },
  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  bottomBarIcon: {
    width: 20,
    height: 20,
  },
  bottomBarText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
  },
  latestListingsContainer: {
    marginTop: -10,
    marginBottom: 250,
  },
  latestListingsHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
  },
  carouselContainer: {
    paddingHorizontal: 10,
  },
  carouselItemContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    justifyContent: "center",
  },
  carouselItemImage: {
    width: "100%",
    height: 160,
    justifyContent: "flex-end",
  },
  carouselItemTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 1,
  },
  carouselItemPrice: {
    color: "#FFFFFF",
    fontSize: 12,
    marginVertical: 4,
  },
  latestListingsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  viewAllButton: {
    backgroundColor: "#3b3b3b",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewAllButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "row", // Display text items horizontally
    justifyContent: "flex-start", // Align text items to the left
    width: "100%", // Fill the width of the image container
  },
  textBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background overlay color (adjust opacity as needed)
    padding: 5,
    flex: 1,
    borderRadius: 10,
  },
});

export default Home;
