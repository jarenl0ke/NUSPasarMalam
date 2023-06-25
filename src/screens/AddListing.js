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

  const handleConditionChange = (value) => {
    setCondition(value);
  };

  const handlePriceChange = (text) => {
    setPrice(text);
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  const handleListIt = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;

        const listingData = {
          category,
          listingTitle,
          condition,
          price,
          description,
          userID: userId,
          listingDateTime: new Date().toISOString(),
        };

        const listingRef = await firebase
          .firestore()
          .collection("Listings")
          .add(listingData);
        const listingId = listingRef.id;

        const storage = getStorage();

        const uploadImagePromises = selectedImages.map(async (image, index) => {
          const response = await fetch(image.uri);
          const blob = await response.blob();

          const storageRef = ref(
            storage,
            `listings/${listingId}/image_${index}`
          );

          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);

          console.log(`Image ${index + 1} uploaded successfully.`); // Log successful upload

          return downloadUrl;
        });

        const imageUrls = await Promise.all(uploadImagePromises);

        console.log("Image URLs:", imageUrls); // Verify the imageUrls array contains valid URLs

        await listingRef.update({ imageUrls });

        setSelectedImages([]);
        setCategory("");
        setListingTitle("");
        setCondition(null);
        setPrice("");
        setDescription("");

        Alert.alert("Item listed successfully!");
        navigation.navigate("Home");
      } else {
        Alert.alert("User not found. Please log in again.");
        // Handle the case when the user is not logged in
      }
    } catch (error) {
      console.error("Error listing item:", error);
      // Handle the error appropriately
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
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
              <View style={styles.dropdownContainer}>
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

            <View style={styles.conditionContainer}>
              <Text style={styles.conditionHeader}>Condition:</Text>
              <View style={styles.conditionButtons}>
                <TouchableOpacity
                  style={[
                    styles.conditionOption,
                    condition === "New" && styles.conditionSelected,
                  ]}
                  onPress={() => handleConditionChange("New")}
                >
                  <AntDesign
                    name={condition === "New" ? "checkcircle" : "checkcircleo"}
                    size={24}
                    color="#FFFFFF"
                    style={styles.conditionIcon}
                  />
                  <Text style={styles.conditionText}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.conditionOption,
                    condition === "Used" && styles.conditionSelected,
                  ]}
                  onPress={() => handleConditionChange("Used")}
                >
                  <AntDesign
                    name={condition === "Used" ? "checkcircle" : "checkcircleo"}
                    size={24}
                    color="#FFFFFF"
                    style={styles.conditionIcon}
                  />
                  <Text style={styles.conditionText}>Used</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Price"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) => {
                const formattedText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                handlePriceChange(formattedText);
              }}
              value={price ? `$${price}` : ""}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.descriptionInput, { height: 120 }]}
              placeholder="Description"
              placeholderTextColor="#A9A9A9"
              onChangeText={handleDescriptionChange}
              value={description}
              multiline
              numberOfLines={6} // Increase the number of lines to make the description input box taller
            />
            <TouchableOpacity
              style={[
                styles.listItButton,
                isButtonDisabled && styles.disabledButton,
              ]}
              onPress={handleListIt}
              disabled={isButtonDisabled}
            >
              <Text style={styles.listItButtonText}>List It</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  categoryDropdownItem: {
    padding: 10,
  },
  categoryDropdownItemSelected: {
    backgroundColor: "#3D3D3D",
    padding: 10,
  },
  categoryDropdownItemText: {
    color: "#FFFFFF",
  },
  categoryText: {
    color: "#FFFFFF",
  },
  placeholderText: {
    color: "#FFFFFF",
  },
  conditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  conditionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 10,
  },
  conditionButtons: {
    flexDirection: "row",
  },
  conditionOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  conditionSelected: {
    backgroundColor: "#FF4500",
  },
  conditionIcon: {
    marginRight: 5,
  },
  conditionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  textInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  listItButton: {
    backgroundColor: "#FF4500",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  listItButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddListing;
