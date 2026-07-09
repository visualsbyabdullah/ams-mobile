export type AttendanceMode = "onsite" | "remote" | "field";

export const todayAttendance = {
  mode: "onsite" as AttendanceMode,
  shiftStart: "09:00",
  shiftEnd: "17:00",
  expectedHours: "8h",
  checkIn: "09:08 AM",
  checkOut: null,
  lastSync: "09:08 AM",
  totalHours: "5h 49m",
};

export const attendanceHistory = [
  {
    id: "1",
    date: "03 Jul",
    checkIn: "10:16 AM",
    checkOut: "04:05 PM",
    hours: "5.49",
    status: "present",
  },
  {
    id: "2",
    date: "04 Jul",
    checkIn: "-",
    checkOut: "Weekend",
    hours: "-",
    status: "weekend",
  },
  {
    id: "3",
    date: "05 Jul",
    checkIn: "-",
    checkOut: "Weekend",
    hours: "-",
    status: "weekend",
  },
  {
    id: "4",
    date: "06 Jul",
    checkIn: "09:35 AM",
    checkOut: "05:32 PM",
    hours: "7.57",
    status: "present",
  },
  {
    id: "5",
    date: "07 Jul",
    checkIn: "09:27 AM",
    checkOut: "05:57 PM",
    hours: "8.30",
    status: "present",
  },
];

export const monthlyAttendanceSummary = {
  present: "18",
  absent: "01",
  late: "03",
  totalHours: "38h 31m",
};
