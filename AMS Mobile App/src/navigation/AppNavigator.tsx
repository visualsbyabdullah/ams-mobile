import { useState } from "react";
import { QuickActionSheet } from "../components/actions/QuickActionSheet";
import { CompanyDocumentsSheet } from "../components/documents/CompanyDocumentsSheet";
import { EmployeeCardSheet } from "../components/employee/EmployeeCardSheet";
import { RequestFormSheet } from "../components/forms/RequestFormSheet";
import { AppBottomNav } from "../components/navigation/AppBottomNav";
import { NotificationsSheet } from "../components/notifications/NotificationsSheet";
import { AboutOrganizationSheet } from "../components/organization/AboutOrganizationSheet";
import { SalarySlipSheet } from "../components/payroll/SalarySlipSheet";
import { PolicyDebugSheet } from "../components/policies/PolicyDebugSheet";
import { WorkScheduleSheet } from "../components/schedule/WorkScheduleSheet";
import { LogoutConfirmationSheet } from "../components/session/LogoutConfirmationSheet";
import {
  PolicyScenarioKey,
  policyScenarios,
} from "../features/policies/policyScenarios";
import { getEnabledRequestTypes } from "../features/requests/requestConfig";
import { RequestType } from "../features/requests/types";
import { AttendanceScreen } from "../screens/attendance/AttendanceScreen";
import { EmployeeHomeScreen } from "../screens/home/EmployeeHomeScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { RequestsScreen } from "../screens/requests/RequestsScreen";
import { getVisibleTabs } from "./tabConfig";
import { AppTab } from "./types";

type AppNavigatorProps = {
  onLogout?: () => void;
  resolvedPolicy?: ResolvedPolicy;
};

export function AppNavigator({ onLogout }: AppNavigatorProps) {
  const [policyScenario, setPolicyScenario] =
    useState<PolicyScenarioKey>("onsiteBranch");

  const policy = policyScenarios[policyScenario].policy;
  const visibleTabs = getVisibleTabs(policy);
  const canCreateRequest = getEnabledRequestTypes(policy).length > 0;

  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [quickSheetVisible, setQuickSheetVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [policyDebugVisible, setPolicyDebugVisible] = useState(false);
  const [salarySlipVisible, setSalarySlipVisible] = useState(false);
  const [workScheduleVisible, setWorkScheduleVisible] = useState(false);
  const [companyDocumentsVisible, setCompanyDocumentsVisible] = useState(false);
  const [employeeCardVisible, setEmployeeCardVisible] = useState(false);
  const [aboutOrganizationVisible, setAboutOrganizationVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [requestType, setRequestType] = useState<RequestType | null>(null);

  const currentTab = visibleTabs.some((tab) => tab.key === activeTab)
    ? activeTab
    : "home";

  const openRequestForm = (type: RequestType) => {
    setQuickSheetVisible(false);
    setRequestType(type);
  };

  const renderScreen = () => {
    if (currentTab === "requests") {
      return (
        <RequestsScreen
          policy={policy}
          onCreateRequest={openRequestForm}
        />
      );
    }

    if (currentTab === "attendance") {
      return <AttendanceScreen policy={policy} />;
    }

    if (currentTab === "profile") {
      return (
        <ProfileScreen
          policy={policy}
          onCompanyDocumentsPress={() => setCompanyDocumentsVisible(true)}
          onEmployeeCardPress={() => setEmployeeCardVisible(true)}
          onWorkSchedulePress={() => setWorkScheduleVisible(true)}
          onSalarySlipPress={() => setSalarySlipVisible(true)}
          onAboutOrganizationPress={() => setAboutOrganizationVisible(true)}
          onLogoutPress={() => setLogoutVisible(true)}
        />
      );
    }

    return (
      <EmployeeHomeScreen
        policy={policy}
        onMenuPress={() => setPolicyDebugVisible(true)}
        onNotificationPress={() => setNotificationsVisible(true)}
      />
    );
  };

  return (
    <>
      {renderScreen()}

      <AppBottomNav
        activeTab={currentTab}
        tabs={visibleTabs}
        showCreateButton={canCreateRequest}
        onTabPress={setActiveTab}
        onCreatePress={() => setQuickSheetVisible(true)}
      />

      <QuickActionSheet
        visible={quickSheetVisible}
        policy={policy}
        onClose={() => setQuickSheetVisible(false)}
        onActionPress={openRequestForm}
      />

      <RequestFormSheet
        type={requestType}
        visible={!!requestType}
        onClose={() => setRequestType(null)}
      />

      <NotificationsSheet
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      <PolicyDebugSheet
        visible={policyDebugVisible}
        activeScenario={policyScenario}
        onSelectScenario={setPolicyScenario}
        onClose={() => setPolicyDebugVisible(false)}
      />

      <CompanyDocumentsSheet
        visible={companyDocumentsVisible}
        onClose={() => setCompanyDocumentsVisible(false)}
      />

      <EmployeeCardSheet
        visible={employeeCardVisible}
        onClose={() => setEmployeeCardVisible(false)}
      />

      <AboutOrganizationSheet
        visible={aboutOrganizationVisible}
        onClose={() => setAboutOrganizationVisible(false)}
      />

      <WorkScheduleSheet
        visible={workScheduleVisible}
        policy={policy}
        onClose={() => setWorkScheduleVisible(false)}
      />

      <SalarySlipSheet
        visible={salarySlipVisible}
        policy={policy}
        onClose={() => setSalarySlipVisible(false)}
      />

      <LogoutConfirmationSheet
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          onLogout?.();
        }}
      />
    </>
  );
}
