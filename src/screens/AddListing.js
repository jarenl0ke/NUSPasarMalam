import React, { useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ModalDropdown from "react-native-modal-dropdown";
import * as ImagePicker from "expo-image-picker";
import firebase from "../../database/Firebase";
import "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const categories = [
  "Electronics",
  "Clothing & Accessories",
  "Home & Kitchen",
  "Furniture",
  "Books & Magazines",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Toys & Games",
  "Health & Fitness",
  "Jewelry & Watches",
  "Automotive",
  "Baby & Kids",
  "Art & Collectibles",
  "Musical Instruments",
  "Pet Supplies",
  "Tools & Home Improvement",
  "Office Supplies",
  "Garden & Outdoor",
  "Food & Beverages",
];

const AddListing = ({ navigation }) => {
  // States to track
  const [selectedImages, setSelectedImages] = useState([]);
  const [category, setCategory] = useState("");
  const [listingTitle, setListingTitle] = useState("");
  const [condition, setCondition] = useState(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [userId, setUserId] = useState("");
  const [listingDateTime, setListingDateTime] = useState("");

  // To navigate to previous screen
  const handleGoBack = () => {
    navigation.goBack();
  };

  // To Remove an Image
  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  // To Pick Image
  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!pickerResult.canceled) {
      const selectedAssets = pickerResult.assets.map((asset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      }));

      setSelectedImages([...selectedImages, ...selectedAssets]);
    }
  };

  const handleCategorySelect = (index, category) => {
    setCategory(category);
  };

  const renderCategoryRow = (option, index, isSelected) => (
    <View
      style={
        isSelected
          ? styles.categoryDropdownItemSelected
          : styles.categoryDropdownItem
      }
    >
      <Text style={styles.categoryDropdownItemText}>{option}</Text>
    </View>
  );

  const handleListingTitleChange = (text) => {
    setListingTitle(text);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.pageHeader}>Add Listing</Text>
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.carouselScrollView}
            showsHorizontalScrollIndicator={false}
          >
            {selectedImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onPress={() => handleRemoveImage(index)}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
                <View style={styles.removeImageButton}>
                  <AntDesign
                    name="close"
                    size={16}
                    color="#FFFFFF"
                    style={styles.removeImageIcon}
                  />
                </View>
              </TouchableOpacity>
            ))}
            {selectedImages.length < 7 && (
              <TouchableOpacity
                style={styles.addMorePhotosButton}
                onPress={handleImagePicker}
              >
                <AntDesign
                  name="plus"
                  size={24}
                  color="#FFFFFF"
                  style={styles.addMorePhotosIcon}
                />
                <Text style={styles.addMorePhotosText}>Add More Photos</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        <View style={styles.formContainer}>
          <ModalDropdown
            style={styles.categoryDropdown}
            dropdownStyle={styles.categoryDropdownList}
            options={categories}
            onSelect={handleCategorySelect}
            renderRow={renderCategoryRow}
          >
            <View>
              {category ? (
                <Text style={styles.categoryText}>{category}</Text>
              ) : (
                <Text style={styles.placeholderText}>Select Category</Text>
              )}
            </View>
          </ModalDropdown>
          <TextInput
            style={styles.textInput}
            placeholder="Listing Title"
            placeholderTextColor="#A9A9A9"
            onChangeText={handleListingTitleChange}
            value={listingTitle}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  goBackButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 1,
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
  },
  carouselContainer: {
    height: 120,
    marginBottom: 30,
  },
  carouselScrollView: {
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
    width: 80,
    height: 80,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FF0000",
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeImageIcon: {
    fontSize: 16,
  },
  addMorePhotosButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "#1E90FF",
    borderRadius: 10,
  },
  addMorePhotosIcon: {
    marginBottom: 5,
  },
  addMorePhotosText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  formContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  categoryDropdown: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  categoryDropdownList: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 5,
  },
  categoryText: {
    color: "#FFFFFF",
  },
  placeholderText: {
    color: "#FFFFFF",
  },
  textInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
});

export default AddListing;
