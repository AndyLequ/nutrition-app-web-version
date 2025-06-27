import React from "react";
import { Stack } from "expo-router";
import "@/global.css";
import { FoodProvider } from "./FoodProvider";
import { StyleSheet } from "react-native";

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
