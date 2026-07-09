import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon, IconName } from "../../components/ui/AppIcon";
import { AppText } from "../../components/ui/AppText";
import { employeeProfile } from "../../features/profile/mockProfile";
import {
  canUseDeviceAttendance,
  canUsePayroll,
  getWorkingDays,
  isModuleEnabled,
} from "../../features/policies/guards";
import { ResolvedPolicy } from "../../features/policies/types";
import { t } from "../../i18n";
import { colors } from "../../theme";

type ProfileScreenProps = {
  policy: ResolvedPolicy;
  onCompanyDocumentsPress?: () => void;
  onEmployeeCardPress?: () => void;
  onWorkSchedulePress?: () => void;
  onSalarySlipPress?: () => void;
  onAboutOrganizationPress?: () => void;
  onLogoutPress?: () => void;
};

type InfoItem = {
  key: string;
  label: string;
  value: string;
  icon: IconName;
  tone?: "accent" | "orange" | "info";
};

type MenuItem = {
  key: string;
  title: string;
  description: string;
  icon: IconName;
  danger?: boolean;
  onPress?: () => void;
};

const toneMap = {
  accent: {
    bg: "accentSoft",
    color: "accent",
  },
  orange: {
    bg: "orangeSoft",
    color: "orange",
  },
  info: {
    bg: "infoSoft",
    color: "info",
  },
} as const;

function InfoRow({ item }: { item: InfoItem }) {
  const tone = toneMap[item.tone ?? "accent"];

  return (
    <View style={styles.infoRow}>
      <View
        style={[
          styles.infoIcon,
          { backgroundColor: colors[tone.bg] },
        ]}
      >
        <AppIcon name={item.icon} size={18} color={tone.color} />
      </View>

      <View style={styles.infoTextWrap}>
        <AppText style={styles.infoLabel}>{item.label}</AppText>
        <AppText style={styles.infoValue}>{item.value}</AppText>
      </View>
    </View>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <Pressable
      onPress={item.onPress}
      style={({ pressed }) => [
        styles.menuRow,
        item.danger && styles.menuRowDanger,
        pressed && styles.pressedCard,
      ]}
    >
      <View style={[styles.menuIcon, item.danger && styles.menuIconDanger]}>
        <AppIcon
          name={item.icon}
          size={18}
          color={item.danger ? "danger" : "accent"}
        />
      </View>

      <View style={styles.menuTextWrap}>
        <AppText style={styles.menuTitle}>{item.title}</AppText>
        <AppText style={styles.menuSubtitle}>{item.description}</AppText>
      </View>

      <AppIcon name="chevronRight" size={18} color="textMuted" />
    </Pressable>
  );
}

