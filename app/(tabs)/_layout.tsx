import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="LogScreen"
        options={{
          title: "Today",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "clipboard" : "clipboard-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="addfood"
        options={{
          title: "Add Food",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Plans",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      {/* <Tabs.Screen name="more" options={{title: 'More',
        tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
        )
    }}/> */}
    </Tabs>
  );
}
