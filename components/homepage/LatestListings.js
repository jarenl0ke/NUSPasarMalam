import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from "react-native";

import SubHeader from "../ui/SubHeader";
import ViewAllButton from "../ui/ViewAllButton";

const LatestListings = ({ data, onPress, viewAll }) => {
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
        onPress={() => onPress(item)}
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

  return (
    <View style={styles.latestListingsContainer}>
      <View style={styles.subHeaderContainer}>
        <SubHeader>Latest Listings</SubHeader>
        <ViewAllButton onPress={viewAll} />
      </View>
      <FlatList
        data={data}
        renderItem={renderCarouselItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default LatestListings;

const styles = StyleSheet.create({
  latestListingsContainer: {
    marginTop: 0,
    marginBottom: 150,
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
