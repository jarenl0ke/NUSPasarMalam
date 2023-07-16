import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../database/Firebase";
import "firebase/auth";
import "firebase/firestore";

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("Selling"); // Default active tab is "Selling"
  const navigation = useNavigation();

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

    fetchChats();
  }, [activeTab]);

  const handleChatPress = async (listingID) => {
    const chatListing = chats.find((chat) => chat.listingID === listingID);

    if (chatListing) {
      const { buyerID, listingID, sellerID } = chatListing;

      try {
        const listingSnapshot = await firebase
          .firestore()
          .collection("Listings")
          .doc(listingID)
          .get();

        if (listingSnapshot.exists) {
          const imageUrl = listingSnapshot.data().imageUrls[0];
          if (activeTab === "Selling") {
            navigation.navigate("SellerChat", {
              listing: listingSnapshot,
              imageUrl,
            });
          } else {
            navigation.navigate("Chat", { listing: listingSnapshot, imageUrl });
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
          style={[
            styles.tabButton,
            activeTab === "Buying" && styles.activeTab,
          ]}
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
        {chats.length > 0 ? (
          chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() => handleChatPress(chat.listingID)}
            >
              <View style={styles.chatContent}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="#FFFFFF"
                />
                <Text style={styles.chatText}>
                  Chat for Listing {chat.listingID}
                </Text>
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
  chatText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FFFFFF",
  },
  noChatsText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyChats;
