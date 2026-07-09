import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  PolicyScenarioKey,
  policyScenarioList,
} from "../../features/policies/policyScenarios";
import { t } from "../../i18n";
import { colors } from "../../theme";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";

type PolicyDebugSheetProps = {
  visible: boolean;
  activeScenario: PolicyScenarioKey;
  onSelectScenario: (scenario: PolicyScenarioKey) => void;
  onClose: () => void;
};

export function PolicyDebugSheet({
  visible,
  activeScenario,
  onSelectScenario,
  onClose,
}: PolicyDebugSheetProps) {
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
                  <AppIcon name="shield" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("policyDebug.title")}</AppText>
                  <AppText style={styles.subtitle}>{t("policyDebug.subtitle")}</AppText>
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
                  <AppIcon name="shield" size={17} color="inverseText" />
                </View>

                <View style={styles.statusTextWrap}>
                  <AppText style={styles.statusTitle}>{t("policyDebug.title")}</AppText>
                  <AppText style={styles.statusSubtitle}>{t("policyDebug.subtitle")}</AppText>
                </View>
              </View>

              <View style={styles.list}>
                {policyScenarioList.map((scenario) => {
                  const active = scenario.key === activeScenario;

                  return (
                    <Pressable
                      key={scenario.key}
                      onPress={() => {
                        onSelectScenario(scenario.key);
                        onClose();
                      }}
                      style={[styles.itemCard, active && styles.itemCardActive]}
                    >
                      <View style={[styles.itemIcon, active && styles.itemIconActive]}>
                        <AppIcon
                          name={active ? "check" : "shield"}
                          size={18}
                          color={active ? "inverseText" : "accent"}
                        />
                      </View>

                      <View style={styles.itemText}>
                        <AppText style={styles.itemTitle}>{t(scenario.titleKey)}</AppText>
                        <AppText style={styles.itemDesc}>{t(scenario.descriptionKey)}</AppText>
                      </View>

                      {active && (
                        <View style={styles.activeBadge}>
                          <AppText style={styles.activeText}>{t("policyDebug.active")}</AppText>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
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
    height: "78%",
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
    marginBottom: 14,
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
    paddingBottom: 20,
  },
  statusCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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
  statusTextWrap: {
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
    gap: 12,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  itemCardActive: {
    backgroundColor: colors.accentSoft,
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  itemIconActive: {
    backgroundColor: colors.accent,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  activeBadge: {
    marginLeft: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  activeText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.accent,
  },
});
