import { Tabs } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'coral',
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="Login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="sign-in" size={size} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="Transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
           <Feather name="user" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
