import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ResolvedPolicy } from "../../features/policies/types";
import { RequestType } from "../../features/requests/types";
import { getEnabledRequestTypes } from "../../features/requests/requestConfig";
import { t } from "../../i18n";
import { colors } from "../../theme";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";

type QuickActionSheetProps = {
  visible: boolean;
  policy: ResolvedPolicy;
  onClose: () => void;
  onActionPress: (type: RequestType) => void;
};

export function QuickActionSheet({
  visible,
  policy,
  onClose,
  onActionPress,
}: QuickActionSheetProps) {
  const actions = getEnabledRequestTypes(policy);

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
                  <AppIcon name="plus" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("quickSheet.title")}</AppText>
                  <AppText style={styles.subtitle}>{t("quickSheet.description")}</AppText>
                </View>
              </View>

              <Pressable onPress={onClose} style={styles.closeButton}>
                <AppIcon name="x" size={20} color="textMuted" />
              </Pressable>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                <AppIcon name="shield" size={17} color="inverseText" />
              </View>

              <View style={styles.statusTextWrap}>
                <AppText style={styles.statusTitle}>{t("quickSheet.title")}</AppText>
                <AppText style={styles.statusSubtitle}>
                  {actions.length > 0
                    ? t("requests.subtitle")
                    : t("requests.noRequestModules")}
                </AppText>
              </View>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.list}>
                {actions.map((item) => (
                  <Pressable
                    key={item.type}
                    onPress={() => onActionPress(item.type)}
                    style={({ pressed }) => [
                      styles.actionCard,
                      pressed && styles.pressedCard,
                    ]}
                  >
                    <View
                      style={[
                        styles.actionIcon,
                        { backgroundColor: colors[item.softColor] },
                      ]}
                    >
                      <AppIcon name={item.icon} size={19} color={item.color} />
                    </View>

                    <View style={styles.actionText}>
                      <AppText style={styles.actionTitle}>{t(item.titleKey)}</AppText>
                      <AppText style={styles.actionSubtitle}>
                        {t(item.descriptionKey)}
                      </AppText>
                    </View>

                    <AppIcon name="chevronRight" size={18} color="textMuted" />
                  </Pressable>
                ))}
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
    height: "72%",
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
  statusCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  list: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  pressedCard: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
