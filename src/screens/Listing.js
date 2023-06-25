import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import firebase from "../../database/Firebase";
import "firebase/auth";
import "firebase/firestore";

const Listing = ({ navigation }) => {
  const route = useRoute();
  const { listing } = route.params;
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleImageClick = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.carouselContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {listing.imageUrls.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImageClick(imageUrl)}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.carouselImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Adjust for safe area on Android
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  goBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  carouselContainer: {
    marginTop: 50,
    marginBottom: 20,
    height: 200,
  },
  carouselImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 5,
  },
});

export default Listing;
