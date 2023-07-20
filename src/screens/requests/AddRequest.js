import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ModalDropdown from "react-native-modal-dropdown";
import firebase from "../../../database/Firebase";
import "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Categories from "../../../constants/Categories";

const AddRequest = ({ navigation }) => {
  const [requestTitle, setRequestTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    validateForm();
    fetchUserId();
  }, [requestTitle, category, description]);

  const validateForm = () => {
    const isValid =
      requestTitle.trim() !== "" &&
      category.trim() !== "" &&
      description.trim() !== "";
    setIsButtonDisabled(!isValid);
  };

  const fetchUserId = async () => {
    try {
      const user = firebase.auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const RequestTitleHandler = (text) => {
    setRequestTitle(text);
  };

  const selectCategoryHandler = (index, category) => {
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

  const descriptionChangeHandler = (text) => {
    setDescription(text);
  };

  const requestItHandler = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const requestData = {
          requestTitle,
          category,
          description,
          userID: userId,
          listingDateTime: new Date().toISOString(),
        };

        const requestRef = await firebase
          .firestore()
          .collection("Requests")
          .add(requestData);

        setRequestTitle("");
        setCategory("");
        setDescription("");

        Alert.alert("Item requested successfully!");
        navigation.navigate("Home");
      } else {
        Alert.alert("User not found. Please log in again.");
      }
    } catch (error) {
      console.error("Error requesting item:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.pageHeader}>Add Request</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Request Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={RequestTitleHandler}
              value={requestTitle}
            />
            <ModalDropdown
              style={styles.categoryDropdown}
              dropdownStyle={styles.categoryDropdownList}
              options={Categories}
              onSelect={selectCategoryHandler}
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
              style={styles.descriptionInput}
              placeholder="Description"
              placeholderTextColor="#A9A9A9"
              onChangeText={descriptionChangeHandler}
              value={description}
              multiline
              numberOfLines={6}
            />
            <TouchableOpacity
              style={[
                styles.requestItButton,
                isButtonDisabled && styles.disabledButton,
              ]}
              onPress={requestItHandler}
              disabled={isButtonDisabled}
            >
              <Text style={styles.requestItButtonText}>Request It</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AddRequest;

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
  formContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    flex: 1,
  },
  textInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
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
  descriptionInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    height: 120,
    textAlignVertical: "top",
  },
  requestItButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  requestItButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
