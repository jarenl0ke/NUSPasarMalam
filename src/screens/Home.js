import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
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

import LatestListings from "../../components/homepage/LatestListings";

import ViewAllButton from "../../components/ui/ViewAllButton";

const Home = () => {
  const navigation = useNavigation();
  const [latestListings, setLatestListings] = useState([]);
  const [latestRequests, setLatestRequests] = useState([]);

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
      <View style={styles.categoriesContainer}>
        <View style={styles.row}>
          {categories.slice(0, 4).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItemContainer,
                { backgroundColor: category.backgroundColor },
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Image source={category.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {categories.slice(4).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItemContainer,
                { backgroundColor: category.backgroundColor },
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Image source={category.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
        onPress={() => handleListingPress(item)}
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
          <ViewAllButton onPress={handleViewAllListings} />
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

  const handleListingPress = (listing) => {
    navigation.navigate("Listing", { listing });
  };

  const renderLatestRequests = () => {
    return (
      <View style={styles.latestRequestsContainer}>
        <View style={styles.latestListingsHeaderContainer}>
          <Text style={styles.latestListingsHeader}>Latest Requests</Text>
          <ViewAllButton onPress={handleViewAllRequests} />
        </View>
        <FlatList
          data={latestRequests}
          renderItem={renderRequestCarouselItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />
      </View>
    );
  };

  const renderRequestCarouselItem = ({ item }) => {
    // Calculate time elapsed since the request was posted
    const timeElapsed = getTimeElapsed(item.listingDateTime);

    // Calculate the item width and image height based on window width
    const windowWidth = Dimensions.get("window").width;
    const itemWidth = (windowWidth - 80) / 2.5; // Adjust the values (80 and 2.5) as needed for the desired layout
    const imageHeight = itemWidth * 0.5; // Adjust the value (1.2) as needed for the desired image aspect ratio

    return (
      <TouchableOpacity
        style={[
          styles.carouselItemContainer,
          { width: itemWidth, height: imageHeight },
        ]}
        onPress={() => handleRequestPress(item)} // Handle request item press
      >
        {/* Render the request title and time elapsed */}
        <View style={styles.requestInfoContainer}>
          <Text style={styles.requestTitle}>{item.requestTitle}</Text>
          <Text style={styles.timeElapsedText}>{timeElapsed}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getTimeElapsed = (timestamp) => {
    const now = new Date();
    const listingDateTime = new Date(timestamp);

    const timeDifferenceInSeconds = Math.floor((now - listingDateTime) / 1000);

    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} seconds ago`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  const handleViewAllRequests = () => {
    navigation.navigate("AllRequests");
  };

  const handleRequestPress = (request) => {
    // Handle request item press (navigate to RequestDetails, etc.)
    navigation.navigate("Request", { request });
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
          .map((doc) => ({
            id: doc.id, // Include the document ID in the listing object
            ...doc.data(),
          }))
          .filter((listing) => listing.userID !== currentUserID);

        setLatestListings(otherUsersListingData);
      } catch (error) {
        console.error("Error fetching latest listings:", error);
      }
    };

    const fetchLatestRequests = async () => {
      try {
        const requestsRef = firebase.firestore().collection("Requests");
        const currentUserID = firebase.auth().currentUser.uid;

        // Get the latest requests posted by other users (excluding the current user's latest request)
        const otherUsersRequestsSnapshot = await requestsRef
          .where("userID", "!=", currentUserID)
          .orderBy("userID", "asc")
          .orderBy("listingDateTime", "desc")
          .limit(6)
          .get();

        const otherUsersRequestsData = otherUsersRequestsSnapshot.docs
          .map((doc) => doc.data())
          .filter((request) => request.userID !== currentUserID);

        setLatestRequests(otherUsersRequestsData);
      } catch (error) {
        console.error("Error fetching latest requests:", error);
      }
    };

    fetchLatestListings();
    fetchLatestRequests();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NUS Pasar Malam</Text>
        <View style={styles.headerIconContainer}>
          <TouchableOpacity onPress={handleChatPress}>
            <Ionicons name="chatbubbles" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.headerText}>What are you looking for today?</Text>
      {renderCategories()}
      <LatestListings
        data={latestListings}
        onPress={handleListingPress}
        viewAll={handleViewAllListings}
      />
      {renderLatestRequests()}
      {renderBottomBar()}
    </View>
  );
};

export default Home;

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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: -5,
    padding: 10,
  },
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
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
    marginTop: 25,
    marginBottom: 150,
  },
  latestRequestsContainer: {
    marginTop: -100,
    marginBottom: 100,
  },
  latestListingsHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
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
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  textBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    flex: 1,
    borderRadius: 10,
  },
  requestCarouselItemContainer: {
    backgroundColor: "#2c2c2c",
  },
  requestInfoContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
  requestTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  timeElapsedText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  viewAllButton: {
    backgroundColor: "#3b3b3b",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  iconSpacing: {
    width: 10,
  },
});
