import { useCallback, useEffect, useState } from "react";

import { useEmployeeSession } from "../session";
import {
  cancelEmployeeRequest,
  createEmployeeRequest,
  CreateEmployeeRequestInput,
  EmployeeRequest,
  getEmployeeRequests,
} from "./employeeRequestService";
import {
  emitEmployeeRequestChanged,
  subscribeEmployeeRequestChanged,
} from "./requestEvents";

export const useEmployeeRequests = () => {
  const { employeeBundle } = useEmployeeSession();

  const [requests, setRequests] = useState<EmployeeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!employeeBundle) {
      setRequests([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextRequests = await getEmployeeRequests(employeeBundle);
      setRequests(nextRequests);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load requests."
      );
    } finally {
      setLoading(false);
    }
  }, [employeeBundle]);

  const createRequest = useCallback(
    async (input: CreateEmployeeRequestInput) => {
      if (!employeeBundle) {
        throw new Error("Employee profile is not loaded.");
      }

      setSaving(true);
      setError(null);

      try {
        const nextRequest = await createEmployeeRequest(employeeBundle, input);
        setRequests((current) => [nextRequest, ...current]);
        emitEmployeeRequestChanged();
        return nextRequest;
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to create request.";

        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [employeeBundle]
  );

  const cancelRequest = useCallback(
    async (requestId: string) => {
      if (!employeeBundle) {
        throw new Error("Employee profile is not loaded.");
      }

      setSaving(true);
      setError(null);

      try {
        await cancelEmployeeRequest(employeeBundle, requestId);
        setRequests((current) =>
          current.map((item) =>
            item.id === requestId
              ? {
                  ...item,
                  status: "cancelled",
                }
              : item
          )
        );
        emitEmployeeRequestChanged();
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to cancel request.";

        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [employeeBundle]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    requests,
    loading,
    saving,
    error,
    refresh,
    createRequest,
    cancelRequest,
  };
};
