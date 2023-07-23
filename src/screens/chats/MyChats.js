import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../../database/Firebase";
import "firebase/auth";
import "firebase/firestore";

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("Selling"); // Default active tab is "Selling"
  const navigation = useNavigation();

  // Additional state to store chat details
  const [chatDetails, setChatDetails] = useState([]);

  // Additional state to store listing names
  const [listingTitles, setListingTitles] = useState({});

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshot = await firebase
          .firestore()
          .collection("Chats")
          .where(
            activeTab === "Selling" ? "sellerID" : "buyerID",
            "==",
            currentUserID
          )
          .get();

        const chatList = snapshot.docs.map((doc) => ({
          id: doc.id,
          buyerID: doc.data().buyerID,
          listingID: doc.data().listingID,
          sellerID: doc.data().sellerID,
        }));

        setChats(chatList);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    const fetchChatDetails = async () => {
      try {
        const details = await Promise.all(
          chats.map(async (chat) => {
            const lastMessage = await fetchLastMessage(chat.id);
            const imageUrl = await fetchListingImage(chat.listingID);
            return {
              id: chat.id,
              listingID: chat.listingID,
              lastMessage,
              imageUrl,
            };
          })
        );

        setChatDetails(details);
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    };

    const fetchListingTitles = async () => {
      try {
        const titles = await Promise.all(
          chats.map(async (chat) => {
            const listingSnapshot = await firebase
              .firestore()
              .collection("Listings")
              .doc(chat.listingID)
              .get();

            if (listingSnapshot.exists) {
              return {
                id: chat.id,
                title: listingSnapshot.data().listingTitle, // Get the listing title
              };
            } else {
              return {
                id: chat.id,
                title: "Listing not found",
              };
            }
          })
        );

        const titlesMap = {};
        titles.forEach((item) => {
          titlesMap[item.id] = item.title;
        });

        setListingTitles(titlesMap);
      } catch (error) {
        console.error("Error fetching listing titles:", error);
      }
    };

    fetchChats();
    fetchChatDetails();
    fetchListingTitles();
  }, [activeTab, chats]);

  const fetchLastMessage = async (chatID) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("Chats")
        .doc(chatID)
        .collection("Messages")
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

      if (!snapshot.empty) {
        return snapshot.docs[0].data().message;
      } else {
        return "No messages";
      }
    } catch (error) {
      console.error("Error fetching last message:", error);
      return "Error";
    }
  };

  const fetchListingImage = async (listingID) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("Listings")
        .doc(listingID)
        .get();

      if (snapshot.exists) {
        const imageUrl = snapshot.data().imageUrls[0];
        return imageUrl;
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error fetching listing image:", error);
      return "";
    }
  };
  const handleChatPress = async (listingID) => {
    const chatListing = chatDetails.find(
      (chat) => chat.listingID === listingID
    );

    if (chatListing) {
      const { buyerID, listingID, sellerID, imageUrl } = chatListing;

      try {
        const listingSnapshot = await firebase
          .firestore()
          .collection("Listings")
          .doc(listingID)
          .get();

        if (listingSnapshot.exists) {
          if (imageUrl) {
            if (activeTab === "Selling") {
              navigation.navigate("SellerChat", {
                listing: listingSnapshot,
                imageUrl,
              });
            } else {
              navigation.navigate("Chat", { listing: listingSnapshot });
            }
          } else {
            console.log("Listing image not available");
            // Handle the case when the image is not available, e.g., show a placeholder image
          }
        } else {
          console.log("Listing does not exist");
        }
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.header}>My Chats</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Selling" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Selling")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "Selling" && styles.activeTabText,
            ]}
          >
            Selling
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Buying" && styles.activeTab]}
          onPress={() => setActiveTab("Buying")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "Buying" && styles.activeTabText,
            ]}
          >
            Buying
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {chatDetails.length > 0 ? (
          chatDetails.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() => handleChatPress(chat.listingID)}
            >
              <View style={styles.chatContent}>
                <Image
                  source={
                    chat.imageUrl
                      ? { uri: chat.imageUrl }
                      : require("../../../assets/Images/settings.png")
                  }
                  style={styles.listingImage}
                />
                <View style={styles.chatDetails}>
                  <Text style={styles.chatTitle}>
                    {listingTitles[chat.id]} {/* Display listing name */}
                  </Text>
                  <Text style={styles.lastMessageText}>
                    Last Message: {chat.lastMessage}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noChatsText}>No chats available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  goBackButton: {
    marginRight: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#1E90FF",
  },
  tabButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  activeTabText: {
    color: "#1E90FF",
  },
  chatItem: {
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#1E1E1E",
    padding: 10,
  },
  chatContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listingImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  lastMessageText: {
    fontSize: 14,
    color: "#D3D3D3", // Light gray color for last message text
  },
  noChatsText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyChats;
