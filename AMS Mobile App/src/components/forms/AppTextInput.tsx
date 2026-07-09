import { TextInput, StyleSheet, View } from "react-native";
import { AppText } from "../ui/AppText";
import { colors, fontFamily } from "../../theme";

type AppTextInputProps = {
  label: string;
  placeholder: string;
  value: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
  onChangeText: (value: string) => void;
};

export function AppTextInput({
  label,
  placeholder,
  value,
  multiline,
  keyboardType = "default",
  onChangeText,
}: AppTextInputProps) {
  return (
    <View style={styles.root}>
      <AppText style={styles.label}>{label}</AppText>

      <TextInput
        value={value}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textSoft}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  input: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  multiline: {
    minHeight: 104,
    paddingTop: 14,
    textAlignVertical: "top",
  },
});
