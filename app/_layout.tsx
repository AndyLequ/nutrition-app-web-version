import React from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import "@/global.css";
import { FoodProvider } from "./FoodProvider";

export default function RootLayout() {
  return (
    <FoodProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </FoodProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
