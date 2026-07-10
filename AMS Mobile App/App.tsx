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
import { ResetPasswordSheet } from "./src/components/auth/ResetPasswordSheet";
import { logoutEmployee } from "./src/features/auth/employeeAuthService";
import {
  clearAuthSession,
  getSavedAuthSession,
  saveAuthSession,
} from "./src/features/auth/authStorage";
import { colors } from "./src/theme";
import { installWebFocusReset } from "./src/lib/installWebFocusReset";
import { supabase } from "./src/lib/supabase";

function AppShell() {
  installWebFocusReset();
  const {
    employeeBundle,
    resolvedPolicy,
    loadEmployeeBundle,
    clearEmployeeBundle,
    loadingEmployeeBundle,
    employeeBundleError,
  } = useEmployeeSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setResetPasswordVisible(true);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

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
    await loadEmployeeBundle(nextUser.email, nextUser.id);
    setUser(nextUser);
    await saveAuthSession(nextUser, rememberMe);
  };

  const handleLogout = async () => {
    clearEmployeeBundle();
    await logoutEmployee();
    await clearAuthSession();
    setUser(null);
  };
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (
      !authReady ||
      !user?.email ||
      employeeBundle ||
      loadingEmployeeBundle ||
      employeeBundleError
    ) {
      return;
    }

    void loadEmployeeBundle(user.email, user.id);
  }, [
    authReady,
    user?.email,
    employeeBundle,
    loadingEmployeeBundle,
    employeeBundleError,
  ]);

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
        <ResetPasswordSheet
          visible={resetPasswordVisible}
          onClose={() => setResetPasswordVisible(false)}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator onLogout={handleLogout} resolvedPolicy={resolvedPolicy} />
      <ResetPasswordSheet
        visible={resetPasswordVisible}
        onClose={() => setResetPasswordVisible(false)}
      />
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
