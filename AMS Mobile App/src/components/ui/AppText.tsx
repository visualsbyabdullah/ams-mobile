import { Text, TextProps, TextStyle } from "react-native";
import { colors, fontFamily, fontSize } from "../../theme";

type Variant = "title" | "subtitle" | "body" | "caption" | "label";

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: keyof typeof colors;
  weight?: keyof typeof fontFamily;
};

const variants: Record<Variant, TextStyle> = {
  title: {
    fontSize: fontSize["3xl"],
    lineHeight: 42,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: fontSize.xl,
    lineHeight: 30,
    fontFamily: fontFamily.semiBold,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: fontSize.md,
    lineHeight: 23,
    fontFamily: fontFamily.regular,
  },
  caption: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.medium,
  },
  label: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    fontFamily: fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
};

export function AppText({
  variant = "body",
  color = "text",
  weight,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        variants[variant],
        { color: colors[color] },
        weight && { fontFamily: fontFamily[weight] },
        style,
      ]}
    />
  );
}