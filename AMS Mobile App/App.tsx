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

import { ResetPasswordSheet } from "./src/components/auth/ResetPasswordSheet";
import { logoutEmployee } from "./src/features/auth/employeeAuthService";
import { AuthUser } from "./src/features/auth/mockAuth";
import {
  clearAuthSession,
  saveAuthSession,
} from "./src/features/auth/authStorage";
import {
  EmployeeSessionProvider,
  useEmployeeSession,
} from "./src/features/session";
import { installWebFocusReset } from "./src/lib/installWebFocusReset";
import { supabase } from "./src/lib/supabase";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { colors } from "./src/theme";

const toAuthUser = (id: string, email: string): AuthUser => {
  return {
    id,
    name: email.split("@")[0],
    email,
    role: "employee",
    organizationId: "",
    branchId: "",
  };
};

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

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

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

    const bootSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (!mounted) {
        return;
      }

      if (sessionUser?.email) {
        setUser(toAuthUser(sessionUser.id, sessionUser.email));
      } else {
        await clearAuthSession();
        clearEmployeeBundle();
        setUser(null);
      }

      setAuthReady(true);
    };

    void bootSession();

    return () => {
      mounted = false;
    };
  }, [clearEmployeeBundle]);

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
    user?.id,
    employeeBundle,
    loadingEmployeeBundle,
    employeeBundleError,
    loadEmployeeBundle,
  ]);

  const handleLogin = async (nextUser: AuthUser, rememberMe: boolean) => {
    const loadedBundle = await loadEmployeeBundle(nextUser.email, nextUser.id);

    if (!loadedBundle) {
      await logoutEmployee();
      await clearAuthSession();
      throw new Error("EMPLOYEE_PROFILE_NOT_LOADED");
    }

    setUser(nextUser);
    await saveAuthSession(nextUser, rememberMe);
  };

  const handleLogout = async () => {
    clearEmployeeBundle();
    await logoutEmployee();
    await clearAuthSession();
    setUser(null);
  };

  if (!fontsLoaded || !authReady) {
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
