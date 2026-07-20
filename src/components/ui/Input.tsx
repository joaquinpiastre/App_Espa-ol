import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";

import { theme } from "../../theme/theme";

export type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "off" | "username" | "password" | "email" | "name" | "tel" | "street-address" | "postal-code" | "cc-number" | "cc-csc" | "cc-exp" | "cc-exp-month" | "cc-exp-year";
  importantForAutofill?: "auto" | "no" | "noExcludeDescendants" | "yes" | "yesExcludeDescendants";
  textContentType?: "none" | "URL" | "addressCity" | "addressCityAndState" | "addressState" | "countryName" | "creditCardNumber" | "emailAddress" | "familyName" | "fullStreetAddress" | "givenName" | "jobTitle" | "location" | "middleName" | "name" | "namePrefix" | "nameSuffix" | "nickname" | "organizationName" | "postalCode" | "streetAddressLine1" | "streetAddressLine2" | "sublocality" | "telephoneNumber" | "username" | "password" | "newPassword" | "oneTimeCode";
  error?: string | null;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  importantForAutofill,
  textContentType,
  error,
  style,
  accessibilityLabel,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;
  const backgroundColor = focused ? theme.colors.surface : theme.colors.surfaceMuted;

  return (
    <View style={{ gap: theme.spacing.xs }}>
      {label ? (
        <Text
          style={{
            color: theme.colors.textMuted,
            fontWeight: "700",
            fontSize: 13,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrap,
          {
            borderColor,
            backgroundColor,
            borderWidth: focused ? 1.5 : 1,
          },
          style,
        ]}
      >
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSubtle}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType === "numeric" ? "number-pad" : keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          importantForAutofill={importantForAutofill}
          textContentType={textContentType}
          style={styles.input}
        />
      </View>

      {error ? (
        <Text style={{ color: theme.colors.danger, fontWeight: "700", fontSize: 13 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = {
  inputWrap: {
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: 14,
  } as const,
  input: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    padding: 0,
  } as const,
};
