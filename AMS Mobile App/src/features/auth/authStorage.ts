import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "./mockAuth";

const AUTH_USER_KEY = "ams.auth.user";
const REMEMBER_ME_KEY = "ams.auth.rememberMe";

export const saveAuthSession = async (user: AuthUser, rememberMe: boolean) => {
  if (!rememberMe) {
    await AsyncStorage.multiRemove([AUTH_USER_KEY, REMEMBER_ME_KEY]);
    return;
  }

  await AsyncStorage.multiSet([
    [AUTH_USER_KEY, JSON.stringify(user)],
    [REMEMBER_ME_KEY, "true"],
  ]);
};

export const getSavedAuthSession = async () => {
  const [[, rememberMe], [, userJson]] = await AsyncStorage.multiGet([
    REMEMBER_ME_KEY,
    AUTH_USER_KEY,
  ]);

  if (rememberMe !== "true" || !userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson) as AuthUser;
  } catch {
    await AsyncStorage.multiRemove([AUTH_USER_KEY, REMEMBER_ME_KEY]);
    return null;
  }
};

export const clearAuthSession = async () => {
  await AsyncStorage.multiRemove([AUTH_USER_KEY, REMEMBER_ME_KEY]);
};
