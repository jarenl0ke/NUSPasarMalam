import { Text, TouchableOpacity, StyleSheet } from "react-native";

const ViewAllButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
      <Text style={styles.viewAllButtonText}>View all</Text>
    </TouchableOpacity>
  );
};

export default ViewAllButton;

const styles = StyleSheet.create({
  viewAllButton: {
    backgroundColor: "#3B3B3B",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  viewAllButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
