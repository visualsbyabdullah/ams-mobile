import { supabase } from "../../lib/supabase";

export type DbEmployee = {
  id: string;
  auth_user_id: string | null;
  organization_id: string;
  branch_id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  department: string | null;
  status: "active" | "inactive" | "terminated";
  joining_date: string | null;
  date_of_birth: string | null;
  cnic: string | null;
  address: string | null;
  city: string | null;
  post_code: string | null;
};

export type DbBranch = {
  id: string;
  organization_id: string;
  name: string;
  city: string | null;
  status: "active" | "inactive";
};

export type DbOrganization = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
};

export type DbPayrollProfile = {
  id: string;
  employee_id: string;
  organization_id: string;
  branch_id: string;
  monthly_salary: number;
  currency: string;
  bank_name: string | null;
  account_title: string | null;
  account_no: string | null;
  account_type: string | null;
};

export type DbAttendanceLog = {
  id: string;
  employee_id: string;
  organization_id: string;
  branch_id: string;
  attendance_date: string;
  mode: "device" | "remote" | "field";
  source: "biometric_device" | "facial_device" | "mobile_app" | "manual_admin";
  check_in: string | null;
  check_out: string | null;
  total_minutes: number;
  status: "present" | "absent" | "late" | "half_day" | "weekend" | "holiday";
  notes: string | null;
};

export type DbEmployeeRequest = {
  id: string;
  employee_id: string;
  organization_id: string;
  branch_id: string;
  type: "leave" | "loan" | "ticket" | "wfh";
  title: string;
  description: string | null;
  amount: number | null;
  start_date: string | null;
  end_date: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
};

export type DbSalarySlip = {
  id: string;
  employee_id: string;
  organization_id: string;
  branch_id: string;
  salary_month: string;
  calculation_basis: "calendar_days" | "working_days" | "fixed_divisor" | "hourly";
  monthly_salary: number;
  base_pay: number;
  overtime_amount: number;
  allowances: number;
  deductions: number;
  loan_deduction: number;
  gross_pay: number;
  net_pay: number;
  status: "draft" | "approved" | "paid";
};

export type DbCompanyDocument = {
  id: string;
  organization_id: string;
  branch_id: string | null;
  title: string;
  description: string | null;
  document_url: string | null;
  category: string;
  is_active: boolean;
};

export type DbPolicyRecord = {
  policy: Record<string, unknown>;
};

export type EmployeeBundle = {
  employee: DbEmployee;
  organization: DbOrganization;
  branch: DbBranch;
  organizationPolicy: Record<string, unknown>;
  branchPolicy: Record<string, unknown>;
  employeePolicyOverride: Record<string, unknown>;
  payrollProfile: DbPayrollProfile | null;
  attendanceLogs: DbAttendanceLog[];
  requests: DbEmployeeRequest[];
  salarySlip: DbSalarySlip | null;
  documents: DbCompanyDocument[];
};

const unwrapSingle = <T>(data: T | null, error: { message: string } | null) => {
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No data found.");
  }

  return data;
};

export const getEmployeeByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("email", email)
    .single<DbEmployee>();

  return unwrapSingle(data, error);
};

export const getEmployeeBundleByEmail = async (
  email: string
): Promise<EmployeeBundle> => {
  const employee = await getEmployeeByEmail(email);

  const [
    organizationResult,
    branchResult,
    organizationPolicyResult,
    branchPolicyResult,
    employeePolicyOverrideResult,
    payrollProfileResult,
    attendanceLogsResult,
    requestsResult,
    salarySlipResult,
    documentsResult,
  ] = await Promise.all([
    supabase
      .from("organizations")
      .select("*")
      .eq("id", employee.organization_id)
      .single<DbOrganization>(),

    supabase
      .from("branches")
      .select("*")
      .eq("id", employee.branch_id)
      .single<DbBranch>(),

    supabase
      .from("organization_policies")
      .select("policy")
      .eq("organization_id", employee.organization_id)
      .maybeSingle<DbPolicyRecord>(),

    supabase
      .from("branch_policies")
      .select("policy")
      .eq("branch_id", employee.branch_id)
      .maybeSingle<DbPolicyRecord>(),

    supabase
      .from("employee_policy_overrides")
      .select("policy")
      .eq("employee_id", employee.id)
      .maybeSingle<DbPolicyRecord>(),

    supabase
      .from("payroll_profiles")
      .select("*")
      .eq("employee_id", employee.id)
      .maybeSingle<DbPayrollProfile>(),

    supabase
      .from("attendance_logs")
      .select("*")
      .eq("employee_id", employee.id)
      .order("attendance_date", { ascending: false })
      .limit(10)
      .returns<DbAttendanceLog[]>(),

    supabase
      .from("employee_requests")
      .select("*")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<DbEmployeeRequest[]>(),

    supabase
      .from("salary_slips")
      .select("*")
      .eq("employee_id", employee.id)
      .order("salary_month", { ascending: false })
      .limit(1)
      .maybeSingle<DbSalarySlip>(),

    supabase
      .from("company_documents")
      .select("*")
      .eq("organization_id", employee.organization_id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .returns<DbCompanyDocument[]>(),
  ]);

  if (organizationResult.error) throw new Error(organizationResult.error.message);
  if (branchResult.error) throw new Error(branchResult.error.message);
  if (organizationPolicyResult.error) throw new Error(organizationPolicyResult.error.message);
  if (branchPolicyResult.error) throw new Error(branchPolicyResult.error.message);
  if (employeePolicyOverrideResult.error) throw new Error(employeePolicyOverrideResult.error.message);
  if (payrollProfileResult.error) throw new Error(payrollProfileResult.error.message);
  if (attendanceLogsResult.error) throw new Error(attendanceLogsResult.error.message);
  if (requestsResult.error) throw new Error(requestsResult.error.message);
  if (salarySlipResult.error) throw new Error(salarySlipResult.error.message);
  if (documentsResult.error) throw new Error(documentsResult.error.message);

  return {
    employee,
    organization: unwrapSingle(
      organizationResult.data,
      organizationResult.error
    ),
    branch: unwrapSingle(branchResult.data, branchResult.error),
    organizationPolicy: organizationPolicyResult.data?.policy ?? {},
    branchPolicy: branchPolicyResult.data?.policy ?? {},
    employeePolicyOverride: employeePolicyOverrideResult.data?.policy ?? {},
    payrollProfile: payrollProfileResult.data ?? null,
    attendanceLogs: attendanceLogsResult.data ?? [],
    requests: requestsResult.data ?? [],
    salarySlip: salarySlipResult.data ?? null,
    documents: documentsResult.data ?? [],
  };
};

export const testSupabaseConnection = async () => {
  const bundle = await getEmployeeBundleByEmail("ahmed.khan@company.com");

  return {
    employeeName: bundle.employee.full_name,
    organizationName: bundle.organization.name,
    branchName: bundle.branch.name,
    attendanceCount: bundle.attendanceLogs.length,
    requestCount: bundle.requests.length,
    documentCount: bundle.documents.length,
  };
};
