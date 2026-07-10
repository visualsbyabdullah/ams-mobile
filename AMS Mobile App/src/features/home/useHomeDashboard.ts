import { useCallback, useEffect, useState } from "react";

import { useEmployeeSession } from "../session";
import {
  getHomeDashboardData,
  HomeDashboardData,
} from "./homeDashboardService";

export const useHomeDashboard = () => {
  const { employeeBundle } = useEmployeeSession();

  const [data, setData] = useState<HomeDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!employeeBundle) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextData = await getHomeDashboardData(employeeBundle);
      setData(nextData);
    } catch (dashboardError) {
      setError(
        dashboardError instanceof Error
          ? dashboardError.message
          : "Unable to load home dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [employeeBundle]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
};
