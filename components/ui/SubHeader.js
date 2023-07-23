import { Text, StyleSheet } from "react-native";

const SubHeader = ({ children }) => {
  return <Text style={styles.subHeader}>{children}</Text>;
};

export default SubHeader;

const styles = StyleSheet.create({
  subHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
});
