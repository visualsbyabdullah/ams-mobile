import { ReactNode } from "react";
import { SafeAreaView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacing } from "../../theme";

type AppScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppScreen({ children, style }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
  },
});