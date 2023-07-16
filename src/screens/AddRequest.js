import React, { useState } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ModalDropdown from "react-native-modal-dropdown";

import Categories from "../../constants/Categories";

const AddRequest = ({ navigation }) => {
  const [requestTitle, setRequestTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleGoBack = () => {
    navigation.goBack();
  };

  const RequestTitleHandler = (text) => {
    setRequestTitle(text);
  };

  const selectCategoryHandler = (category) => {
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
});
