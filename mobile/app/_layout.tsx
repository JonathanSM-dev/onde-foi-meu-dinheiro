import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "../src/state/AppProvider";
function Routes() {
  const { active } = useApp();
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={!active}>
          <Stack.Screen name="(publico)" />
        </Stack.Protected>
        <Stack.Protected guard={active}>
          <Stack.Screen name="(privado)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function Layout() {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
}
