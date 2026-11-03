import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "../context/AuthContext";
import { AssetProvider } from "../context/AssetContext";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthProvider>
        <AssetProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AssetProvider>
      </AuthProvider>
    </>
  );
}