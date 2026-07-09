import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { companyDocuments } from "../../features/documents/mockDocuments";
import { t } from "../../i18n";
import { colors } from "../../theme";

type CompanyDocumentsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function CompanyDocumentsSheet({
  visible,
  onClose,
}: CompanyDocumentsSheetProps) {
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
                  <AppIcon name="file" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("documents.title")}</AppText>
                  <AppText style={styles.subtitle}>{t("documents.subtitle")}</AppText>
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
              <View style={styles.statusCard}>
                <View style={styles.statusIcon}>
                  <AppIcon name="shield" size={18} color="inverseText" />
                </View>

                <View style={styles.statusText}>
                  <AppText style={styles.statusTitle}>
                    {t("documents.sharedByCompany")}
                  </AppText>
                  <AppText style={styles.statusSubtitle}>
                    {t("documents.sharedByCompanyDesc")}
                  </AppText>
                </View>
              </View>

              <View style={styles.list}>
                {companyDocuments.map((item) => (
                  <Pressable key={item.id} style={styles.documentCard}>
                    <View style={styles.documentIcon}>
                      <AppIcon name={item.icon} size={18} color="accent" />
                    </View>

                    <View style={styles.documentText}>
                      <AppText style={styles.documentTitle}>
                        {t(item.titleKey)}
                      </AppText>
                      <AppText style={styles.documentSubtitle}>
                        {t(item.descriptionKey)}
                      </AppText>
                      <AppText style={styles.documentDate}>
                        {item.updatedAt}
                      </AppText>
                    </View>

                    <AppIcon name="chevronRight" size={18} color="textMuted" />
                  </Pressable>
                ))}
              </View>

              <View style={styles.noteCard}>
                <AppIcon name="shield" size={17} color="accent" />
                <AppText style={styles.noteText}>
                  {t("documents.note")}
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
  statusCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.inverseText,
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.homeStatusMutedText,
  },
  list: {
    marginTop: 18,
    gap: 12,
  },
  documentCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  documentIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  documentText: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 2,
  },
  documentSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  documentDate: {
    marginTop: 5,
    fontSize: 12,
    color: colors.textSoft,
    fontWeight: "700",
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
