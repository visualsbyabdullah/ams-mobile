import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { organizationProfile } from "../../features/organization/mockOrganization";
import { t } from "../../i18n";
import { colors } from "../../theme";

type AboutOrganizationSheetProps = {
  visible: boolean;
  onClose: () => void;
};

type ContactRowProps = {
  icon: "phone" | "mail" | "building" | "clock" | "shield";
  label: string;
  value: string;
};

function ContactRow({ icon, label, value }: ContactRowProps) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>
        <AppIcon name={icon} size={18} color="accent" />
      </View>

      <View style={styles.contactText}>
        <AppText style={styles.contactLabel}>{label}</AppText>
        <AppText style={styles.contactValue}>{value}</AppText>
      </View>
    </View>
  );
}

export function AboutOrganizationSheet({
  visible,
  onClose,
}: AboutOrganizationSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <AppIcon name="building" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("organization.title")}</AppText>
                  <AppText style={styles.subtitle}>
                    {t("organization.subtitle")}
                  </AppText>
                </View>
              </View>

              <Pressable onPress={onClose} style={styles.closeButton}>
                <AppIcon name="x" size={20} color="textMuted" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.heroCard}>
                <View style={styles.logoMark}>
                  <AppIcon name="building" size={34} color="inverseText" />
                </View>

                <AppText style={styles.organizationName}>
                  {organizationProfile.name}
                </AppText>

                <View style={styles.productPill}>
                  <AppIcon name="shield" size={15} color="accent" />
                  <AppText style={styles.productText}>
                    {organizationProfile.productName}
                  </AppText>
                </View>

                <AppText style={styles.description}>
                  {organizationProfile.description}
                </AppText>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("organization.contactInfo")}
                </AppText>

                <View style={styles.card}>
                  <ContactRow
                    icon="phone"
                    label={t("organization.phone")}
                    value={organizationProfile.phone}
                  />

                  <ContactRow
                    icon="mail"
                    label={t("organization.email")}
                    value={organizationProfile.email}
                  />

                  <ContactRow
                    icon="building"
                    label={t("organization.website")}
                    value={organizationProfile.website}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("organization.workplaceInfo")}
                </AppText>

                <View style={styles.card}>
                  <ContactRow
                    icon="building"
                    label={t("organization.branch")}
                    value={organizationProfile.branch}
                  />

                  <ContactRow
                    icon="clock"
                    label={t("organization.supportHours")}
                    value={organizationProfile.supportHours}
                  />

                  <ContactRow
                    icon="shield"
                    label={t("organization.access")}
                    value={t("organization.adminManaged")}
                  />
                </View>
              </View>

              <View style={styles.noteCard}>
                <AppIcon name="shield" size={17} color="accent" />
                <AppText style={styles.noteText}>
                  {t("organization.note")}
                </AppText>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
  },
  sheetWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 34,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    height: "82%",
    backgroundColor: colors.background,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
    overflow: "hidden",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 28,
    padding: 20,
    alignItems: "center",
  },
  logoMark: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  organizationName: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.inverseText,
    textAlign: "center",
  },
  productPill: {
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  productText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.accent,
  },
  description: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 20,
    color: colors.homeStatusMutedText,
    textAlign: "center",
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    gap: 12,
  },
  contactRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 3,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  noteCard: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
