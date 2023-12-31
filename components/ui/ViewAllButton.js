import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default ViewAllButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
      <Text style={styles.viewAllButtonText}>View All</Text>
    </TouchableOpacity>
  );
};

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
