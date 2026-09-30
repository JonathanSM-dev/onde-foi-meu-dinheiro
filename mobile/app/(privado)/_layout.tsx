import { Stack } from "expo-router";
import { colors } from "../../src/theme";
export default function PrivateLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.green,
        headerTitle: "",
        headerBackTitle: "Voltar",
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
