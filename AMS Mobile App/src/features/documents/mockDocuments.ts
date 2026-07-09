import { IconName } from "../../components/ui/AppIcon";

export type CompanyDocument = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  updatedAt: string;
  icon: IconName;
};

export const companyDocuments: CompanyDocument[] = [
  {
    id: "policy",
    titleKey: "documents.companyPolicy",
    descriptionKey: "documents.companyPolicyDesc",
    updatedAt: "Updated 12 Jul",
    icon: "file",
  },
  {
    id: "handbook",
    titleKey: "documents.employeeHandbook",
    descriptionKey: "documents.employeeHandbookDesc",
    updatedAt: "Updated 01 Jul",
    icon: "file",
  },
  {
    id: "leave",
    titleKey: "documents.leavePolicy",
    descriptionKey: "documents.leavePolicyDesc",
    updatedAt: "Updated 25 Jun",
    icon: "calendar",
  },
  {
    id: "payroll",
    titleKey: "documents.payrollPolicy",
    descriptionKey: "documents.payrollPolicyDesc",
    updatedAt: "Updated 18 Jun",
    icon: "salary",
  },
];
