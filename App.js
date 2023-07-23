import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import EditProfile from "./src/screens/EditProfile";
import MyListings from "./src/screens/listings/MyListings";
import MyRequests from "./src/screens/requests/MyRequests";
import AddListing from "./src/screens/listings/AddListing";
import AddRequest from "./src/screens/requests/AddRequest";
import AllListings from "./src/screens/listings/AllListings";
import AllRequests from "./src/screens/requests/AllRequests";
import Listing from "./src/screens/listings/Listing";
import Request from "./src/screens/requests/Request";
import Chat from "./src/screens/chats/Chat";
import MyChats from "./src/screens/chats/MyChats";
import SellerChat from "./src/screens/chats/SellerChat";
import Search from "./src/screens/Search";

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ gestureEnabled: false }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyListings"
            component={MyListings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyRequests"
            component={MyRequests}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddListing"
            component={AddListing}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddRequest"
            component={AddRequest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllListings"
            component={AllListings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllRequests"
            component={AllRequests}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Listing"
            component={Listing}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Request"
            component={Request}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyChats"
            component={MyChats}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SellerChat"
            component={SellerChat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
