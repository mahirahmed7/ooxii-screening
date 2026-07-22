import React, { useRef } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { Direction } from '../engine/staircase';
import { InlineE } from './ui';
import { colors } from './theme';

/**
 * Response input. The patient (near test) swipes the direction the E points;
 * at distance the patient gestures with a hand and the tester enters it.
 * Arrow buttons are provided as an explicit fallback for testers.
 */

const MIN_SWIPE = 30;

export function SwipePad({ onAnswer }: { onAnswer: (d: Direction) => void }) {
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10,
      onPanResponderRelease: (_e, g) => {
        const { dx, dy } = g;
        if (Math.abs(dx) < MIN_SWIPE && Math.abs(dy) < MIN_SWIPE) return;
        if (Math.abs(dx) > Math.abs(dy)) onAnswer(dx > 0 ? 'right' : 'left');
        else onAnswer(dy > 0 ? 'down' : 'up');
      },
    })
  ).current;

  return (
    <View style={styles.wrap}>
      <View style={styles.swipeZone} {...responder.panHandlers}>
        <Text style={styles.hint}>
          Swipe the direction the <InlineE /> points
        </Text>
      </View>
      <View style={styles.row}>
        <Arrow label="←" onPress={() => onAnswer('left')} />
        <Arrow label="↑" onPress={() => onAnswer('up')} />
        <Arrow label="↓" onPress={() => onAnswer('down')} />
        <Arrow label="→" onPress={() => onAnswer('right')} />
      </View>
    </View>
  );
}

function Arrow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.5 }]}
      hitSlop={8}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  swipeZone: {
    height: 170,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  hint: { color: colors.muted, fontSize: 14 },
  row: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 26, fontWeight: '700' },
});
