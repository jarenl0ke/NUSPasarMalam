import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const categories = [
  {
    id: "1",
    title: "Books & Magazines",
    icon: require("../../assets/Images/books.png"),
    backgroundColor: "#ff7f50", // Coral color
  },
  {
    id: "2",
    title: "Clothing",
    icon: require("../../assets/Images/shirt.png"),
    backgroundColor: "#6495ed", // Cornflower blue color
  },
  {
    id: "3",
    title: "Electronic",
    icon: require("../../assets/Images/phone.png"),
    backgroundColor: "#20b2aa", // Light sea green color
  },
  {
    id: "4",
    title: "Health",
    icon: require("../../assets/Images/pill.png"),
    backgroundColor: "#9370db", // Medium purple color
  },
  {
    id: "5",
    title: "Home & Kitchen",
    icon: require("../../assets/Images/home.png"),
    backgroundColor: "#f08080", // Light coral color
  },
  {
    id: "6",
    title: "Food & Beverages",
    icon: require("../../assets/Images/food.png"),
    backgroundColor: "#ffa500", // Orange color
  },
  {
    id: "7",
    title: "Furniture",
    icon: require("../../assets/Images/couch.png"),
    backgroundColor: "#00ced1", // Dark turquoise color
  },
  {
    id: "8",
    title: "View All",
    icon: require("../../assets/Images/view.png"),
    backgroundColor: "#87ceeb", // Sky blue color
  },
];

const Home = () => {
  const navigation = useNavigation();

  // Dummy to handle search functionality
  const handleSearch = (text) => {
    console.log("Searching for:", text);
  };

  const handleChatPress = () => {
    navigation.navigate("MyChats");
  };

  const handleCategoryPress = (category) => {
    if (category.title === "View All") {
      navigation.navigate("AllListings");
    } else {
      // Handle other category presses if needed
      console.log("Category Pressed:", category.title);
    }
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
      />
    );
  };

  const renderBottomBar = () => {
    const handleAddListing = () => {
      navigation.navigate("AddListing");
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
      {renderCategories()}
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
});

export default Home;
