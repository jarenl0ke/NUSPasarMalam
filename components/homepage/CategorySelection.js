import {
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

const CategorySelection = ({ onPress }) => {
  const renderCategoryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryItemContainer,
          { backgroundColor: item.backgroundColor },
        ]}
        onPress={() => onPress(item)}
      >
        <Image source={item.icon} style={styles.categoryIcon} />
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

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

export default CategorySelection;

const styles = StyleSheet.create({
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
});

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
