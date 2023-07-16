import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Home = ({ navigation }) => {
  // Dummy to handle search functionality
  const handleSearch = (text) => {
    console.log("Searching for:", text);
  };

  // Navigate to all listings Screen
  const handleViewAll = () => {
    navigation.navigate("AllListings");
  };

  const renderCarouselItems = (
    header,
    placeholderImage,
    placeholderPrice,
    placeholderPosted
  ) => {
    // Example data for carousel items
    const items = [
      {
        id: 1,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
      {
        id: 2,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
      {
        id: 3,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
      {
        id: 4,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
      {
        id: 5,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
      {
        id: 6,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
      {
        id: 7,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
      {
        id: 8,
        image: placeholderImage,
        price: placeholderPrice,
        posted: placeholderPosted,
      },
    ];

    return (
      <View style={styles.carouselContainer}>
        <Text style={styles.carouselHeader}>{header}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <TouchableOpacity key={item.id} style={styles.carouselItem}>
              <Image source={item.image} style={styles.carouselItemImage} />
              <Text style={styles.carouselItemPrice}>${item.price}</Text>
              <Text style={styles.carouselItemPosted}>
                Posted {item.posted} ago
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
          <Text style={styles.viewAllButtonText}>View All</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleChatPress = () => {
    navigation.navigate("MyChats");
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
            source={require("../../assets/Images/buy.png")}
            style={styles.bottomBarIcon}
          />
          <Text style={styles.bottomBarText}>Create Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={handleAddRequest}
        >
          <Image
            source={require("../../assets/Images/sell.png")}
            style={styles.bottomBarIcon}
          />
          <Text style={styles.bottomBarText}>Create Request</Text>
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
      {renderCarouselItems(
        "Hot Listings:",
        require("../../assets/Images/aircon.jpeg"),
        "10",
        "2 days"
      )}
      <View style={styles.gap} />
      {renderCarouselItems(
        "Hot Requests:",
        require("../../assets/Images/lipstick.jpeg"),
        "20",
        "1 day"
      )}
      {renderBottomBar()}
    </View>
  );
};
const styles = StyleSheet.create({
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
  carouselContainer: {
    marginBottom: 20,
  },
  carouselHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  carouselItem: {
    backgroundColor: "#CCCCCC",
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  carouselItemImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  carouselItemPrice: {
    color: "#000000",
    fontSize: 16,
  },
  carouselItemPosted: {
    color: "#000000",
    fontSize: 14,
  },
  viewAllButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  viewAllButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  gap: {
    height: 20,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    width: "100%",
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
});

export default Home;
