import { canRequestWfh, isModuleEnabled } from "../policies/guards";
import { ResolvedPolicy } from "../policies/types";
import { RequestType } from "./types";
import { IconName } from "../../components/ui/AppIcon";
import { colors } from "../../theme";

type ThemeColor = keyof typeof colors;

export type RequestConfigItem = {
  type: RequestType;
  titleKey: string;
  descriptionKey: string;
  icon: IconName;
  color: ThemeColor;
  softColor: ThemeColor;
};

export const requestConfig: RequestConfigItem[] = [
  {
    type: "leave",
    titleKey: "requests.createLeave",
    descriptionKey: "requests.createLeaveDesc",
    icon: "calendar",
    color: "accent",
    softColor: "accentSoft",
  },
  {
    type: "loan",
    titleKey: "requests.createLoan",
    descriptionKey: "requests.createLoanDesc",
    icon: "loan",
    color: "orange",
    softColor: "orangeSoft",
  },
  {
    type: "ticket",
    titleKey: "requests.createTicket",
    descriptionKey: "requests.createTicketDesc",
    icon: "ticket",
    color: "info",
    softColor: "infoSoft",
  },
  {
    type: "wfh",
    titleKey: "requests.createWfh",
    descriptionKey: "requests.createWfhDesc",
    icon: "laptop",
    color: "success",
    softColor: "successSoft",
  },
];

export const isRequestTypeEnabled = (
  policy: ResolvedPolicy,
  type: RequestType
) => {
  if (type === "leave") return isModuleEnabled(policy, "leaveRequests");
  if (type === "loan") return isModuleEnabled(policy, "loans");
  if (type === "ticket") return isModuleEnabled(policy, "tickets");
  if (type === "wfh") return canRequestWfh(policy);

  return false;
};

export const getEnabledRequestTypes = (policy: ResolvedPolicy) => {
  return requestConfig.filter((item) => isRequestTypeEnabled(policy, item.type));
};
