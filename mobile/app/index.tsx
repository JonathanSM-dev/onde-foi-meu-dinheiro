import { Redirect } from "expo-router";
import { useApp } from "../src/state/AppProvider";
export default function Index() {
  return <Redirect href={useApp().active ? "/(privado)/(tabs)" : "/login"} />;
}
