import { supabase } from "../../lib/supabase";
import {
  DeepPartial,
  ModuleAssignmentMode,
  ModuleKey,
  ModulePermissionKey,
  ModulePolicy,
  ModuleType,
  ResolvedPolicy,
} from "../policies/types";
import { resolvePolicy } from "../policies/resolvePolicy";

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

export type DbModule = {
  key: string;
  name: string;
  module_type: ModuleType;
  assignment_required: boolean;
  is_platform_enabled: boolean;
};

export type DbOrganizationModule = {
  id: string;
  organization_id: string;
  module_key: string;
  enabled: boolean;
};

export type DbBranchModule = {
  id: string;
  branch_id: string;
  module_key: string;
  enabled: boolean;
  assignment_mode: ModuleAssignmentMode;
};

export type DbRole = {
  id: string;
  organization_id: string;
  name: string;
  key: string;
};

export type DbEmployeeRole = {
  id: string;
  employee_id: string;
  role_id: string;
};

export type DbModuleRoleAssignment = {
  id: string;
  branch_id: string;
  module_key: string;
  role_id: string;
};

export type DbModuleEmployeeAssignment = {
  id: string;
  branch_id: string;
  module_key: string;
  employee_id: string;
  permissions: Partial<Record<ModulePermissionKey, boolean>>;
};

export type AssignedModulePolicyMap = Partial<Record<ModuleKey, ModulePolicy>>;

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

  modules: DbModule[];
  organizationModules: DbOrganizationModule[];
  branchModules: DbBranchModule[];
  employeeRoles: DbEmployeeRole[];
  moduleRoleAssignments: DbModuleRoleAssignment[];
  moduleEmployeeAssignments: DbModuleEmployeeAssignment[];
  assignedModulePolicy: AssignedModulePolicyMap;
  resolvedPolicy: ResolvedPolicy;
};

const knownModuleKeys: ModuleKey[] = [
  "attendance",
  "deviceAttendance",
  "remoteAttendance",
  "fieldAttendance",
  "breakTracking",
  "leaveRequests",
  "wfhRequests",
  "loans",
  "tickets",
  "documents",
  "payroll",
  "salarySlips",
  "notifications",
  "sales",
  "inventory",
  "mediaTasks",
  "delivery",
  "inspection",
  "siteVisits",
];

