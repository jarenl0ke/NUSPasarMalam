import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import firebase from "../../../database/Firebase";
import "firebase/auth";
import "firebase/firestore";

const Chat = () => {
  const route = useRoute();
  const { listing } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const currentUserID = firebase.auth().currentUser.uid;
  const [chatID, setChatID] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const imageSnapshot = await firebase
          .firestore()
          .collection("Listings")
          .doc(listing.id)
          .get();

        if (imageSnapshot.exists) {
          const data = imageSnapshot.data();
          setImageUrl(data.imageUrls[0]);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };

    // Fetch the image URL for the listing
    fetchImageUrl();

    let chatID = null;
    const unsubscribe = firebase
      .firestore()
      .collection("Chats")
      .where("listingID", "==", listing.id)
      .where("buyerID", "==", currentUserID)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const chatDoc = snapshot.docs[0];
          chatID = chatDoc.id;
          fetchMessages(chatID);
          setChatID(chatID); // Store chatID in state variable
        } else {
          createChat();
        }
      });

    return () => unsubscribe();
  }, []);

  const fetchMessages = (chatID) => {
    firebase
      .firestore()
      .collection("Chats")
      .doc(chatID)
      .collection("Messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const messageList = [];
        snapshot.forEach((doc) => {
          messageList.push(doc.data());
        });
        setMessages(messageList);
      });
  };

  const createChat = async () => {
    try {
      const chatRef = await firebase.firestore().collection("Chats").add({
        sellerID: listing.userID,
        listingID: listing.id,
        buyerID: currentUserID,
      });

      const newChatID = chatRef.id; // Get the newly created chat ID
      setChatID(newChatID); // Store chatID in state variable
      fetchMessages(newChatID);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSend = async () => {
    if (inputMessage.trim() === "") return;

    try {
      const newMessage = {
        sender: currentUserID,
        message: inputMessage.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const chatRef = firebase.firestore().collection("Chats").doc(chatID); // Use the chatID obtained from fetchMessages or createChat

      await chatRef.collection("Messages").add(newMessage);

      setInputMessage("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const listingTitle =
    listing.listingTitle || (listing.data && listing.data().listingTitle);
  const listingPrice = listing.price || (listing.data && listing.data().price);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.listingImage} />
          ) : null}
          <View style={styles.listingDetails}>
            <Text style={styles.listingTitle}>{listingTitle}</Text>
            <Text style={styles.listingPrice}>Price: ${listingPrice}</Text>
          </View>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === firebase.auth().currentUser.uid
                ? styles.currentUserMessageContainer
                : styles.otherUserMessageContainer,
            ]}
          >
            <Text style={styles.messageText}>{message.message}</Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Adjust for safe area on Android
  },
  goBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  messageContainer: {
    maxWidth: "70%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  currentUserMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#1E90FF",
  },
  otherUserMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#1E1E1E",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  input: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#FFFFFF",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 25,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 100,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listingImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 5,
    marginRight: 10,
  },
  listingDetails: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listingPrice: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
  },
});

export default Chat;
