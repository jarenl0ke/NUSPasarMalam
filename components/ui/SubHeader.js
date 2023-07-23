import { Text, StyleSheet } from "react-native";

export default SubHeader = ({ children }) => {
  return <Text style={styles.subHeader}>{children}</Text>;
};

const styles = StyleSheet.create({
  subHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
});
