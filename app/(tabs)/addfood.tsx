import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Pressable,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFood } from "../FoodProvider";
import debounce from "lodash.debounce";
import axios from "axios";
import { foodApi } from "../../services/api";
import DropDownPicker from "react-native-dropdown-picker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SearchFood } from "../components/SearchFood";
import { CustomFood } from "../components/CustomFood";

const TopTab = createMaterialTopTabNavigator();

const AddFood = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100 },
        tabBarStyle: { backgroundColor: "#f1f5f9" },
      }}
    >
      <TopTab.Screen name="Add Food" component={SearchFood} />
      <TopTab.Screen name="Custom Food" component={CustomFood} />
    </TopTab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  inputFocused: {
    borderColor: "#6366f1",
    borderWidth: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    height: 40,
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#6366f1",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    height: 30,
    backgroundColor: "#6366f1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    margin: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
});

export default AddFood;
