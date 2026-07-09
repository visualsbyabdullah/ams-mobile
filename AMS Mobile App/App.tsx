import { useEffect, useState } from "react";
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
import { EmployeeSessionProvider, useEmployeeSession } from "./src/features/session";
import { AuthUser } from "./src/features/auth/mockAuth";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import {
  clearAuthSession,
  getSavedAuthSession,
  saveAuthSession,
} from "./src/features/auth/authStorage";
import { colors } from "./src/theme";

function AppShell() {
  const {
    resolvedPolicy,
    loadEmployeeBundle,
    clearEmployeeBundle,
    loadingEmployeeBundle,
    employeeBundleError,
  } = useEmployeeSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    getSavedAuthSession()
      .then((savedUser) => {
        if (!mounted) return;

        if (savedUser) {
          setUser(savedUser);
        }
      })
      .finally(() => {
        if (mounted) {
          setAuthReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (nextUser: AuthUser, rememberMe: boolean) => {
    const loadedBundle = await loadEmployeeBundle(nextUser.email);

    if (!loadedBundle) {
      return;
    }
    setUser(nextUser);
    await saveAuthSession(nextUser, rememberMe);
  };

  const handleLogout = async () => {
    clearEmployeeBundle();
    await clearAuthSession();
    setUser(null);
  };
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

  if (!authReady) {
    return null;
  }

  if (!user) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator onLogout={handleLogout} resolvedPolicy={resolvedPolicy} />
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

export default function AppRoot() {
  return (
    <EmployeeSessionProvider>
      <AppShell />
    </EmployeeSessionProvider>
  );
}
