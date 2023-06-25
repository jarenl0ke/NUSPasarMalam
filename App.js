import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import EditProfile from "./src/screens/EditProfile";
import MyListings from "./src/screens/MyListings";
import AddListing from "./src/screens/AddListing";
import AllListings from "./src/screens/AllListings";

const Stack = createStackNavigator();

export default function App() {
  return (
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
          name="AddListing"
          component={AddListing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllListings"
          component={AllListings}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
