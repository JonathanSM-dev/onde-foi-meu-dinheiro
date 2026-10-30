import { Tabs } from "expo-router/js-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../src/theme";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="home-outline" color={focused ? colors.green : colors.muted} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="receipt-outline" color={focused ? colors.green : colors.muted} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orcamentos"
        options={{
          title: "Orçamentos",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="wallet-outline" color={focused ? colors.green : colors.muted} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="resumo"
        options={{
          title: "Resumo",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="bar-chart-outline" color={focused ? colors.green : colors.muted} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
