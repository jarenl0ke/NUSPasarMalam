import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default BottomBarIcon = ({ onPress, imageUrl }) => {
  return (
    <TouchableOpacity style={styles.bottomBarItem} onPress={onPress}>
      <Image source={require(imageUrl)} style={styles.bottomBarIcon} />
      <Text style={styles.bottomBarText}>New Listing</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
