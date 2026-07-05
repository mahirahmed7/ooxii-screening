import React from 'react';
import { View } from 'react-native';
import { Direction } from '../engine/staircase';
import { colors } from './theme';

/**
 * Tumbling E rendered with plain Views on the standard 5x5 optotype grid:
 * stroke width = height/5. The canonical E "points" right (arms open to the
 * right); rotation maps it to the other three orientations.
 */

const ROTATION: Record<Direction, string> = {
  right: '0deg',
  down: '90deg',
  left: '180deg',
  up: '270deg',
};

export function TumblingE({
  sizePx,
  direction,
}: {
  sizePx: number;
  direction: Direction;
}) {
  const s = Math.max(sizePx, 4); // never collapse below visibility
  const u = s / 5;
  return (
    <View
      style={{
        width: s,
        height: s,
        transform: [{ rotate: ROTATION[direction] }],
      }}
    >
      {/* spine */}
      <View style={{ position: 'absolute', left: 0, top: 0, width: u, height: s, backgroundColor: colors.ink }} />
      {/* arms */}
      <View style={{ position: 'absolute', left: 0, top: 0, width: s, height: u, backgroundColor: colors.ink }} />
      <View style={{ position: 'absolute', left: 0, top: 2 * u, width: s, height: u, backgroundColor: colors.ink }} />
      <View style={{ position: 'absolute', left: 0, top: 4 * u, width: s, height: u, backgroundColor: colors.ink }} />
    </View>
  );
}
