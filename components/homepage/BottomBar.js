import { SafeAreaView, StyleSheet } from "react-native";

import BottomBarIcon from "../ui/BottomBarIcon";
import { set } from "react-native-reanimated";

const BottomBar = ({ listing, request, settings }) => {
  return (
    <SafeAreaView style={styles.bottomBar}>
      <BottomBarIcon
        onPress={listing}
        imageUrl={"../../assets/Images/sell.png"}
      />
      <BottomBarIcon
        onPress={request}
        imageUrl={"../../assets/Images/buy.png"}
      />
      <BottomBarIcon
        onPress={settings}
        imageUrl={"../../assets/Images/settings.png"}
      />
    </SafeAreaView>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
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
});
