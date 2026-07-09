import { isModuleEnabled } from "../features/policies/guards";
import { ResolvedPolicy } from "../features/policies/types";
import { getEnabledRequestTypes } from "../features/requests/requestConfig";
import { IconName } from "../components/ui/AppIcon";
import { AppTab } from "./types";

export type TabItem = {
  key: AppTab;
  label: string;
  icon: IconName;
};

const homeTab: TabItem = {
  key: "home",
  label: "home.bottomHome",
  icon: "home",
};

const requestsTab: TabItem = {
  key: "requests",
  label: "home.bottomRequests",
  icon: "request",
};

const attendanceTab: TabItem = {
  key: "attendance",
  label: "home.bottomAttendance",
  icon: "calendar",
};

const profileTab: TabItem = {
  key: "profile",
  label: "home.bottomProfile",
  icon: "profile",
};

export const getVisibleTabs = (policy: ResolvedPolicy): TabItem[] => {
  const tabs: TabItem[] = [homeTab];

  if (getEnabledRequestTypes(policy).length > 0) {
    tabs.push(requestsTab);
  }

  if (isModuleEnabled(policy, "attendance")) {
    tabs.push(attendanceTab);
  }

  tabs.push(profileTab);

  return tabs;
};
