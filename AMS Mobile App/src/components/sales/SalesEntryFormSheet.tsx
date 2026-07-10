import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { useEmployeeSession } from "../../features/session";
import { createSalesEntry } from "../../features/sales";
import { t } from "../../i18n";
import { colors } from "../../theme";

type SalesEntryFormSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export const SalesEntryFormSheet = ({
  visible,
  onClose,
  onSaved,
}: SalesEntryFormSheetProps) => {
  const { employeeBundle } = useEmployeeSession();

  const [salesCount, setSalesCount] = useState("1");
  const [amount, setAmount] = useState("");
  const [productOrService, setProductOrService] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setSalesCount("1");
    setAmount("");
    setProductOrService("");
    setCustomerName("");
    setNotes("");
    setMessage(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (!employeeBundle) {
        throw new Error("EMPLOYEE_PROFILE_NOT_LOADED");
      }

      const parsedSalesCount = Number(salesCount);
      const parsedAmount = amount.trim() ? Number(amount) : undefined;

      if (!Number.isFinite(parsedSalesCount) || parsedSalesCount <= 0) {
        throw new Error("SALES_COUNT_REQUIRED");
      }

      if (amount.trim() && (!Number.isFinite(parsedAmount) || parsedAmount < 0)) {
        throw new Error("INVALID_SALE_AMOUNT");
      }

      await createSalesEntry(employeeBundle, {
        salesCount: parsedSalesCount,
        amount: parsedAmount,
        productOrService: productOrService.trim() || undefined,
        customerName: customerName.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setMessage(t("sales.entrySaved"));
      resetForm();
      onSaved?.();
    } catch (submitError) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : t("sales.entrySaveFailed");

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={handleClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <AppText style={styles.title}>{t("sales.formTitle")}</AppText>
              <AppText style={styles.subtitle}>{t("sales.formSubtitle")}</AppText>
            </View>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <AppIcon name="x" size={18} color="textMuted" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.fieldGroup}>
              <AppText style={styles.label}>{t("sales.salesCount")}</AppText>
              <TextInput
                value={salesCount}
                onChangeText={setSalesCount}
                keyboardType="numeric"
                style={styles.input}
                placeholder={t("sales.salesCountPlaceholder")}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <AppText style={styles.label}>{t("sales.amountOptional")}</AppText>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
                placeholder={t("sales.amountPlaceholder")}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <AppText style={styles.label}>{t("sales.productOrService")}</AppText>
              <TextInput
                value={productOrService}
                onChangeText={setProductOrService}
                style={styles.input}
                placeholder={t("sales.productPlaceholder")}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <AppText style={styles.label}>{t("sales.customerOptional")}</AppText>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                style={styles.input}
                placeholder={t("sales.customerPlaceholder")}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <AppText style={styles.label}>{t("sales.notesOptional")}</AppText>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.notesInput]}
                placeholder={t("sales.notesPlaceholder")}
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            {error && <AppText style={styles.errorText}>{error}</AppText>}
            {message && <AppText style={styles.successText}>{message}</AppText>}

            <Pressable
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <AppText style={styles.saveButtonText}>
                {saving ? t("sales.saving") : t("sales.saveEntry")}
              </AppText>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: "flex-end",
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    maxHeight: "92%",
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 7,
  },
  input: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
    outlineStyle: "none",
  },
  notesInput: {
    minHeight: 88,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.orange,
    textAlign: "center",
    marginTop: 10,
  },
  successText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.accent,
    textAlign: "center",
    marginTop: 10,
  },
  saveButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: colors.inverseText,
  },
});
