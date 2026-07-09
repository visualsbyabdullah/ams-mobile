export const mockEmployeeCredentials = {
  email: "ahmed.personal@gmail.com",
  password: "123456",
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "employee";
  organizationId: string;
  branchId: string;
};

export const mockAuthUser: AuthUser = {
  id: "emp_1024",
  name: "Ahmed Khan",
  email: "ahmed.personal@gmail.com",
  role: "employee",
  organizationId: "org_001",
  branchId: "branch_karachi",
};
