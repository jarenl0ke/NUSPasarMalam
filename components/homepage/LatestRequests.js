import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { getTimeElapsed } from "../../helpers";

import SubHeader from "../ui/SubHeader";
import ViewAllButton from "../ui/ViewAllButton";

const LatestRequests = ({ data, onPress, viewAll }) => {
  const renderRequestCarouselItem = ({ item }) => {
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
        onPress={() => onPress(item)} // Handle request item press
      >
        {/* Render the request title and time elapsed */}
        <View style={styles.requestInfoContainer}>
          <Text style={styles.requestTitle}>{item.requestTitle}</Text>
          <Text style={styles.timeElapsedText}>{timeElapsed}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.latestRequestsContainer}>
      <View style={styles.subContainer}>
        <SubHeader>Latest Requests</SubHeader>
        <ViewAllButton onPress={viewAll} />
      </View>
      <FlatList
        data={data}
        renderItem={renderRequestCarouselItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default LatestRequests;

const styles = StyleSheet.create({
  latestRequestsContainer: {
    marginTop: -100,
    marginBottom: 100,
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "centre",
    marginBottom: 10,
  },
  requestCarouselItemContainer: {
    backgroundColor: "#2C2C2C", // Adjust as needed
  },
  carouselItemContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    justifyContent: "center",
  },
  requestInfoContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background overlay color (adjust opacity as needed)
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
});