const isKnownModuleKey = (value: string): value is ModuleKey => {
  return knownModuleKeys.includes(value as ModuleKey);
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

const defaultPermissionsForAssignedModule = (
  moduleKey: ModuleKey,
  assigned: boolean
): Partial<Record<ModulePermissionKey, boolean>> => {
  if (!assigned) {
    return {};
  }

  if (moduleKey === "sales") {
    return {
      createSaleEntry: true,
      viewOwnSales: true,
      viewBranchSales: false,
      captureLocation: true,
      uploadAttachment: true,
    };
  }

  return {
    createEntry: true,
    viewOwnEntries: true,
    viewBranchEntries: false,
    captureLocation: true,
    uploadAttachment: true,
  };
};

export const buildAssignedModulePolicy = ({
  modules,
  organizationModules,
  branchModules,
  employeeRoles,
  moduleRoleAssignments,
  moduleEmployeeAssignments,
}: {
  modules: DbModule[];
  organizationModules: DbOrganizationModule[];
  branchModules: DbBranchModule[];
  employeeRoles: DbEmployeeRole[];
  moduleRoleAssignments: DbModuleRoleAssignment[];
  moduleEmployeeAssignments: DbModuleEmployeeAssignment[];
}): AssignedModulePolicyMap => {
  const moduleDefinitions = new Map(
    modules.map((module) => [module.key, module])
  );

  const organizationModuleMap = new Map(
    organizationModules.map((module) => [module.module_key, module])
  );

  const employeeRoleIds = new Set(employeeRoles.map((role) => role.role_id));

  const policy: AssignedModulePolicyMap = {};

  branchModules.forEach((branchModule) => {
    if (!isKnownModuleKey(branchModule.module_key)) {
      return;
    }

    const moduleKey = branchModule.module_key;
    const moduleDefinition = moduleDefinitions.get(moduleKey);

    if (!moduleDefinition) {
      return;
    }

    const organizationModule = organizationModuleMap.get(moduleKey);

    const platformEnabled = moduleDefinition.is_platform_enabled;
    const organizationEnabled = organizationModule?.enabled === true;
    const branchEnabled = branchModule.enabled === true;

    const enabled = platformEnabled && organizationEnabled && branchEnabled;

    const employeeAssignment = moduleEmployeeAssignments.find(
      (assignment) => assignment.module_key === moduleKey
    );

    const roleAssignmentExists = moduleRoleAssignments.some(
      (assignment) =>
        assignment.module_key === moduleKey &&
        employeeRoleIds.has(assignment.role_id)
    );

    const assignmentRequired = moduleDefinition.assignment_required;

    const assigned =
      !assignmentRequired ||
      branchModule.assignment_mode === "all_branch_employees" ||
      (branchModule.assignment_mode === "selected_employees" &&
        Boolean(employeeAssignment)) ||
      (branchModule.assignment_mode === "selected_roles" &&
        roleAssignmentExists);

    policy[moduleKey] = {
      enabled,
      moduleType: moduleDefinition.module_type,
      assignmentRequired,
      assignmentMode: branchModule.assignment_mode,
      assigned,
      permissions:
        employeeAssignment?.permissions ??
        defaultPermissionsForAssignedModule(moduleKey, assigned),
    };
  });

  return policy;
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
    modulesResult,
    organizationModulesResult,
    branchModulesResult,
    employeeRolesResult,
    moduleRoleAssignmentsResult,
    moduleEmployeeAssignmentsResult,
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

    supabase.from("modules").select("*").returns<DbModule[]>(),

    supabase
      .from("organization_modules")
      .select("*")
      .eq("organization_id", employee.organization_id)
      .returns<DbOrganizationModule[]>(),

    supabase
      .from("branch_modules")
      .select("*")
      .eq("branch_id", employee.branch_id)
      .returns<DbBranchModule[]>(),

    supabase
      .from("employee_roles")
      .select("*")
      .eq("employee_id", employee.id)
      .returns<DbEmployeeRole[]>(),

    supabase
      .from("module_role_assignments")
      .select("*")
      .eq("branch_id", employee.branch_id)
      .returns<DbModuleRoleAssignment[]>(),

    supabase
      .from("module_employee_assignments")
      .select("*")
      .eq("branch_id", employee.branch_id)
      .eq("employee_id", employee.id)
      .returns<DbModuleEmployeeAssignment[]>(),
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
  if (modulesResult.error) throw new Error(modulesResult.error.message);
  if (organizationModulesResult.error) throw new Error(organizationModulesResult.error.message);
  if (branchModulesResult.error) throw new Error(branchModulesResult.error.message);
  if (employeeRolesResult.error) throw new Error(employeeRolesResult.error.message);
  if (moduleRoleAssignmentsResult.error) throw new Error(moduleRoleAssignmentsResult.error.message);
  if (moduleEmployeeAssignmentsResult.error) {
    throw new Error(moduleEmployeeAssignmentsResult.error.message);
  }

  const modules = modulesResult.data ?? [];
  const organizationModules = organizationModulesResult.data ?? [];
  const branchModules = branchModulesResult.data ?? [];
  const employeeRoles = employeeRolesResult.data ?? [];
  const moduleRoleAssignments = moduleRoleAssignmentsResult.data ?? [];
  const moduleEmployeeAssignments = moduleEmployeeAssignmentsResult.data ?? [];

  const assignedModulePolicy = buildAssignedModulePolicy({
    modules,
    organizationModules,
    branchModules,
    employeeRoles,
    moduleRoleAssignments,
    moduleEmployeeAssignments,
  });

  const organizationPolicy = organizationPolicyResult.data?.policy ?? {};
  const branchPolicy = branchPolicyResult.data?.policy ?? {};
  const employeePolicyOverride = employeePolicyOverrideResult.data?.policy ?? {};

  const resolvedPolicy = resolvePolicy([
    organizationPolicy as DeepPartial<ResolvedPolicy>,
    branchPolicy as DeepPartial<ResolvedPolicy>,
    employeePolicyOverride as DeepPartial<ResolvedPolicy>,
    {
      modules: assignedModulePolicy,
    } as DeepPartial<ResolvedPolicy>,
  ]);

  return {
    employee,
    organization: unwrapSingle(
      organizationResult.data,
      organizationResult.error
    ),
    branch: unwrapSingle(branchResult.data, branchResult.error),
    organizationPolicy,
    branchPolicy,
    employeePolicyOverride,
    payrollProfile: payrollProfileResult.data ?? null,
    attendanceLogs: attendanceLogsResult.data ?? [],
    requests: requestsResult.data ?? [],
    salarySlip: salarySlipResult.data ?? null,
    documents: documentsResult.data ?? [],

    modules,
    organizationModules,
    branchModules,
    employeeRoles,
    moduleRoleAssignments,
    moduleEmployeeAssignments,
    assignedModulePolicy,
    resolvedPolicy,
  };
};

export const testSupabaseConnection = async () => {
  const bundle = await getEmployeeBundleByEmail("ahmed.personal@gmail.com");
  const salesPolicy = bundle.resolvedPolicy.modules.sales;

  return {
    employeeName: bundle.employee.full_name,
    organizationName: bundle.organization.name,
    branchName: bundle.branch.name,
    attendanceCount: bundle.attendanceLogs.length,
    requestCount: bundle.requests.length,
    documentCount: bundle.documents.length,
    salesEnabled: salesPolicy?.enabled === true,
    salesAssigned: salesPolicy?.assigned === true,
    canCreateSaleEntry:
      salesPolicy?.permissions?.createSaleEntry === true,
  };
};
