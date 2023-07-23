import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";

import SubHeaders from "../ui/SubHeaders";
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SubHeaders>Latest Listings</SubHeaders>
        <ViewAllButton onPress={viewAll} />
      </View>
      <FlatList
        data={data}
        renderItem={renderCarouselItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  );
};

export default LatestListings;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginBottom: 150,
  },
  headerContainer: {
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
});
