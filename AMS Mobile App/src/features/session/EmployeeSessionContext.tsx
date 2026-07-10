import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  EmployeeBundle,
  getEmployeeBundleByAuthUserIdOrEmail,
} from "../database/amsDataService";
import { ResolvedPolicy } from "../policies/types";
import { defaultPolicy } from "../../config/defaultPolicy";

type EmployeeSessionContextValue = {
  employeeBundle: EmployeeBundle | null;
  resolvedPolicy: ResolvedPolicy;
  loadingEmployeeBundle: boolean;
  employeeBundleError: string | null;
  loadEmployeeBundle: (
    email: string,
    authUserId?: string | null
  ) => Promise<EmployeeBundle | null>;
  clearEmployeeBundle: () => void;
};

const EmployeeSessionContext =
  createContext<EmployeeSessionContextValue | null>(null);

export const EmployeeSessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [employeeBundle, setEmployeeBundle] =
    useState<EmployeeBundle | null>(null);
  const [loadingEmployeeBundle, setLoadingEmployeeBundle] = useState(false);
  const [employeeBundleError, setEmployeeBundleError] =
    useState<string | null>(null);

  const loadEmployeeBundle = async (
    email: string,
    authUserId?: string | null
  ) => {
    setLoadingEmployeeBundle(true);
    setEmployeeBundleError(null);

    try {
      const bundle = await getEmployeeBundleByAuthUserIdOrEmail(
        authUserId,
        email
      );
      setEmployeeBundle(bundle);
      return bundle;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load employee profile.";

      setEmployeeBundle(null);
      setEmployeeBundleError(message);
      return null;
    } finally {
      setLoadingEmployeeBundle(false);
    }
  };

  const clearEmployeeBundle = () => {
    setEmployeeBundle(null);
    setEmployeeBundleError(null);
    setLoadingEmployeeBundle(false);
  };

  const value = useMemo<EmployeeSessionContextValue>(
    () => ({
      employeeBundle,
      resolvedPolicy: employeeBundle?.resolvedPolicy ?? defaultPolicy,
      loadingEmployeeBundle,
      employeeBundleError,
      loadEmployeeBundle,
      clearEmployeeBundle,
    }),
    [employeeBundle, loadingEmployeeBundle, employeeBundleError]
  );

  return (
    <EmployeeSessionContext.Provider value={value}>
      {children}
    </EmployeeSessionContext.Provider>
  );
};

export const useEmployeeSession = () => {
  const context = useContext(EmployeeSessionContext);

  if (!context) {
    throw new Error(
      "useEmployeeSession must be used inside EmployeeSessionProvider."
    );
  }

  return context;
};
