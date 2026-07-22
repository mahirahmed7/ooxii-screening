import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, type } from './theme';

/**
 * Circular profile avatar — shows the photo if set, otherwise the screener's
 * initials on a purple disc (a neutral person glyph when there's no name yet).
 */
export function Avatar({
  uri,
  name,
  size = 32,
}: {
  uri?: string | null;
  name?: string;
  size?: number;
}) {
  const initials = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.line }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: size * 0.42 }}>
        {initials || '👤'}
      </Text>
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && { backgroundColor: colors.primary },
        variant === 'danger' && { backgroundColor: colors.red },
        variant === 'ghost' && {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.ink,
        },
        disabled && { opacity: 0.35 },
        pressed && !disabled && { opacity: 0.75 },
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          variant === 'ghost' && { color: colors.ink },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipOn]}
    >
      <Text style={[styles.chipText, selected && { color: '#fff' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Inline optotype E for instruction prose — the letter framed in a small
 * square so it matches the boxed optotype the patient sees on screen.
 */
export function InlineE() {
  return <Text style={styles.inlineE}>E</Text>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={[type.label, { marginBottom: 8 }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.ink,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  inlineE: {
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    fontWeight: '800',
    color: colors.ink,
  },
});
