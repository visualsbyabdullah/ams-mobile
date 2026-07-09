import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthUser } from "./src/features/auth/mockAuth";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { colors } from "./src/theme";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen onLogin={setUser} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator onLogout={() => setUser(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});