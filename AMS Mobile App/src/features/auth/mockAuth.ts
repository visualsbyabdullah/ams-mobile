export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "employee";
  organizationId: string;
  branchId: string;
};

export type MockEmployeeAccount = {
  email: string;
  password: string;
  user: AuthUser;
};

export const mockEmployeeAccounts: MockEmployeeAccount[] = [
  {
    email: "ahmed.personal@gmail.com",
    password: "123456",
    user: {
      id: "emp_1024",
      name: "Ahmed Khan",
      email: "ahmed.personal@gmail.com",
      role: "employee",
      organizationId: "org_001",
      branchId: "branch_karachi",
    },
  },
  {
    email: "ali.personal@gmail.com",
    password: "123456",
    user: {
      id: "emp_2025",
      name: "Ali Raza",
      email: "ali.personal@gmail.com",
      role: "employee",
      organizationId: "org_001",
      branchId: "branch_karachi",
    },
  },
];

export const mockEmployeeCredentials = {
  email: mockEmployeeAccounts[0].email,
  password: mockEmployeeAccounts[0].password,
};

export const mockAuthUser: AuthUser = mockEmployeeAccounts[0].user;

export const authenticateMockEmployee = (
  email: string,
  password: string
): AuthUser | null => {
  const normalizedEmail = email.trim().toLowerCase();

  const account = mockEmployeeAccounts.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password
  );

  return account?.user ?? null;
};
