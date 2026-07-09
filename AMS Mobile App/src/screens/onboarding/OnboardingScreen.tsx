import { StyleSheet, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppIcon } from "../../components/ui/AppIcon";
import { AppScreen } from "../../components/ui/AppScreen";
import { AppText } from "../../components/ui/AppText";
import { t } from "../../i18n";
import { colors, radius, spacing } from "../../theme";

export function OnboardingScreen() {
  return (
    <AppScreen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <AppIcon name="clock" size={30} color="inverseText" />
        </View>

        <AppText variant="label" color="textMuted" style={styles.eyebrow}>
          {t("onboarding.eyebrow")}
        </AppText>

        <AppText variant="title" style={styles.title}>
          {t("onboarding.title")}
        </AppText>

        <AppText color="textMuted" style={styles.description}>
          {t("onboarding.description")}
        </AppText>
      </View>

      <AppCard style={styles.previewCard}>
        <View style={styles.row}>
          <View style={styles.iconBubble}>
            <AppIcon name="calendar" color="accent" />
          </View>

          <View style={styles.rowContent}>
            <View style={styles.lineLarge} />
            <View style={styles.lineSmall} />
          </View>

          <AppIcon name="chevronRight" color="textSoft" />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.iconBubbleDark}>
            <AppIcon name="file" color="inverseText" />
          </View>

          <View style={styles.rowContent}>
            <View style={styles.lineLarge} />
            <View style={styles.lineSmall} />
          </View>

          <AppIcon name="chevronRight" color="textSoft" />
        </View>
      </AppCard>

      <AppButton title={t("onboarding.primaryAction")} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    paddingTop: spacing["4xl"],
    paddingBottom: spacing["2xl"],
  },
  hero: {
    alignItems: "center",
    paddingTop: spacing["4xl"],
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing["2xl"],
  },
  eyebrow: {
    marginBottom: spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  description: {
    textAlign: "center",
    maxWidth: 330,
  },
  previewCard: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubbleDark: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: {
    flex: 1,
    gap: spacing.sm,
  },
  lineLarge: {
    width: "80%",
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
  lineSmall: {
    width: "52%",
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
  },
});