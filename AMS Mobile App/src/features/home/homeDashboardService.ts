import { supabase } from "../../lib/supabase";
import { EmployeeBundle } from "../database/amsDataService";

export type HomeDashboardData = {
  pendingRequestsCount: number;
  attendanceRate: number | null;
  latestSalaryDate: string | null;
  todayCheckIn: string | null;
  todayCheckOut: string | null;
};

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    today: now.toISOString().slice(0, 10),
  };
};

const formatTime = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getHomeDashboardData = async (
  bundle: EmployeeBundle
): Promise<HomeDashboardData> => {
  const { startDate, endDate, today } = getMonthRange();

  const employeeId = bundle.employee.id;

  const pendingRequestsPromise = supabase
    .from("employee_requests")
    .select("id", { count: "exact", head: true })
    .eq("employee_id", employeeId)
    .eq("status", "pending");

  const attendancePromise = supabase
    .from("attendance_logs")
    .select("attendance_date,status")
    .eq("employee_id", employeeId)
    .gte("attendance_date", startDate)
    .lte("attendance_date", endDate);

  const todayAttendancePromise = supabase
    .from("attendance_logs")
    .select("check_in_at,check_out_at")
    .eq("employee_id", employeeId)
    .eq("attendance_date", today)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const salaryPromise = supabase
    .from("salary_slips")
    .select("salary_month,status")
    .eq("employee_id", employeeId)
    .order("salary_month", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [
    pendingRequestsResult,
    attendanceResult,
    todayAttendanceResult,
    salaryResult,
  ] = await Promise.all([
    pendingRequestsPromise,
    attendancePromise,
    todayAttendancePromise,
    salaryPromise,
  ]);

  if (pendingRequestsResult.error) {
    throw new Error(pendingRequestsResult.error.message);
  }

  if (attendanceResult.error) {
    throw new Error(attendanceResult.error.message);
  }

  if (todayAttendanceResult.error) {
    throw new Error(todayAttendanceResult.error.message);
  }

  if (salaryResult.error) {
    throw new Error(salaryResult.error.message);
  }

  const attendanceRows = attendanceResult.data ?? [];
  const presentRows = attendanceRows.filter((row) => {
    return ["present", "late", "half_day"].includes(String(row.status));
  });

  const attendanceRate =
    attendanceRows.length > 0
      ? Math.round((presentRows.length / attendanceRows.length) * 100)
      : null;

  return {
    pendingRequestsCount: pendingRequestsResult.count ?? 0,
    attendanceRate,
    latestSalaryDate: salaryResult.data?.salary_month ?? null,
    todayCheckIn: formatTime(todayAttendanceResult.data?.check_in_at),
    todayCheckOut: formatTime(todayAttendanceResult.data?.check_out_at),
  };
};
