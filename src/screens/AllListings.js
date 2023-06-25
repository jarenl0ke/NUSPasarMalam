import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import firebase from "../firebase";
import "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import ModalDropdown from "react-native-modal-dropdown";

const categories = [
  "All Categories",
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

const AllListings = ({ navigation }) => {
  return;
};

export default AllListings;
