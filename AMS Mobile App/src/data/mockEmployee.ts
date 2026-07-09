export const employee = {
  name: "Ahmed Khan",
  role: "Branch Manager",
  branch: "Karachi Branch",
  employeeId: "AMS-1024",
  department: "Operations",
  joiningDate: "12 Jan 2024",
};

export const requestStats = {
  active: "03",
  approved: "01",
};

export const requests = [
  {
    key: "leave",
    titleKey: "requests.annualLeave",
    subtitle: "12 Jul - 14 Jul",
    icon: "calendar",
    statusKey: "requests.pending",
  },
  {
    key: "loan",
    titleKey: "requests.loanRequest",
    subtitle: "PKR 25,000",
    icon: "loan",
    statusKey: "requests.approved",
  },
  {
    key: "ticket",
    titleKey: "requests.laptopIssue",
    subtitleKey: "requests.itSupportTicket",
    icon: "ticket",
    statusKey: "requests.open",
  },
] as const;

export const attendanceDays = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

export const activeAttendanceDays = ["02", "05", "06", "08", "11", "14"];
export const lateAttendanceDays = ["10"];

export const profileItems = [
  {
    key: "documents",
    labelKey: "profile.myDocuments",
    icon: "file",
  },
  {
    key: "salary",
    labelKey: "profile.salarySlips",
    icon: "salary",
  },
  {
    key: "requests",
    labelKey: "profile.myRequests",
    icon: "request",
  },
  {
    key: "work",
    labelKey: "profile.workProfile",
    icon: "work",
  },
] as const;