export function ProfileScreen({
  policy,
  onCompanyDocumentsPress,
  onEmployeeCardPress,
  onWorkSchedulePress,
  onSalarySlipPress,
  onAboutOrganizationPress,
  onLogoutPress,
}: ProfileScreenProps) {
  const documentsEnabled = isModuleEnabled(policy, "documents");
  const salarySlipsEnabled = isModuleEnabled(policy, "salarySlips");
  const payrollEnabled = canUsePayroll(policy);
  const deviceAttendanceEnabled = canUseDeviceAttendance(policy);

  const workingDays = getWorkingDays(policy)
    .map((day) => t(`days.${day}`))
    .join(", ");

  const contactInfo: InfoItem[] = [
    {
      key: "email",
      label: t("profile.email"),
      value: employeeProfile.email,
      icon: "mail",
    },
    {
      key: "phone",
      label: t("profile.phone"),
      value: employeeProfile.phone,
      icon: "phone",
      tone: "orange",
    },
  ];

  const workInfo: InfoItem[] = [
    {
      key: "employeeId",
      label: t("profile.employeeId"),
      value: employeeProfile.employeeId,
      icon: "card",
    },
    {
      key: "department",
      label: t("profile.department"),
      value: employeeProfile.department,
      icon: "work",
      tone: "info",
    },
    {
      key: "branch",
      label: t("profile.branch"),
      value: employeeProfile.branch,
      icon: "building",
    },
    {
      key: "workingDays",
      label: t("profile.workingDays"),
      value: workingDays,
      icon: "calendar",
      tone: "orange",
    },
    {
      key: "shift",
      label: t("profile.shiftTime"),
      value: `${policy.schedule.defaultShift.start} - ${policy.schedule.defaultShift.end}`,
      icon: "clock",
      tone: "info",
    },
    {
      key: "attendanceSource",
      label: t("profile.attendanceSource"),
      value: deviceAttendanceEnabled ? t("profile.officeDevice") : t("common.enabled"),
      icon: "shield",
    },
  ];

  const personalInfo: InfoItem[] = [
    {
      key: "dob",
      label: t("profile.dateOfBirth"),
      value: employeeProfile.dateOfBirth,
      icon: "calendar",
    },
    {
      key: "cnic",
      label: t("profile.cnic"),
      value: employeeProfile.cnic,
      icon: "badge",
      tone: "orange",
    },
    {
      key: "address",
      label: t("profile.address"),
      value: employeeProfile.address,
      icon: "location",
      tone: "info",
    },
    {
      key: "city",
      label: t("profile.city"),
      value: employeeProfile.city,
      icon: "building",
    },
  ];

  const payrollInfo: InfoItem[] = [
    {
      key: "bankName",
      label: t("profile.bankName"),
      value: employeeProfile.bankName,
      icon: "bank",
    },
    {
      key: "accountTitle",
      label: t("profile.accountTitle"),
      value: employeeProfile.accountTitle,
      icon: "user",
      tone: "info",
    },
    {
      key: "accountNo",
      label: t("profile.accountNo"),
      value: employeeProfile.accountNo,
      icon: "card",
      tone: "orange",
    },
    {
      key: "accountType",
      label: t("profile.accountType"),
      value: employeeProfile.accountType,
      icon: "bank",
    },
  ];

  const menuItems: MenuItem[] = [
    {
      key: "workSchedule",
      title: t("profile.workSchedule"),
      description: t("profile.workScheduleDesc"),
      icon: "calendar",
      onPress: onWorkSchedulePress,
    },

    ...(documentsEnabled
      ? [
          {
            key: "documents",
            title: t("profile.companyDocuments"),
            description: t("profile.companyDocumentsDesc"),
            icon: "file" as IconName,
            onPress: onCompanyDocumentsPress,
          },
        ]
      : []),

    {
      key: "employeeCard",
      title: t("profile.employeeCard"),
      description: t("profile.employeeCardDesc"),
      icon: "badge",
      onPress: onEmployeeCardPress,
    },

    ...(salarySlipsEnabled
      ? [
          {
            key: "salarySlip",
            title: t("profile.salarySlip"),
            description: t("profile.salarySlipDesc"),
            icon: "salary" as IconName,
            onPress: onSalarySlipPress,
          },
        ]
      : []),

    {
      key: "about",
      title: t("profile.aboutOrganization"),
      description: t("profile.aboutOrganizationDesc"),
      icon: "building",
      onPress: onAboutOrganizationPress,
    },

    {
      key: "logout",
      title: t("profile.logout"),
      description: t("profile.logoutDesc"),
      icon: "logout",
      danger: true,
      onPress: onLogoutPress,
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <AppIcon name="user" size={34} color="inverseText" />
        </View>

        <View style={styles.headerTextWrap}>
          <AppText style={styles.employeeName}>{employeeProfile.name}</AppText>
          <AppText style={styles.employeeEmail}>{employeeProfile.email}</AppText>

          <View style={styles.rolePill}>
            <AppIcon name="shield" size={14} color="accent" />
            <AppText style={styles.roleText}>{employeeProfile.designation}</AppText>
          </View>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryLabel}>{t("profile.employeeId")}</AppText>
          <AppText style={styles.summaryValue}>{employeeProfile.employeeId}</AppText>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <AppText style={styles.summaryLabel}>{t("profile.branch")}</AppText>
          <AppText style={styles.summaryValue}>{employeeProfile.branch}</AppText>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{t("profile.contactInfo")}</AppText>
      </View>

      <View style={styles.listCard}>
        {contactInfo.map((item) => (
          <InfoRow key={item.key} item={item} />
        ))}
      </View>

      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{t("profile.workInfo")}</AppText>
      </View>

      <View style={styles.listCard}>
        {workInfo.map((item) => (
          <InfoRow key={item.key} item={item} />
        ))}
      </View>

      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{t("profile.personalInfo")}</AppText>
      </View>

      <View style={styles.listCard}>
        {personalInfo.map((item) => (
          <InfoRow key={item.key} item={item} />
        ))}
      </View>

      {payrollEnabled && (
        <>
          <View style={styles.sectionHead}>
            <AppText style={styles.sectionTitle}>{t("profile.payrollInfo")}</AppText>
          </View>

          <View style={styles.listCard}>
            {payrollInfo.map((item) => (
              <InfoRow key={item.key} item={item} />
            ))}
          </View>
        </>
      )}

      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{t("profile.settings")}</AppText>
      </View>

      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <MenuRow key={item.key} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 140,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
  },
  headerCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 28,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  headerTextWrap: {
    flex: 1,
  },
  employeeName: {
    color: colors.inverseText,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  employeeEmail: {
    color: colors.homeStatusMutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  rolePill: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roleText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "800",
  },
  sectionHead: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "800",
  },
  menuList: {
    gap: 12,
  },
  menuRow: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  menuRowDanger: {
    backgroundColor: colors.dangerSoft,
  },
  pressedCard: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuIconDanger: {
    backgroundColor: colors.surface,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
