import { supabase } from "../../lib/supabase";
import {
  AuthUser,
  authenticateMockEmployee,
} from "./mockAuth";

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

export const loginEmployee = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (!error && data.user?.email) {
    return toAuthUser(data.user.id, data.user.email);
  }

  const mockUser = authenticateMockEmployee(normalizedEmail, password);

  if (mockUser) {
    return mockUser;
  }

  throw new Error("INVALID_CREDENTIALS");
};

export const logoutEmployee = async () => {
  await supabase.auth.signOut();
};
