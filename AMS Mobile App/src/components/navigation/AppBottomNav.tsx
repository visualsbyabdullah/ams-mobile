import { Pressable, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { t } from "../../i18n";
import { colors } from "../../theme";
import { AppTab } from "../../navigation/types";
import { TabItem } from "../../navigation/tabConfig";

type AppBottomNavProps = {
  activeTab: AppTab;
  tabs: TabItem[];
  showCreateButton: boolean;
  onTabPress: (tab: AppTab) => void;
  onCreatePress: () => void;
};

export function AppBottomNav({
  activeTab,
  tabs,
  showCreateButton,
  onTabPress,
  onCreatePress,
}: AppBottomNavProps) {
  const middleIndex = Math.ceil(tabs.length / 2);
  const leftTabs = showCreateButton ? tabs.slice(0, middleIndex) : tabs;
  const rightTabs = showCreateButton ? tabs.slice(middleIndex) : [];

  const renderTab = (tab: TabItem) => {
    const active = activeTab === tab.key;

    return (
      <Pressable
        key={tab.key}
        onPress={() => onTabPress(tab.key)}
        style={styles.navItem}
      >
        <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
          <AppIcon
            name={tab.icon}
            size={20}
            color={active ? "accent" : "textMuted"}
          />
        </View>

        <AppText
          style={[
            styles.navLabel,
            active && styles.navLabelActive,
          ]}
        >
          {t(tab.label)}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View pointerEvents="box-none" style={styles.navLayer}>
      <View style={styles.bottomNav}>
        {leftTabs.map(renderTab)}

        {showCreateButton && (
          <Pressable onPress={onCreatePress} style={styles.addButton}>
            <AppIcon name="plus" size={28} color="inverseText" />
          </Pressable>
        )}

        {rightTabs.map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 22,
    alignItems: "center",
  },
  bottomNav: {
    width: "90%",
    maxWidth: 390,
    minHeight: 74,
    borderRadius: 28,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  navItem: {
    width: 66,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconWrap: {
    width: 34,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.accentSoft,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
  },
  navLabelActive: {
    color: colors.accent,
    fontWeight: "900",
  },
  addButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -38,
    borderWidth: 4,
    borderColor: colors.background,
  },
});
